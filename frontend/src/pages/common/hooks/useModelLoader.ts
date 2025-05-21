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
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { BaseViewer } from 'shared/features/common/viewer/BaseViewer';
import { RcFile } from 'antd/es/upload';

interface ModelLoaderHook {
  onMTKWEBFileSelected: (file: RcFile) => Promise<boolean>;
  onMTKWEBFolderSelected: (_file: RcFile, fileList: RcFile[]) => Promise<boolean>;
}

export function useModelLoader<TreeNodeDataType extends StructureManagerTreeNodeData, StructureManagerType extends StructureManager<TreeNodeDataType>>(
  viewer: BaseViewer<TreeNodeDataType, StructureManagerType>,
): ModelLoaderHook {
  const [filesList, setFileList] = useState<RcFile[]>([]);
  const [currentFile, setCurrentFile] = useState<RcFile | null>(null);

  const onModelLoaded = useCallback(() => {
    // Expand root assemblies of the model.
    viewer.structureManager.rootsNodes.forEach((root) => {
      viewer.structureManager.expandNode(root);
      root.children.forEach((child) => {
        viewer.structureManager.expandNode(child);
      });
    });
  }, [viewer]);

  useEffect(() => {
    if (!currentFile) {
      return;
    }
    async function loadData() {
      console.log("currentFile",currentFile)
      if (currentFile) {
        const data = await currentFile.arrayBuffer();
        const modelName = currentFile.name
          .replace('.zip', '')
          .replace('.mtkweb', '');
        viewer.clear();
        await viewer.loadModelArchive(modelName, data);
        onModelLoaded();
      }
    }

    loadData().catch((e: Error) => {
      console.log(`Unable to load model "${currentFile.name}": `, e);
      alert(
        `Unable to load model "${currentFile.name}" [${(e as Error).message}]`,
      );
    });
  }, [currentFile]);

  useEffect(() => {
    if (!filesList?.length) {
      return;
    }
    viewer.clear();
    viewer
      .loadModelFolder('Unnamed model', filesList)
      .then(onModelLoaded)
      .catch((e: Error) => {
        console.log(`Unable to load model from folder: `, e);
        alert(`Unable to load model from folder [${e.message}]`);
      });
  }, [filesList]);

  const onMTKWEBFileSelected = useCallback(async (file: RcFile) => {
    if (!viewer) {
      return false;
    }
    setCurrentFile(file);
    setFileList([]);
    return false;
  },
  [viewer, setCurrentFile, setFileList]);

  const onMTKWEBFolderSelected = useCallback(async (_file: RcFile, fileList: RcFile[]) => {
    if (!viewer) {
      return false;
    }
    setFileList(fileList);
    setCurrentFile(null);
    return false;
  }, [viewer, setFileList, setCurrentFile]);

  return {
    onMTKWEBFileSelected,
    onMTKWEBFolderSelected,
  };
}
