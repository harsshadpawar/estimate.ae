// ****************************************************************************
//
// Copyright (C) 2008-2014, Roman Lygin. All rights reserved.
// Copyright (C) 2014-2025, CADEX. All rights reserved.
//
// This file is part of the Manufacturing Toolkit software.
//
// You may use this file under the terms of the BSD license as follows:
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
// * Redistributions of source code must retain the above copyright notice,
//   this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
//
// ****************************************************************************

import {
  Body,
  Model,
  ModelElement,
  SheetBody,
  SolidBody,
  WireframeBody,
} from '@mtk/web/model-data';
import {
  BufferGeometry,
  Group,
  Intersection,
  LineSegments,
  Material,
  Mesh,
  Object3D,
} from 'three';
import {
  Shape,
  ShapeIterator,
  ShapePrimitivesGroup,
  ShapeType,
} from '@mtk/web/brep';
import {
  StructureManager,
  StructureManagerTreeNodeData,
} from 'shared/features/common/viewer/StructureManager';
import {
  convertLineMaterial,
  convertMeshMaterial,
} from 'shared/features/common/viewer/ThreeJsHelper';

import { ModelConvertor } from 'shared/features/common/viewer/ModelConvertor';
import { SelectionMode } from 'shared/features/common/viewer/SelectionMode';
import { Style } from 'shared/features/common/viewer/Style';
import { TreeNode } from 'shared/features/common/tree/TreeNode';
import { TreeSelectionEvent } from 'shared/features/common/tree/TreeEvents';
import { VisualMaterial } from '@mtk/web/materials';

export interface SelectionHandlingStructureManagerTreeNodeData extends StructureManagerTreeNodeData {
  modelElement?: ModelElement;
  body?: Body;
  style: Style;
}

interface MaterialsWithGroups {
  material: Material | Material[];
  groups: BufferGeometry['groups'];
}

export class SelectionHandlingStructureManager extends StructureManager<SelectionHandlingStructureManagerTreeNodeData> {
  selectionMode = SelectionMode.Node;

  private originMaterialGroups: Map<Object3D, MaterialsWithGroups> = new Map();

  constructor() {
    super();
    this.addEventListener('selectionChanged', this.onSelectionChanged);
    this.addEventListener('breakSelection', (event) => {
      this.resetNodesMaterial(event.nodes);
    });
  }

  async loadModel(model: Model) {
    this.clear();

    const style = new Style();
    const fileSceneObject = new Group();
    const fileNode = new TreeNode(model.name || 'Unnamed model', 'file', { sceneObject: fileSceneObject, style });
    fileSceneObject.name = fileNode.text;
    const converter = new ModelConvertor(fileNode);
    model.accept(converter);

    this.addRoot(fileNode);
    this.showAllNodes();
    this.modelSceneObject.add(fileSceneObject);
  }

  selectFromViewport(intersections: Intersection<Object3D>[] | null, isMultipleSelectionModifiersUsed?: boolean) {
    if (!isMultipleSelectionModifiersUsed) {
      this.deselectAllNodes();
    }
    if (intersections !== null) {
      for (const intersection of intersections) {
        const matchSelectionMode = this.selectionMode === SelectionMode.Node
          || (this.selectionMode === SelectionMode.Face && intersection.faceIndex != null)
          || (this.selectionMode === SelectionMode.Edge && intersection.index != null);
        if (!matchSelectionMode) {
          continue;
        }

        const matchedNode = this.findClosestTreeNodeByUUID(this.rootsNodes[0], intersection.object.uuid);

        if (matchedNode) {
          if (isMultipleSelectionModifiersUsed && this._selectedNodes.has(matchedNode)) {
            this.deselectNode(matchedNode);
          } else {
            this.selectNode(matchedNode, false, intersection);
          }
          break;
        }
      }
    }
  }

  private findShape(
    node: TreeNode<SelectionHandlingStructureManagerTreeNodeData>,
    shapeId: bigint,
    shapeType: ShapeType,
  ): Shape | null {
    let foundShape: Shape | null = null;
    this.applyForEachNode(node, (treeNode: TreeNode<SelectionHandlingStructureManagerTreeNodeData>) => {
      const body = treeNode.data().body;
      if (!foundShape
        && body
        && (body instanceof SolidBody || body instanceof SheetBody || body instanceof WireframeBody)) {
        for (const shape of new ShapeIterator(body, shapeType)) {
          if (shape.id === shapeId) {
            foundShape = shape;
            break;
          }
        }
      }
    });
    return foundShape;
  }

  private findClosestTreeNodeByUUID(
    treeNode: TreeNode<SelectionHandlingStructureManagerTreeNodeData>, uuid: string,
  ): TreeNode<SelectionHandlingStructureManagerTreeNodeData> | null {
    const searchSceneObject = (sceneObject: Object3D, uuid: string): boolean => {
      if (sceneObject.uuid === uuid) {
        return true;
      }
      return sceneObject.children.some((child) => searchSceneObject(child, uuid));
    };

    for (const childNode of treeNode.children) {
      const result = this.findClosestTreeNodeByUUID(childNode, uuid);
      if (result) {
        return result;
      }
    }

    const treeNodeData = treeNode.data();
    if (treeNodeData?.sceneObject && searchSceneObject(treeNodeData.sceneObject, uuid)) {
      return treeNode.parent?.type === 'part' ? treeNode.parent : treeNode;
    }

    return null;
  }

  private getClosestParentOriginalMaterial(
    treeNode: TreeNode<SelectionHandlingStructureManagerTreeNodeData>,
  ): VisualMaterial | null {
    let currentNode = treeNode.parent;
    while (currentNode) {
      const nodeData = currentNode.data();
      if (nodeData.style.originalMaterial) {
        return nodeData.style.originalMaterial;
      }
      currentNode = currentNode.parent;
    }
    return null;
  }

  private applyForEachNode(
    parent: TreeNode<SelectionHandlingStructureManagerTreeNodeData>,
    action: (node: TreeNode<SelectionHandlingStructureManagerTreeNodeData>) => void,
  ) {
    action(parent);
    parent.children.forEach((child) => this.applyForEachNode(child, action));
  }

  private applyForEachObjectChild(object3d: Object3D, action: (object3d: Object3D) => void) {
    action(object3d);
    object3d.children.forEach((child) => this.applyForEachObjectChild(child, action));
  }

  private onSelectionChanged(event: TreeSelectionEvent<SelectionHandlingStructureManagerTreeNodeData>) {
    this.resetNodesMaterial(event.nodes, false);
    this.changeSelectedNodesMaterial(event.intersection);
    this.updateScene();
  }

  private changeSelectedNodesMaterial(intersection?: Intersection<Object3D>) {
    for (const node of this._selectedNodes) {
      const style = node.data().style;
      switch (this.selectionMode) {
        case SelectionMode.Node: {
          this.applyMaterialRecursively(node, style.selectedMaterial, style.selectedLineMaterial);
          this.dispatchEvent(new TreeSelectionEvent('selectedFromViewport', [...this._selectedNodes], intersection));
          break;
        }
        case SelectionMode.Face: {
          this.selectShape(node, ShapeType.FACE, intersection);
          break;
        }
        case SelectionMode.Edge: {
          this.selectShape(node, ShapeType.EDGE, intersection);
          break;
        }
        default: break;
      }
    }
  }

  private resetNodesMaterial(
    nodes: TreeNode<SelectionHandlingStructureManagerTreeNodeData>[], isNeedToUpdateViewer: boolean = true,
  ) {
    for (const node of nodes) {
      this.applyForEachNode(node, (treeNode: TreeNode<SelectionHandlingStructureManagerTreeNodeData>) => {
        const data = treeNode.data();
        if (data.sceneObject) {
          this.applyForEachObjectChild(data.sceneObject, (object3d: Object3D) => {
            if (object3d instanceof Mesh || object3d instanceof LineSegments) {
              this.removeSelectionMaterial(object3d);
            }
          });
          const material = this.getClosestParentOriginalMaterial(treeNode);
          this.applyMaterialRecursively(
            treeNode, material ? material : Style.defaultMaterial, Style.defaultLineMaterial,
          );
        }
      });
    }
    if (isNeedToUpdateViewer) {
      this.updateScene();
    }
  }

  private selectShape(
    node: TreeNode<SelectionHandlingStructureManagerTreeNodeData>,
    shapeType: ShapeType,
    intersection?: Intersection<Object3D>,
  ) {
    if (!intersection) {
      return;
    }
    if ((shapeType === ShapeType.FACE && intersection.faceIndex == null)
      || (shapeType === ShapeType.EDGE && intersection.index == null)) {
      return;
    }
    const shapeId = this.applySelectionMaterialToShape(intersection);
    if (shapeId >= BigInt(0)) {
      const shape = this.findShape(node, shapeId, shapeType);
      if (shape) {
        this.dispatchEvent(new TreeSelectionEvent('selectedFromViewport', [node], intersection, [shape]));
      }
    }
  }

  private applySelectionMaterialToShape(intersection: Intersection<Object3D>): bigint {
    const intersectedObject = intersection.object;
    const userData = intersectedObject.userData as ShapePrimitivesGroup[];
    const triangleIndex = intersection.faceIndex;
    const lineIndex = intersection.index;
    const primitiveIndex = triangleIndex != null
      ? triangleIndex
      : lineIndex != null ? lineIndex : -1;
    let shapeId: bigint = BigInt(-1);
    let shapeIndex = -1;
    for (const primitivesGroup of userData) {
      shapeIndex++;
      if (primitiveIndex >= primitivesGroup.start && primitiveIndex < primitivesGroup.start + primitivesGroup.count) {
        shapeId = primitivesGroup.shapeId;
        this.addSelectionMaterial(intersectedObject, primitivesGroup, shapeIndex);
        break;
      }
    }
    return shapeId;
  }

  private addSelectionMaterial(object3d: Object3D, primitivesGroup: ShapePrimitivesGroup, shapeIndex: number) {
    const originMaterialWithGroups: MaterialsWithGroups = {
      material: [],
      groups: [],
    };
    const style = new Style();
    const selectionMaterial = object3d instanceof Mesh
      ? convertMeshMaterial(style.selectedMaterial)
      : convertLineMaterial(style.selectedLineMaterial);
    if (object3d instanceof Mesh || object3d instanceof LineSegments) {
      const material = object3d.material;
      const groups = object3d.geometry.groups;
      originMaterialWithGroups.groups = [...groups];
      let selectionMaterialIndex = -1;
      if (Array.isArray(material)) {
        originMaterialWithGroups.material = [...material];
        selectionMaterialIndex = material.length;
        material.push(selectionMaterial);
      } else {
        originMaterialWithGroups.material = material.clone();
        selectionMaterialIndex = 1;
        object3d.material = [material.clone(), selectionMaterial];
      }
      this.originMaterialGroups.set(object3d, originMaterialWithGroups);
      const multiplier = object3d instanceof Mesh ? 3 : 2;
      const offset = object3d instanceof Mesh ? 0 : shapeIndex;
      const start = (primitivesGroup.start - offset) * multiplier;
      const end = start + primitivesGroup.count * multiplier;
      let beforeIndex = -1;
      let afterIndex = groups.length;
      const addedGroups: BufferGeometry['groups'] = [];
      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        if (group.start <= start && group.start + group.count > start) {
          beforeIndex = i;
          if (group.start < start) {
            addedGroups.push({
              start: group.start,
              count: start - group.start,
              materialIndex: group.materialIndex,
            });
          }
        }
        if (end <= group.start + group.count) {
          afterIndex = i + 1;
          addedGroups.push({
            start: start,
            count: end - start,
            materialIndex: selectionMaterialIndex,
          });
          if (end < group.start + group.count) {
            addedGroups.push({
              start: end,
              count: group.start + group.count - end,
              materialIndex: group.materialIndex,
            });
          }
          break;
        }
      }
      const beforeGroups: BufferGeometry['groups'] = beforeIndex < 0 ? [] : groups.slice(0, beforeIndex);
      const afterGroups: BufferGeometry['groups'] = afterIndex < groups.length ? groups.slice(afterIndex) : [];
      object3d.geometry.groups = [...beforeGroups, ...addedGroups, ...afterGroups];
    }
  }

  private removeSelectionMaterial(object3d: Object3D) {
    const originMaterialWithGroups = this.originMaterialGroups.get(object3d);
    if (originMaterialWithGroups && (object3d instanceof Mesh || object3d instanceof LineSegments)) {
      object3d.material = originMaterialWithGroups.material;
      object3d.geometry.groups = originMaterialWithGroups.groups;
      this.originMaterialGroups.delete(object3d);
    }
  }
}
