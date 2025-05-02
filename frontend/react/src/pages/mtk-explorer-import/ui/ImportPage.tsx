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

import './ImportPage.scss';

import {
  MTKModelData,
  MTKModelPreview,
} from 'shared/features/mtk-explorer/base/MTKModel';
import {
  checkMTKConverterAvailable,
  checkServerAvailable,
  convertModel,
  getConvertedModel,
  getConvertedModelPreviews,
} from 'shared/features/mtk-explorer/api/serverInteractionHelper';
import {
  useEffect,
  useState,
} from 'react';

import { FileData } from 'shared/features/mtk-explorer/base/FileData';
import { ImportCard } from './ImportCard';
import { ManufacturingProcessSelectionModal } from './ManufacturingProcessSelectionModal';
import { ModelPreviewCard } from './ModelPreviewCard';
import { getProcessName } from 'shared/features/mtk-explorer/base/ManufacturingProcess';
import { useNavigate } from 'react-router-dom';

export const ImportPage = () => {
  const navigate = useNavigate();

  const [isMTKConverterAvailable, setIsMTKConverterAvailable] = useState(false);
  const [convertedModelPreviews, setConvertedModelPreviews] = useState<MTKModelPreview[]>([]);

  const [isProcessSelectionModalOpen, setIsProcessSelectionModalOpen] = useState<boolean>(false);
  const [selectedSTEPFile, setSelectedSTEPFile] = useState<File | null>(null);
  const [isSTEPConversionInProgress, setIsSTEPConversionInProgress] = useState<boolean>(false);

  const getModelName = (file: FileData) => {
    return file.relativePath.split('/')[0];
  };

  const convertToFileData = (files: FileList) => {
    const data: FileData[] = [];
    for (const file of files) {
      const fileData = new FileData([file], file.name, file.webkitRelativePath);
      data.push(fileData);
    }
    return data;
  };

  useEffect(() => {
    const init = async () => {
      const isServerAvailable = await checkServerAvailable();
      if (!isServerAvailable) {
        return;
      }
      setIsMTKConverterAvailable(await checkMTKConverterAvailable());
      setConvertedModelPreviews(await getConvertedModelPreviews());
    };

    init();
  }, []);

  const navigateToViewer = (data: MTKModelData) => {
    navigate(
      `/mtk-explorer/viewer/${data.model.process}/${data.model.name}`,
      { state: data },
    );
  };

  const onConvertedModelSelected = async (index: number) => {
    if (isSTEPConversionInProgress) {
      return;
    }
    const preview = convertedModelPreviews[index];
    const files = await getConvertedModel(preview);
    if (files) {
      navigateToViewer({ model: preview, files: files, isCreateThumbnail: false });
    }
  };

  const onItemSelected = (files: FileList) => {
    if (isMTKConverterAvailable && files.length === 1) {
      const file = files[0];
      setSelectedSTEPFile(file);
      setIsProcessSelectionModalOpen(true);
    } else {
      const fileData = convertToFileData(files);
      if (fileData.length > 0) {
        const modelName = getModelName(fileData[1]);
        navigateToViewer({ model: { name: modelName, process: 'undefined' }, files: fileData, isCreateThumbnail: false });
      }
    }
  };

  const onManufacturingProcessSelected = async (process: string) => {
    setIsProcessSelectionModalOpen(false);
    if (selectedSTEPFile) {
      setIsSTEPConversionInProgress(true);
      const files = await convertModel(selectedSTEPFile, process);
      setIsSTEPConversionInProgress(false);
      if (files) {
        navigateToViewer({ model: { name: selectedSTEPFile.name, process: process }, files: files, isCreateThumbnail: true });
      }
    }
  };

  const onManufacturingProcessSelectionCanceled = () => {
    setIsProcessSelectionModalOpen(false);
  };

  return (
    <section className="import-page">
      <ManufacturingProcessSelectionModal
        isOpen={isProcessSelectionModalOpen}
        modelName={selectedSTEPFile ? selectedSTEPFile.name : 'Undefined'}
        onOkClicked={onManufacturingProcessSelected}
        onCancelClicked={onManufacturingProcessSelectionCanceled}
      />
      <ImportCard
        title={isSTEPConversionInProgress
          ? 'Conversion in progress'
          : isMTKConverterAvailable ? 'Import STEP file' : 'Import MTK folder'}
        type={isMTKConverterAvailable ? 'file' : 'directory'}
        acceptExtensions=".stp, .step"
        isImportInProgress={isSTEPConversionInProgress}
        onItemSelected={onItemSelected}
      />
      {convertedModelPreviews.map((preview, index) => (
        <ModelPreviewCard
          key={index}
          title={preview.name}
          description={getProcessName(preview.process)}
          image={`data:image/png;base64,${preview.thumbnail}`}
          onClick={() => { onConvertedModelSelected(index); }}
        />
      ))}
    </section>
  );
};
