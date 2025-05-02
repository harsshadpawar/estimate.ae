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
} from '@mtk/web/model-data';
import {
  Group,
  Intersection,
  Object3D,
} from 'three';
import {
  StructureManager,
  StructureManagerTreeNodeData,
} from 'shared/features/common/viewer/StructureManager';

import { ModelConvertor } from 'shared/features/common/viewer/ModelConvertor';
import { Style } from 'shared/features/common/viewer/Style';
import { TreeChangedEvent } from 'shared/features/common/tree/TreeEvents';
import { TreeNode } from 'shared/features/common/tree/TreeNode';
import { VisualMaterial } from '@mtk/web/materials';

export interface ProductStructureManagerTreeNodeData extends StructureManagerTreeNodeData {
  body?: Body;
  style: Style;
}

export class ProductStructureManager extends StructureManager<ProductStructureManagerTreeNodeData> {
  constructor() {
    super();
    this.addEventListener('visibilityChanged', this.onVisibilityChanged);
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
        const matchedNode = this.findClosestTreeNodeByUUID(this.rootsNodes[0], intersection.object.uuid);

        if (matchedNode && !this.isNodeHidden(matchedNode)) {
          if (isMultipleSelectionModifiersUsed && this._selectedNodes.has(matchedNode)) {
            this.deselectNode(matchedNode);
          } else {
            this.selectNode(matchedNode, false);
            this.expandToNode(matchedNode);
          }
          break;
        }
      }
    }
  }

  private onVisibilityChanged = (event: TreeChangedEvent<ProductStructureManagerTreeNodeData>) => {
    event.nodes.forEach((node: TreeNode<ProductStructureManagerTreeNodeData>) => {
      node.data().sceneObject.visible = !this.isNodeHidden(node);
    });
  };

  private findClosestTreeNodeByUUID(
    treeNode: TreeNode<ProductStructureManagerTreeNodeData>, uuid: string,
  ): TreeNode<ProductStructureManagerTreeNodeData> | null {
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
    treeNode: TreeNode<ProductStructureManagerTreeNodeData>,
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
    parent: TreeNode<ProductStructureManagerTreeNodeData>,
    action: (node: TreeNode<ProductStructureManagerTreeNodeData>) => void,
  ) {
    action(parent);
    parent.children.forEach((child) => this.applyForEachNode(child, action));
  }

  private onSelectionChanged(event: TreeChangedEvent<ProductStructureManagerTreeNodeData>) {
    this.resetNodesMaterial(event.nodes, false);
    this.changeSelectedNodesMaterial();
    this.updateScene();
  }

  private changeSelectedNodesMaterial() {
    for (const node of this._selectedNodes) {
      const style = node.data().style;
      this.applyMaterialRecursively(node, style.selectedMaterial, style.selectedLineMaterial);
    }
  }

  private resetNodesMaterial(nodes: TreeNode<ProductStructureManagerTreeNodeData>[], isNeedToUpdateViewer: boolean = true) {
    for (const node of nodes) {
      this.applyForEachNode(node, (treeNode: TreeNode<ProductStructureManagerTreeNodeData>) => {
        const data = treeNode.data();
        if (data.sceneObject) {
          const material = this.getClosestParentOriginalMaterial(treeNode);
          this.applyMaterialRecursively(treeNode, material ? material : Style.defaultMaterial, Style.defaultLineMaterial);
        }
      });
    }
    if (isNeedToUpdateViewer) {
      this.updateScene();
    }
  }
}
