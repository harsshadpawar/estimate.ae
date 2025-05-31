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

import { VisualMaterial } from '@mtk/web/materials';
import {
  Model,
  ModelElement,
} from '@mtk/web/model-data';

import { Style } from './Style';
import { Tree } from '../tree/Tree';
import { TreeEvent } from '../tree/TreeEvents';
import { TreeNode } from '../tree/TreeNode';
import { changeObject3dMaterial } from './ThreeJsHelper';

import {
  Group,
  Object3D,
} from 'three';
export interface StructureManagerTreeNodeData {
  sceneObject: Object3D;
  style?: Style;
  ghosted?: boolean;
  selected?: boolean;
  modelElement?: ModelElement;
  [key: string]: unknown;
}

export abstract class StructureManager<T extends StructureManagerTreeNodeData> extends Tree<T> {
  modelSceneObject: Object3D = new Group();

  constructor() {
    super();
    this.modelSceneObject.name = 'Model';
  }

  override clear(): void {
    super.clear();
    this.modelSceneObject.clear();
  }

  enableGhostMode(treeNode: TreeNode<StructureManagerTreeNodeData>) {
    const data = treeNode.data();
    data.ghosted = true;
    const style = data.style || new Style();
    this.applyMaterialRecursively(treeNode, style.ghostMaterial, style.ghostLineMaterial);
  }

  applyMaterialRecursively(
    node: TreeNode<StructureManagerTreeNodeData>, meshMaterial: VisualMaterial, lineMaterial: VisualMaterial,
  ) {
    const nodeData = node.data();
    if (nodeData.sceneObject) {
      changeObject3dMaterial(nodeData.sceneObject, meshMaterial, lineMaterial);
    }
    node.children.forEach((child) => this.applyMaterialRecursively(child, meshMaterial, lineMaterial));
  }

  updateScene() {
    this.dispatchEvent(new TreeEvent('sceneNeedUpdate'));
  }

  abstract loadModel(model: Model): Promise<void>;
}
