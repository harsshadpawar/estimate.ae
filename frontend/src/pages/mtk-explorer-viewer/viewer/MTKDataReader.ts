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
  TypeToModelMap,
  getModelType,
} from './helpers/manufacturingProcessHelper';

import { BaseProduct } from './base/BaseProduct';
import { FileData } from 'shared/features/mtk-explorer/base/FileData';
import { MTKDataConverter } from './MTKDataConverter';

type NameToFilesMap = Map<string, FileData[]>;
export class MTKDataReader {
  private error?: string;

  async readFolder(files: FileData[]): Promise<BaseProduct[]> {
    const filesToProcess: NameToFilesMap = new Map();
    for (const file of files) {
      const filePath = file.relativePath.replace(/\\/g, '/').split('/');
      if (filePath.length === 2 && file.name.endsWith('.json')) {
        filesToProcess.set(file.name, [file]);
      } else if (filePath.length === 3 && filePath[1].endsWith('.mtkweb')) {
        const mtkwebModelName = filePath[1];
        const mtkwebModelFiles = filesToProcess.get(mtkwebModelName);
        if (mtkwebModelFiles) {
          mtkwebModelFiles.push(file);
        } else {
          filesToProcess.set(mtkwebModelName, [file]);
        }
      }
    }

    if (!this.isCorrectFileStructure(filesToProcess)) {
      alert(this.error);
      return [];
    }
    return await this.getProductList(filesToProcess);
  }

  private isCorrectFileStructure(files: NameToFilesMap): boolean {
    let jsonCount = 0;
    let mtkwebCount = 0;
    files.forEach((_value, key) => {
      if (key.endsWith('.json')) {
        jsonCount++;
      } else if (key.endsWith('.mtkweb')) {
        mtkwebCount++;
      }
    });
    if (jsonCount === 0) {
      this.error = 'Not found process_data.json file.';
    }
    if (mtkwebCount === 0) {
      const errorMessage = 'Not found any *.mtkweb folders.';
      this.error = this.error ? `${this.error} ${errorMessage}` : errorMessage;
    }
    // Manufacturing model folder should contains at least folder with mtkweb model and process_data.json.
    return jsonCount > 0 && mtkwebCount > 0;
  }

  private async getProductList(files: NameToFilesMap): Promise<BaseProduct[]> {
    let processData = '';
    const models: TypeToModelMap = new Map();
    for (const [key, value] of files) {
      if (key.endsWith('.json')) {
        processData = await this.readJSON(value[0]);
      } else if (key.endsWith('.mtkweb')) {
        try {
          const model = await this.readMTKWEBModel(value);
          const modelType = getModelType(key);
          models.set(modelType, model);
        } catch (error) {
          this.error = `Unable to read ${key}. ERROR: ${error}`;
        }
      }
    }

    if (this.error) {
      alert(this.error);
      return [];
    }

    let products: BaseProduct[] = [];
    try {
      const mtkDataConverter = new MTKDataConverter(models, processData);
      products = mtkDataConverter.convert();
    } catch (error) {
      this.error = error as string;
      alert(this.error);
    }
    return products;
  }

  private async readJSON(file: FileData): Promise<string> {
    return await file.text();
  }

  private async readMTKWEBModel(files: FileData[]): Promise<Model> {
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
    const model = new Model();
    const modelReader = new ModelReader();
    await modelReader.read(sceneGraphFile.name, model, provider);
    return model;
  }
}
