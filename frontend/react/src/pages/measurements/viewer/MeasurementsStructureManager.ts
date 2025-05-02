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
  Instance,
  Model,
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
  Edge,
  Face,
  Shape,
  ShapeIterator,
  ShapePrimitivesGroup,
  ShapeType,
} from '@mtk/web/brep';
import {
  Transformation,
  Box,
  SurfaceType,
  CurveType,
} from '@mtk/web/geom';
import {
  StructureManager,
  StructureManagerTreeNodeData,
} from 'shared/features/common/viewer/StructureManager';
import {
  convertLineMaterial,
  convertMeshMaterial,
} from 'shared/features/common/viewer/ThreeJsHelper';

import { MeasurementType } from './MeasurementType';
import { ModelConvertor } from 'shared/features/common/viewer/ModelConvertor';
import { Style } from 'shared/features/common/viewer/Style';
import { TreeNode } from 'shared/features/common/tree/TreeNode';
import { SelectionType } from './SelectionType';
import { BoundingBox, Distance, ValueWithAnchorPoints } from '@mtk/web/measurements';
import { Measurement } from './Measurement';
import { BoundingBoxMeasurement } from './BoundingBoxMeasurement';
import { DistanceMeasurement } from './DistanceMeasurement';
import { PolyShape } from '@mtk/web/poly';
import { RadiusMeasurement } from './RadiusMeasurement';

export class MeasurementEvent extends Event {
  constructor(
    type: string,
    public measurement: Measurement,
  ) {
    super(type);
  }
}

export interface MeasurementsStructureManagerTreeNodeData extends StructureManagerTreeNodeData {
  body?: Body;
}

type MaterialsWithGroups = {
  material: Material | Material[];
  groups: BufferGeometry['groups'];
};

type SelectionObject = {
  entity: Body | Shape;
  object3d: Object3D;
};

export class MeasurementsStructureManager extends StructureManager<MeasurementsStructureManagerTreeNodeData> {
  readonly measurementsRootSceneObject: Object3D = new Group();

  private internalMeasurementType = MeasurementType.BOUNDING_BOX;
  private internalSelectionType = SelectionType.NODE;

  private selectedObjects: Map<Object3D, Body | Set<number>> = new Map();
  private objectToParentNodeMap: Map<Object3D, TreeNode<MeasurementsStructureManagerTreeNodeData>> = new Map();
  private originMaterialGroups: Map<Object3D, MaterialsWithGroups> = new Map();

  private modelBBox = new Box();

  private radialGeometryTypes: (SurfaceType | CurveType)[] = [
    SurfaceType.CONE, SurfaceType.CYLINDER, SurfaceType.SPHERE, SurfaceType.TORUS,
    CurveType.CIRCLE, CurveType.ELLIPSE,
  ];

  get measurementType(): MeasurementType {
    return this.internalMeasurementType;
  }

  set measurementType(type: MeasurementType) {
    this.clearSelection();
    this.internalMeasurementType = type;
    this.updateScene();
  }

  get selectionType(): SelectionType {
    return this.internalSelectionType;
  }

  set selectionType(type: SelectionType) {
    this.clearSelection();
    this.internalSelectionType = type;
    this.updateScene();
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

    this.modelBBox = BoundingBox.compute(model);
  }

  selectFromViewport(intersections: Intersection<Object3D>[] | null, isMultipleSelectionModifiersUsed?: boolean) {
    if (!isMultipleSelectionModifiersUsed) {
      this.clearSelection();
    }
    if (intersections !== null) {
      for (const intersection of intersections) {
        const matchedNode = this.findClosestTreeNodeByUUID(this.rootsNodes[0], intersection.object.uuid);
        const body = matchedNode?.data().body;
        if (!body) {
          continue;
        }

        let isBreakLoop = false;
        const bodyObject3D = matchedNode.data().sceneObject;
        switch (this.selectionType) {
          case SelectionType.NODE: {
            if (isMultipleSelectionModifiersUsed && this.selectedObjects.has(bodyObject3D)) {
              this.deselectObject(bodyObject3D);
            } else {
              this.selectBody(body, bodyObject3D);
              this.objectToParentNodeMap.set(bodyObject3D, matchedNode);
            }
            isBreakLoop = true;
            break;
          }
          case SelectionType.SHAPE: {
            const index = this.findShapeIndex(intersection);
            if (index >= 0) {
              const intersectedObject = intersection.object;
              if (isMultipleSelectionModifiersUsed && this.isShapeSelected(intersectedObject, index)) {
                this.deselectShape(intersectedObject, index);
              } else {
                this.selectShape(intersectedObject, index);
                this.objectToParentNodeMap.set(intersectedObject, matchedNode);
              }
              isBreakLoop = true;
            }
            break;
          }
          default: break;
        }
        if (isBreakLoop) {
          break;
        }
      }
    }
    const selectionObjects = this.getSelectionObjects();
    this.updateScene();
    // wait for selection scene update
    setTimeout(() => {
      this.createMeasurement(selectionObjects);
    }, 10);
  }

  clearMeasurements() {
    this.measurementsRootSceneObject.clear();
  }

  clearSelection() {
    for (const [key] of this.selectedObjects) {
      this.deselectObject(key, false);
    }
    this.selectedObjects.clear();
    this.clearMeasurements();
  }

  override clear(): void {
    super.clear();
    this.modelBBox = new Box();
    this.clearMeasurements();
  }

  private async createMeasurement(selectionObjects: SelectionObject[]) {
    let measurement: Measurement | null = null;
    switch (this.measurementType) {
      case MeasurementType.BOUNDING_BOX: {
        if (selectionObjects.length >= 1) {
          const bbox = new Box();
          selectionObjects.forEach((e) => {
            const trsf = this.getCombinedTransformation(e.object3d);
            const entity = e.entity;
            if (entity instanceof Body) {
              bbox.add(BoundingBox.compute(entity, trsf));
            } else {
              bbox.add(BoundingBox.compute(entity, trsf));
            }
          });
          if (!bbox.isInfinity()) {
            measurement = new BoundingBoxMeasurement(bbox, this.modelBBox);
          }
        }
        break;
      }
      case MeasurementType.DISTANCE: {
        if (selectionObjects.length == 2) {
          let distance: ValueWithAnchorPoints = {
            value: -1,
            points: [],
          };
          const first = selectionObjects[0].entity;
          const firstTrsf = this.getCombinedTransformation(selectionObjects[0].object3d);
          const second = selectionObjects[1].entity;
          const secondTrsf = this.getCombinedTransformation(selectionObjects[1].object3d);
          if (first instanceof Body && second instanceof Body) {
            distance = Distance.compute(first, second, firstTrsf, secondTrsf);
          } else if (first instanceof Shape && second instanceof Shape) {
            distance = Distance.compute(first, second, firstTrsf, secondTrsf);
          } else if (first instanceof PolyShape && second instanceof PolyShape) {
            distance = Distance.compute(first, second, firstTrsf, secondTrsf);
          }
          if (distance.value >= 0) {
            measurement = new DistanceMeasurement(distance, this.modelBBox);
          }
        }
        break;
      }
      case MeasurementType.RADIUS: {
        if (selectionObjects.length === 1) {
          const entity = selectionObjects[0].entity;
          const isRadial = (entity instanceof Face && this.radialGeometryTypes.includes(entity.surface.type))
            || (entity instanceof Edge && entity.curve && this.radialGeometryTypes.includes(entity.curve.type));
          if (!isRadial) {
            this.dispatchEvent(new Event('incorrectRadiusSource'));
          } else {
            const trsf = this.getCombinedTransformation(selectionObjects[0].object3d);
            measurement = new RadiusMeasurement(entity, trsf, this.modelBBox);
          }
        }
        break;
      }
      default: break;
    }
    if (measurement) {
      this.measurementsRootSceneObject.clear();
      await measurement.createObject3D();
      this.measurementsRootSceneObject.add(measurement.object3d);
      this.updateScene();
      this.dispatchEvent(new MeasurementEvent('measurementCreated', measurement));
    }
  }

  private getSelectionObjects(): SelectionObject[] {
    const objects: SelectionObject[] = [];
    for (const [key, value] of this.selectedObjects) {
      if (value instanceof Body) {
        objects.push({ entity: value, object3d: key });
      } else {
        value.forEach((index) => {
          const userData = key.userData as ShapePrimitivesGroup[];
          const body = this.objectToParentNodeMap.get(key)?.data().body;
          if (body && userData.length > index) {
            const shape = this.findShape(body, userData[index].shapeId);
            if (shape) {
              objects.push({ entity: shape, object3d: key });
            }
          }
        });
      }
    }
    return objects;
  }

  private getCombinedTransformation(object: Object3D): Transformation | null {
    const node = this.objectToParentNodeMap.get(object);
    if (!node) {
      return null;
    }
    let currentNode = node.parent;
    let trsf = new Transformation();
    while (currentNode) {
      const modelElement = currentNode.data().modelElement;
      if (modelElement instanceof Instance && modelElement.hasTransformation()) {
        trsf = modelElement.transformation.multiplied(trsf);
      }
      currentNode = currentNode.parent;
    }
    return trsf.isIdentity() ? null : trsf;
  }

  private findShape(body: Body, shapeId: bigint): Shape | null {
    let foundShape: Shape | null = null;
    if (body instanceof SolidBody || body instanceof SheetBody || body instanceof WireframeBody) {
      for (const face of new ShapeIterator(body, ShapeType.FACE)) {
        if (foundShape) {
          break;
        }
        if (face.id === shapeId) {
          foundShape = face;
        }
        for (const edge of new ShapeIterator(body, ShapeType.EDGE)) {
          if (foundShape) {
            break;
          }
          if (edge.id === shapeId) {
            foundShape = edge;
          }
        }
      }
    }
    return foundShape;
  }

  private findShapeIndex(intersection: Intersection<Object3D>) {
    const intersectedObject = intersection.object;
    const userData = intersectedObject.userData as ShapePrimitivesGroup[];
    const triangleIndex = intersection.faceIndex;
    const lineIndex = intersection.index;
    const primitiveIndex = triangleIndex != null
      ? triangleIndex
      : lineIndex != null ? lineIndex : -1;
    let shapeIndex = -1;
    for (const primitivesGroup of userData) {
      shapeIndex++;
      if (primitiveIndex >= primitivesGroup.start && primitiveIndex < primitivesGroup.start + primitivesGroup.count) {
        break;
      }
    }
    return shapeIndex;
  }

  private findClosestTreeNodeByUUID(
    treeNode: TreeNode<MeasurementsStructureManagerTreeNodeData>, uuid: string,
  ): TreeNode<MeasurementsStructureManagerTreeNodeData> | null {
    let foundNode: TreeNode<MeasurementsStructureManagerTreeNodeData> | null = null;
    this.applyForEachNode(treeNode, (node: TreeNode<MeasurementsStructureManagerTreeNodeData>) => {
      const body = node.data().body;
      const sceneObject = node.data().sceneObject;
      if (!foundNode && body) {
        this.applyForEachObjectChild(sceneObject, (object3d: Object3D) => {
          if (object3d.uuid === uuid) {
            foundNode = node;
          }
        });
      }
    });

    return foundNode;
  }

  private isShapeSelected(parentObject3D: Object3D, shapeIndex: number) {
    const shapes = this.selectedObjects.get(parentObject3D);
    if (shapes && !(shapes instanceof Body)) {
      return shapes.has(shapeIndex);
    }
    return false;
  }

  private selectBody(body: Body, parentObject3D: Object3D) {
    this.selectedObjects.set(parentObject3D, body);
    this.addBodySelectionMaterial(parentObject3D);
  }

  private deselectObject(object: Object3D, isDeleteFromSelectedObjects = true, isDeleteFromParentNodeMap = true) {
    this.applyForEachObjectChild(object, (object3d: Object3D) => {
      if (object3d instanceof Mesh || object3d instanceof LineSegments) {
        this.removeSelectionMaterial(object3d);
      }
    });
    if (isDeleteFromParentNodeMap) {
      this.objectToParentNodeMap.delete(object);
    }
    if (isDeleteFromSelectedObjects) {
      this.selectedObjects.delete(object);
    }
  }

  private selectShape(parentObject3D: Object3D, shapeIndex: number) {
    const shapes = this.selectedObjects.get(parentObject3D);
    if (shapes && !(shapes instanceof Body)) {
      shapes.add(shapeIndex);
    } else {
      this.selectedObjects.set(parentObject3D, new Set([shapeIndex]));
    }
    this.addShapeSelectionMaterial(parentObject3D, [shapeIndex]);
  }

  private deselectShape(object: Object3D, shapeIndex: number) {
    const selectedShapes = this.selectedObjects.get(object);
    if (shapeIndex !== undefined && selectedShapes && !(selectedShapes instanceof Body) && selectedShapes.size > 1) {
      selectedShapes.delete(shapeIndex);
      this.deselectObject(object, false, false);
      this.addShapeSelectionMaterial(object, [...selectedShapes]);
    } else {
      this.deselectObject(object);
    }
  }

  private addBodySelectionMaterial(parentObject3D: Object3D) {
    const style = new Style();
    this.applyForEachObjectChild(parentObject3D, (object3d: Object3D) => {
      if (object3d instanceof Mesh || object3d instanceof LineSegments) {
        const originMaterialWithGroups: MaterialsWithGroups = {
          material: [],
          groups: [],
        };
        const selectionMaterial = object3d instanceof Mesh
          ? convertMeshMaterial(style.selectedMaterial)
          : convertLineMaterial(style.selectedLineMaterial);
        const material = object3d.material;
        const groups = object3d.geometry.groups;
        originMaterialWithGroups.groups = [...groups];
        if (Array.isArray(material)) {
          originMaterialWithGroups.material = material.map((mat: Material) => {
            return mat.clone();
          });
          object3d.material = material.map((mat: Material) => {
            selectionMaterial.side = mat.side;
            return selectionMaterial;
          });
        } else {
          originMaterialWithGroups.material = material.clone();
          selectionMaterial.side = material.side;
          object3d.material = selectionMaterial;
        }
        this.originMaterialGroups.set(object3d, originMaterialWithGroups);
      }
    });
  }

  private addShapeSelectionMaterial(object3d: Object3D, shapeIndices: number[]) {
    if (!(object3d instanceof Mesh || object3d instanceof LineSegments)) {
      return;
    }

    const material = object3d.material;
    const groups = object3d.geometry.groups;
    let selectionMaterialIndex = -1;

    const origin = this.originMaterialGroups.get(object3d);
    if (!origin) {
      const originMaterialWithGroups: MaterialsWithGroups = {
        material: [],
        groups: [],
      };
      const style = new Style();
      const selectionMaterial = object3d instanceof Mesh
        ? convertMeshMaterial(style.selectedMaterial)
        : convertLineMaterial(style.selectedLineMaterial);
      originMaterialWithGroups.groups = [...groups];
      if (Array.isArray(material)) {
        selectionMaterial.side = material[0].side;
        originMaterialWithGroups.material = [...material];
        selectionMaterialIndex = material.length;
        material.push(selectionMaterial);
      } else {
        selectionMaterial.side = material.side;
        originMaterialWithGroups.material = material.clone();
        selectionMaterialIndex = 1;
        object3d.material = [material.clone(), selectionMaterial];
      }
      this.originMaterialGroups.set(object3d, originMaterialWithGroups);
    } else {
      selectionMaterialIndex = (Array.isArray(material) ? material.length - 1 : 0);
    }

    const userData = object3d.userData as ShapePrimitivesGroup[];
    const multiplier = object3d instanceof Mesh ? 3 : 2;
    shapeIndices.sort((first, second) => first - second);
    let startIndex = 0;
    const groupsClone = [...groups];
    object3d.geometry.groups.length = 0;
    for (let i = 0; i < groupsClone.length; i++) {
      const group = groupsClone[i];

      if (startIndex >= shapeIndices.length) {
        object3d.geometry.addGroup(group.start, group.count, group.materialIndex);
      }

      for (let j = startIndex; j < shapeIndices.length; j++) {
        const shapeIndex = shapeIndices[j];
        const primitivesGroup = userData[shapeIndex];
        const offset = object3d instanceof Mesh ? 0 : shapeIndex;
        const start = (primitivesGroup.start - offset) * multiplier;
        const end = start + primitivesGroup.count * multiplier;

        if (group.start + group.count <= start || group.start >= end) {
          object3d.geometry.addGroup(group.start, group.count, group.materialIndex);
          break;
        }

        if (group.start < start && group.start + group.count > start) {
          object3d.geometry.addGroup(group.start, start - group.start, group.materialIndex);
        }

        if (end <= group.start + group.count) {
          object3d.geometry.addGroup(start, end - start, selectionMaterialIndex);
          if (end < group.start + group.count) {
            object3d.geometry.addGroup(end, group.start + group.count - end, group.materialIndex);
          }
          startIndex++;
        } else {
          break;
        }
      }
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

  private applyForEachNode(
    parent: TreeNode<MeasurementsStructureManagerTreeNodeData>,
    action: (node: TreeNode<MeasurementsStructureManagerTreeNodeData>) => void,
  ) {
    action(parent);
    parent.children.forEach((child) => this.applyForEachNode(child, action));
  }

  private applyForEachObjectChild(object3d: Object3D, action: (object3d: Object3D) => void) {
    action(object3d);
    object3d.children.forEach((child) => this.applyForEachObjectChild(child, action));
  }
}
