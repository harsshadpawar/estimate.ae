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
  Assembly,
  Instance,
  ModelElement,
  ModelElementVisitor,
  Part,
  PolyBody,
  SheetBody,
  SolidBody,
  WireframeBody,
} from '@mtk/web/model-data';
import {
  ModelDataConverter,
  convertTransformation,
} from './ThreeJsHelper';

import { Group } from 'three';
import { StructureManagerTreeNodeData } from './StructureManager';
import { Style } from './Style';
import { TreeNode } from '../tree/TreeNode';
import { VisualMaterial } from '@mtk/web/materials';

export class ModelConvertor implements ModelElementVisitor {
  private modelDataConvertor = new ModelDataConverter();
  private treeNodeStack: TreeNode<StructureManagerTreeNodeData>[];

  constructor(rootNode: TreeNode<StructureManagerTreeNodeData>) {
    this.treeNodeStack = [rootNode];
  }

  visitModelElement(modelElement: ModelElement, type: string) {
    const name = modelElement.name || `Unnamed ${type}`;
    const sceneObject = new Group();
    sceneObject.name = name;
    const style = new Style();
    style.originalMaterial = modelElement.material;
    const treeNode = new TreeNode<StructureManagerTreeNodeData>(name, type, { modelElement, sceneObject, style });
    const parentTreeNode = this.treeNodeStack[this.treeNodeStack.length - 1];
    parentTreeNode.addNode(treeNode);
    parentTreeNode.data().sceneObject.add(sceneObject);
    return treeNode;
  }

  visitAssemblyEnter(assembly: Assembly) {
    const assemblyNode = this.visitModelElement(assembly, 'assembly');
    this.treeNodeStack.push(assemblyNode);
    return true;
  }

  visitAssemblyLeave() {
    this.treeNodeStack.pop();
  }

  visitInstanceEnter(instance: Instance) {
    const instanceNode = this.visitModelElement(instance, 'instance');
    this.treeNodeStack.push(instanceNode);
    if (instance.transformation) {
      const sceneObject = instanceNode.data().sceneObject;
      sceneObject.matrix = convertTransformation(instance.transformation);
      // manually decompose matrix into components to actualize the object state
      sceneObject.matrix.decompose(sceneObject.position, sceneObject.quaternion, sceneObject.scale);
      sceneObject.matrixWorldNeedsUpdate = true;
    }
    return true;
  }

  visitInstanceLeave() {
    this.treeNodeStack.pop();
  }

  visitPart(part: Part) {
    const partNode = this.visitModelElement(part, 'part');
    const partSceneObject = partNode.data().sceneObject;
    let partMaterial: VisualMaterial | null | undefined = part.material;
    for (let i = this.treeNodeStack.length - 1; i >= 0 && !partMaterial; i--) {
      const parent = this.treeNodeStack[i];
      partMaterial = parent.data().modelElement?.material;
    }

    for (const body of part.bodies) {
      const bodySceneObject = this.modelDataConvertor.convertBody(body, partMaterial || undefined);
      partSceneObject.add(bodySceneObject);
      let bodyName = 'Unknown Body';
      if (body instanceof PolyBody) {
        bodyName = body.name || 'Poly Body';
      } else {
        if (body instanceof WireframeBody) {
          bodyName = body.name || 'Wireframe Body';
        } else if (body instanceof SheetBody) {
          bodyName = body.name || 'Sheet Body';
        } else if (body instanceof SolidBody) {
          bodyName = body.name || body.solid?.name || 'Solid Body';
        } else {
          bodyName = body.name || 'B-Rep Body';
        }
      }
      bodySceneObject.name = bodyName;
      const style = new Style();
      style.originalMaterial = body.material;
      const bodyTreeNode = new TreeNode<StructureManagerTreeNodeData>(bodyName, 'body', { sceneObject: bodySceneObject, body, style });
      partNode.addNode(bodyTreeNode);
    }
  }
}
