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
  ProductFeaturesStructureManager,
  ProductFeaturesTreeNodeData,
} from '../ProductFeaturesStructureManager';

import { Group } from 'three';
import { Part } from '@mtk/web/model-data';
import { TreeNode } from 'shared/features/common/tree/TreeNode';

export interface PartWithVisualRepresentation {
  part: Part;
  object3d: Group;
}

export class BaseProduct extends EventTarget {
  protected internalFeaturesStructureManager = new ProductFeaturesStructureManager();
  protected internalDFMIssuesStructureManager = new ProductFeaturesStructureManager();

  error?: string;

  constructor(protected part: PartWithVisualRepresentation) {
    super();
  }

  get name(): string | null {
    return this.part.part.name;
  }

  get visualRepresentation(): Group | null {
    return this.part.object3d;
  }

  get featuresStructureManager(): ProductFeaturesStructureManager | null {
    return this.internalFeaturesStructureManager;
  }

  get dfmIssuesStructureManager(): ProductFeaturesStructureManager | null {
    return this.internalDFMIssuesStructureManager;
  }

  addFeaturesRootNode(root: TreeNode<ProductFeaturesTreeNodeData>) {
    this.internalFeaturesStructureManager.addRoot(root);
    this.internalFeaturesStructureManager.expandAllBeforeFeatureNodes(root);
  }

  addFeatureRecognitionMessage(message: string) {
    this.internalFeaturesStructureManager.message = message;
  }

  addDFMIssuesRootNode(root: TreeNode<ProductFeaturesTreeNodeData>) {
    this.internalDFMIssuesStructureManager.addRoot(root);
    this.internalDFMIssuesStructureManager.expandAllBeforeFeatureNodes(root);
  }

  addDFMAnalysisMessage(message: string) {
    this.internalDFMIssuesStructureManager.message = message;
  }
}
