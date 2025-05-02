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
  EncodedFileData,
  FileData,
} from '../base/FileData';
import {
  MTKModel,
  MTKModelPreview,
} from '../base/MTKModel';
import {
  ServerInteraction,
  serverPort,
} from '../../../server-interaction/base/ServerInteraction';
import {
  checkMTKConverterInteraction,
  convertModelInteraction,
  getConvertedModelInteraction,
  getMTKModelPreviewsInteraction,
  saveThumbnailInteraction,
} from '../../../server-interaction/mtk-explorer/ServerInteraction';

import { checkServerInteraction } from '../../../server-interaction/common/ServerInteraction';
import { formDataFromFileToUpload } from '../../../server-interaction/mtk-explorer/FileToUpload';

function getFullUrl(interaction: ServerInteraction<unknown, unknown>, ...parameters: string[]) {
  const serverUrl = `http://localhost:${serverPort}`;
  if (parameters.length === 0) {
    return serverUrl + interaction.path;
  } else {
    return serverUrl + interaction.parametrizedPath(...parameters);
  }
}

async function processSimpleRequest(interaction: ServerInteraction<unknown, unknown>, isAlertOnFail: boolean = false) {
  let result = false;
  try {
    const response = await fetch(getFullUrl(interaction));
    result = response.ok;
    if (!result) {
      const text = await response.text();
      console.log(text);
      if (isAlertOnFail) {
        alert(text);
      }
    }
  } catch (error) {
    result = false;
    console.log(error);
  }
  return result;
}

export async function checkServerAvailable() {
  return await processSimpleRequest(checkServerInteraction, true);
}

export async function checkMTKConverterAvailable() {
  return await processSimpleRequest(checkMTKConverterInteraction);
}

export async function getConvertedModelPreviews() {
  let previews: MTKModelPreview[] = [];
  try {
    const response = await fetch(getFullUrl(getMTKModelPreviewsInteraction));
    if (response.ok) {
      previews = await getMTKModelPreviewsInteraction.getBodyFromResponse(response);
    } else {
      console.log(await response.text());
    }
  } catch (error) {
    console.log(error);
  }
  return previews;
}

export async function getConvertedModel(model: MTKModel) {
  let convertedModel: FileData[] | null = null;
  try {
    const response = await fetch(getFullUrl(getConvertedModelInteraction, model.process, model.name));
    if (response.ok) {
      const result = await getConvertedModelInteraction.getBodyFromResponse(response);
      convertedModel = result.length > 0
        ? result.map((file: EncodedFileData) => {
          return FileData.fromEncodedData(file);
        })
        : null;
    } else {
      console.log(await response.text());
    }
  } catch (error) {
    console.log(error);
  }
  return convertedModel;
}

export async function convertModel(file: File, process: string) {
  const requestBody = convertModelInteraction.requestBody(
    () => { return { uploadFolder: 'original_models', process: process, file: file }; },
  );
  const formData = formDataFromFileToUpload(requestBody);

  let convertedModel: FileData[] | null = null;
  try {
    const response = await fetch(getFullUrl(convertModelInteraction), {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await convertModelInteraction.getBodyFromResponse(response);
      convertedModel = result.convertedModel && result.convertedModel.length > 0
        ? result.convertedModel.map((file: EncodedFileData) => {
          return FileData.fromEncodedData(file);
        })
        : null;
    } else {
      const text = await response.text();
      console.log(await response.text());
      alert(text);
    }
  } catch (error) {
    console.error(error);
    alert(error);
  }
  return convertedModel;
}

export async function saveThumbnail(imageBlob: Blob, model: MTKModel) {
  const requestBody = saveThumbnailInteraction.requestBody(
    () => { return { uploadFolder: `${model.process}/${model.name}`, filename: 'thumbnail.png', file: imageBlob }; },
  );
  const formData = formDataFromFileToUpload(requestBody);

  try {
    const response = await fetch(getFullUrl(saveThumbnailInteraction), {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      console.log(await response.text());
    }
  } catch (error) {
    console.error(error);
  }
}
