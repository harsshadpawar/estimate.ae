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
  DataProvider,
  Model,
  ModelReader,
} from '@mtk/web/model-data';
import {
  StructureManager,
  StructureManagerTreeNodeData,
} from './StructureManager';

import { MTKWEBArchive } from '../../../helpers/MTKWEBArchive';
import { Vector3 } from 'three';
import { Viewport } from './Viewport';

export abstract class BaseViewer<
  TreeNodeDataType extends StructureManagerTreeNodeData,
  StructureManagerType extends StructureManager<TreeNodeDataType> = StructureManager<TreeNodeDataType>> {
  viewport = new Viewport();
  protected abstract internalStructureManager: StructureManagerType;

  readonly model = new Model();

  constructor() {
    this.viewport.addEventListener('initialized', () => {
      this.internalStructureManager.addEventListener('visibilityChanged', this.updateViewportScene);
      this.internalStructureManager.addEventListener('selectionChanged', this.updateViewportScene);
      this.internalStructureManager.addEventListener('sceneNeedUpdate', this.updateViewportScene);
      this.viewport.addRoot(this.structureManager.modelSceneObject);
      this.viewport.fitAll();
    });
  }

  get structureManager() {
    return this.internalStructureManager;
  }

  clear() {
    this.model.clear();
    this.structureManager.clear();
  }

  async loadModelArchive(name: string, data: ArrayBuffer) {
    const archive = await MTKWEBArchive.parse(data);
    const provider: DataProvider = (filename: string) => {
      return archive.getFile(filename);
    };
    const modelReader = new ModelReader();
    await modelReader.read(archive.sceneGraphFileName, this.model, provider);
    console.log(`Model '${name}' is loaded\n`);

    this.model.name = name;

    await this.structureManager.loadModel(this.model);

    await this.setCameraPosition();
    await this.viewport.fitAll();
  }

  async loadModelFolder(name: string, files: File[]) {
    const sceneGraphFile = files.find((f) => f.name.endsWith('.mtkweb'));
    if (!sceneGraphFile) {
      throw new Error('The folder does not contain any MTKWEB file.');
    }
    const provider: DataProvider = (filename: string) => {
      const file = files.find((f) => f.name === filename);
      if (!file) {
        throw new Error(`Unable to get file "${filename}"`);
      }
      return file.arrayBuffer();
    };
    const modelReader = new ModelReader();
    await modelReader.read(sceneGraphFile.name, this.model, provider);

    if (!this.model.name) {
      this.model.name = name;
    }

    console.log(`Model '${this.model.name}' is loaded\n`);

    await this.structureManager.loadModel(this.model);

    await this.setCameraPosition();
    await this.viewport.fitAll();
  }

  dispose() {
    this.clear();
    this.viewport.dispose();
  }

  private updateViewportScene = () => {
    this.viewport.updateScene();
  };

  private async setCameraPosition() {
    const box = this.viewport.rootsBox;
    if (box.isEmpty()) {
      return;
    }

    const center = new Vector3();
    box.getCenter(center);
    const dist = box.min.distanceTo(box.max) / 1.2;
    const pos = new Vector3().addVectors(center, new Vector3(dist, -dist, dist));

    this.viewport.cameraControls.setLookAt(pos.x, pos.y, pos.z, center.x, center.y, center.z);
  }
}
