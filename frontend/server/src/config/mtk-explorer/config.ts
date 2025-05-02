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
  Application,
  Request,
  Response,
} from 'express';
import {
  checkMTKConverterInteraction,
  convertModelInteraction,
  getConvertedModelInteraction,
  getMTKModelPreviewsInteraction,
  saveThumbnailInteraction,
} from '../../../../shared/src/server-interaction/mtk-explorer/ServerInteraction';

import { EncodedFileData } from '../../../../shared/src/features/mtk-explorer/base/FileData';
import { MTKModelPreview } from '../../../../shared/src/features/mtk-explorer/base/MTKModel';
import { ModelToConvert } from '../../../../shared/src/server-interaction/mtk-explorer/ModelToConvert';
import { exec } from 'child_process';
import fs from 'fs';
import { getProcess } from '../../../../shared/src/features/mtk-explorer/base/ManufacturingProcess';
import path from 'path';
import { setupMulterStorage } from '../../common/MulterStorage';

const mtkConverterExecutableName = 'MTKConverter';
const mtkConverterFolder = path.resolve(`assets${path.sep}MTKConverter`);
const findMTKConverterExecutable = () => {
  const files = fs.readdirSync(mtkConverterFolder) as string[];
  const mtkConverterFile = files.find((f) => path.parse(f).name === mtkConverterExecutableName);
  return mtkConverterFile ? mtkConverterFile : mtkConverterExecutableName;
};
const mtkConverterExecutable = findMTKConverterExecutable();

const mtkConverterPath = path.join(mtkConverterFolder, mtkConverterExecutable);
const mtkModelsPath = path.resolve(`assets${path.sep}mtk_models`);

const upload = setupMulterStorage(mtkModelsPath);

const getAllFiles = (directoryPath: string, directoryName: string) => {
  const data: EncodedFileData[] = [];
  const files = fs.readdirSync(directoryPath, { recursive: true }) as string[];
  for (const file of files) {
    const fullPath = path.join(directoryPath, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      continue;
    }
    const buffer = fs.readFileSync(fullPath);
    const fileData = { name: path.basename(file), relativePath: path.join(directoryName, file), buffer: buffer.toString('base64') };
    data.push(fileData);
  }
  return data;
};

export function setupServer(app: Application) {
  app.get(checkMTKConverterInteraction.path, (_req: Request, res: Response) => {
    if (!mtkConverterPath) {
      return res.status(400).send('File path is required');
    }
    if (!fs.existsSync(mtkConverterPath)) {
      return res.status(400).send(`${mtkConverterPath} is not exists`);
    }
    return res.send(`${mtkConverterPath} exists`);
  });

  app.get(getMTKModelPreviewsInteraction.path, (_req: Request, res: Response) => {
    const createResponseBody = () => {
      const savedModels: MTKModelPreview[] = [];
      const processes = fs.readdirSync(mtkModelsPath) as string[];
      for (const process of processes) {
        const processPath = path.join(mtkModelsPath, process);
        const processStats = fs.statSync(processPath);
        if (!getProcess(process) || !processStats.isDirectory()) {
          continue;
        }
        const models = fs.readdirSync(processPath) as string[];
        for (const model of models) {
          const modelPath = path.join(processPath, model);
          const modelStats = fs.statSync(modelPath);
          if (!modelStats.isDirectory()) {
            continue;
          }
          const thumbnailPath = path.join(modelPath, 'thumbnail.png');
          let thumbnail = '';
          if (fs.existsSync(thumbnailPath)) {
            thumbnail = fs.readFileSync(thumbnailPath).toString('base64');
          }
          savedModels.push({ name: model, process: process, thumbnail: thumbnail });
        }
      }
      return savedModels;
    };
    return res.json(getMTKModelPreviewsInteraction.responseBody(createResponseBody));
  });

  app.get(getConvertedModelInteraction.path, (req: Request, res: Response) => {
    const getMTKModel = () => {
      return { name: req.params.name, process: req.params.process };
    };
    const model = getConvertedModelInteraction.requestBody(getMTKModel);
    const processFolder = path.join(mtkModelsPath, model.process, model.name);
    const files = getAllFiles(processFolder, model.name);
    res.json(getConvertedModelInteraction.responseBody(
      () => { return files; }),
    );
  });

  app.post(convertModelInteraction.path, upload.single('file'), (req: Request, res: Response) => {
    const getModelToConvert = () => {
      const model = req.body as ModelToConvert;
      model.filename = req.file?.filename;
      return model;
    };

    const model = convertModelInteraction.requestBody(getModelToConvert);
    const modelName = model.filename;
    const originFilePath = req.file?.path;
    if (!modelName || !originFilePath) {
      return res.status(400).send('Origin file required');
    }

    const exportPath = path.join(mtkModelsPath, model.process, modelName);
    if (!fs.existsSync(exportPath)) {
      fs.mkdirSync(exportPath, { recursive: true });
    }

    const getConvertModelResult = (convertedModel: EncodedFileData[] | null, output: string, error: string | null) => {
      return { convertedModel: convertedModel, output: output, error: error };
    };

    exec(`"${mtkConverterPath}" -i "${originFilePath}" -p "${model.process}" -e "${exportPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).json(
          convertModelInteraction.responseBody(
            () => { return getConvertModelResult(null, stdout, stderr); },
          ),
        );
      }
      const files = getAllFiles(exportPath, modelName);
      res.json(convertModelInteraction.responseBody(
        () => { return getConvertModelResult(files, stdout, null); },
      ),
      );
    });
  });

  app.post(saveThumbnailInteraction.path, upload.single('file'), (_req: Request, res: Response) => {
    res.send('Thumbnail saved.');
  });
}
