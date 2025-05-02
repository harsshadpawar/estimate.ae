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

import JSZip from 'jszip';

/* Type from JSZip declaration file. */
export type MTKWEBArchiveInputFileFormat = string | number[] | Uint8Array | ArrayBuffer | Blob | NodeJS.ReadableStream;

export class MTKWEBArchive {
  private basePath: string;
  readonly sceneGraphFileName: string;

  private constructor(
    private zipArchive: JSZip,
    scenegraphPath: string,
  ) {
    this.sceneGraphFileName = scenegraphPath.split('/').pop()!;
    this.basePath = scenegraphPath.substring(0, scenegraphPath.length - this.sceneGraphFileName.length);
  }

  static async parse(data: MTKWEBArchiveInputFileFormat) {
    let zipArchive;
    try {
      zipArchive = await JSZip.loadAsync(data);
    } catch {
      throw new Error('The file is not valid archive.');
    }
    // Try to find the file with "mtkweb" extension
    const mtkwebFiles = zipArchive.file(/\.mtkweb$/);
    if (mtkwebFiles.length === 0) {
      throw new Error('The archive does not contain any MTKWEB file.');
    }
    return new MTKWEBArchive(zipArchive, mtkwebFiles[0].name);
  }

  getSceneGraphFile() {
    return this.getFile(this.sceneGraphFileName);
  }

  async getFile(filename: string) {
    const file = this.zipArchive.file(this.basePath + filename);
    if (!file) {
      throw new Error(`Unable to get file "${filename}"`);
    }
    return file.async('arraybuffer');
  }
}
