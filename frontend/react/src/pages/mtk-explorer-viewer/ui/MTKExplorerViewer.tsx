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

import './MTKExplorerViewer.scss';

import {
  Intersection,
  Object3D,
} from 'three';
import { MTKModel, MTKModelData } from 'shared/features/mtk-explorer/base/MTKModel';
import { checkServerAvailable, getConvertedModel, saveThumbnail } from 'shared/features/mtk-explorer/api/serverInteractionHelper';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Allotment } from 'allotment';
import { AnalysisMode } from '../viewer/MTKExplorerViewer';
import { BaseProduct } from '../viewer/base/BaseProduct';
import { FileData } from 'shared/features/mtk-explorer/base/FileData';
import { MTKExplorerViewer as MTKExplorerViewerRef } from '../viewer/MTKExplorerViewer';
import { ProductInformationPanel } from './ProductInformationPanel';
import { ProductSelectAndViewControls } from './ProductSelectAndViewControls';
import { SheetMetalProduct } from '../viewer/sheet-metal/SheetMetalProduct';
import { Viewport } from '../../../features/viewport/ui/Viewport';

interface PartSelectorOption {
  value: number;
  label: string;
}

export const MTKExplorerViewer = () => {
  const [viewerRef] = useState<MTKExplorerViewerRef>(new MTKExplorerViewerRef());

  const location = useLocation();
  const getModelData = (): MTKModelData | null => {
    return location.state ? location.state as MTKModelData : null;
  };

  const params = useParams();
  const getModel = (): MTKModel => {
    return { name: params.name ? params.name : 'undefined', process: params.process ? params.process : 'undefined' };
  };

  useEffect(() => {
    const files = getModelData()?.files;
    if (files && files.length && files[0] instanceof FileData) {
      readConvertedModel(files);
    } else {
      readModel();
    }
  }, []);

  const readModel = async () => {
    const model = getModel();
    if (await checkServerAvailable()) {
      const files = await getConvertedModel(model);
      readConvertedModel(files);
    } else {
      alert(`Unavailable to read model: ${model.name}`);
    }
  };

  const [partOptions, setPartOptions] = useState<PartSelectorOption[]>([]);
  const [currentProduct, setCurrentProduct] = useState<BaseProduct | null>(null);
  const [currentViewIndex, setCurrentViewIndex] = useState<number>(0);
  const [currentAnalysisMode, setCurrentAnalysisMode] = useState<AnalysisMode>(AnalysisMode.FEATURE_RECOGNITION);

  useEffect(() => {
    const index = currentProduct instanceof SheetMetalProduct && currentProduct.isUnfoldedViewActive ? 1 : 0;
    setCurrentViewIndex(index);
  }, [currentProduct]);

  const getCurrentFeaturesStructureManager = useCallback(() => {
    return viewerRef.currentFeaturesStructureManager;
  }, [currentProduct, currentAnalysisMode, currentViewIndex]);

  const getCurrentUnfoldedPartParameters = useCallback(() => {
    if (currentProduct instanceof SheetMetalProduct) {
      return currentProduct.unfoldedFeatureRecognitionData?.parameters;
    } else {
      return undefined;
    }
  }, [currentProduct]);

  const getCurrentAnalysisModeMessage = useCallback(() => {
    if (currentProduct instanceof SheetMetalProduct && currentProduct.isUnfoldedViewActive) {
      return currentProduct.unfoldedFeatureRecognitionData?.message;
    } else {
      return viewerRef.currentFeaturesStructureManager?.message;
    }
  }, [currentProduct, currentAnalysisMode, currentViewIndex]);

  const isUnfoldedViewAvailable = useCallback(() => {
    return currentProduct instanceof SheetMetalProduct;
  }, [currentProduct]);

  const onIsUnfoldedViewActiveChanged = (index: number) => {
    if (currentProduct instanceof SheetMetalProduct) {
      currentProduct.isUnfoldedViewActive = index > 0;
      setCurrentViewIndex(index);
    }
  };

  const onCurrentPartIndexChanged = async (index: number) => {
    viewerRef.setCurrentProductIndex(index);
    setCurrentProduct(viewerRef.currentProduct);
  };

  const onCurrentAnalysisModeChanged = async (mode: AnalysisMode) => {
    viewerRef.setCurrentAnalysisMode(mode);
    setCurrentAnalysisMode(mode);
  };

  const onFeatureTypeChanged = (name?: string) => {
    viewerRef.changeFeatures(name);
  };

  const onConvertedModelLoaded = useCallback(() => {
    const parts: PartSelectorOption[] = [];
    for (let i = 0; i < viewerRef.products.length; i++) {
      const partName = viewerRef.products[i].name;
      parts.push({ value: i, label: partName ? partName : 'Unnamed part' });
    }
    setPartOptions(parts);
    setCurrentProduct(viewerRef.currentProduct);

    if (viewerRef.currentProduct && getModelData()?.isCreateThumbnail) {
      setTimeout(() => {
        viewerRef.viewport.captureSceneImage((imageBlob: Blob | null) => {
          const modelData = getModelData();
          if (imageBlob && modelData?.model) {
            saveThumbnail(imageBlob, modelData?.model);
          }
        });
      }, 200);
    }
  }, [viewerRef, setPartOptions, setCurrentProduct]);

  const readConvertedModel = useCallback((files?: FileData[] | null) => {
    setPartOptions([]);
    setCurrentProduct(null);
    if (!files || !files.length) {
      return;
    }
    viewerRef.clearViewer();
    viewerRef
      .loadModel(files)
      .then(onConvertedModelLoaded)
      .catch((e: Error) => {
        console.log(`Unable to load model from folder: `, e);
        alert(`Unable to load model from folder [${e.message}]`);
      });
  }, [setPartOptions, setCurrentProduct, viewerRef, onConvertedModelLoaded]);

  const onSelectedFromViewport = (
    intersection: Intersection<Object3D>[] | null,
    isMultipleSelectionModifiersUsed?: boolean,
  ) => {
    viewerRef.currentFeaturesStructureManager?.selectFromViewer(intersection, isMultipleSelectionModifiersUsed);
  };

  return (
    <Allotment defaultSizes={[3, 1]} minSize={300}>
      <Allotment.Pane>
        <div className="product-controls-container">
          <ProductSelectAndViewControls
            isShowSelectControl={partOptions.length > 1}
            defaultSelectValue={0}
            selectOptions={partOptions}
            onSelectValueChanged={onCurrentPartIndexChanged}
            isShowViewControl={isUnfoldedViewAvailable()}
            currentViewIndex={currentViewIndex}
            defaultViewName="Original"
            alternativeViewName="Unfolded"
            onViewChanged={onIsUnfoldedViewActiveChanged}
          />
        </div>
        <Viewport
          viewportRef={viewerRef.viewport}
          onIntersect={onSelectedFromViewport}
        />
      </Allotment.Pane>
      <Allotment.Pane>
        {(viewerRef.currentProduct) && (
          <ProductInformationPanel
            currentPartError={currentProduct?.error}
            currentAnalysisMode={currentAnalysisMode}
            onCurrentAnalysisModeChanged={onCurrentAnalysisModeChanged}
            isUnfoldedViewActive={currentViewIndex === 1}
            currentUnfoldedPartParameters={getCurrentUnfoldedPartParameters()}
            activeAnalysisModeMessage={getCurrentAnalysisModeMessage()}
            currentStructureManager={getCurrentFeaturesStructureManager()}
            onFeatureTypeChanged={onFeatureTypeChanged}
          />
        )}
      </Allotment.Pane>
    </Allotment>
  );
};
