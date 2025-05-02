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
  StructureManager,
  StructureManagerTreeNodeData,
} from 'shared/features/common/viewer/StructureManager';

import { Group } from 'three';
import { Model } from '@mtk/web/model-data';
import { ModelConvertor } from 'shared/features/common/viewer/ModelConvertor';
import { TreeNode } from 'shared/features/common/tree/TreeNode';

export interface BaseViewerStructureManagerTreeNodeData extends StructureManagerTreeNodeData {}

export class BaseViewerStructureManager extends StructureManager<BaseViewerStructureManagerTreeNodeData> {
  async loadModel(model: Model) {
    this.clear();

    const fileSceneObject = new Group();
    const fileNode = new TreeNode(model.name || 'Unnamed model', 'file', { sceneObject: fileSceneObject });
    fileSceneObject.name = fileNode.text;
    const converter = new ModelConvertor(fileNode);
    model.accept(converter);

    this.addRoot(fileNode);
    this.showAllNodes();
    this.modelSceneObject.add(fileSceneObject);
  }
}
