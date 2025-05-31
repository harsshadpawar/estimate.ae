import './MTKExplorerViewer.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store/store'; // Adjust import path
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

import { Allotment } from 'allotment';
import { AnalysisMode } from '../viewer/MTKExplorerViewer';
import { BaseProduct } from '../viewer/base/BaseProduct';
import { FileData } from 'shared/features/mtk-explorer/base/FileData';
import { MTKExplorerViewer as MTKExplorerViewerRef } from '../viewer/MTKExplorerViewer';
import { ProductInformationPanel } from './ProductInformationPanel';
import { ProductSelectAndViewControls } from './ProductSelectAndViewControls';
import { SheetMetalProduct } from '../viewer/sheet-metal/SheetMetalProduct';
import { Viewport } from 'features/viewport/ui/Viewport';
import { setError, setLoading } from '@/redux/features/file/fileSlice';
import { Box, Container } from '@mui/material';

interface PartSelectorOption {
  value: number;
  label: string;
}

export const MTKExplorerViewer = () => {
  const [viewerRef] = useState<MTKExplorerViewerRef>(new MTKExplorerViewerRef());
  const dispatch = useDispatch();

  // Get data from Redux instead of React Router
  const { mtkModelData, navigationState } = useSelector((state: RootState) => state.file);
  console.log("mtkModelData", mtkModelData);
  console.log("navigationState", navigationState);

  const getModelData = (): MTKModelData | null => {
    return mtkModelData || (navigationState?.state ? navigationState.state : null);
  };

  const getModel = (): MTKModel => {
    const modelData = getModelData();
    if (modelData) {
      console.log("getmodel inside", modelData);
      return modelData.model;
    }

    // Fallback to parsing from navigation state pathname
    if (navigationState?.pathname) {
      const pathParts = navigationState.pathname.split('/');
      return {
        name: pathParts[pathParts.length - 1] || 'undefined',
        process: pathParts[pathParts.length - 2] || 'undefined'
      };
    }

    return { name: 'undefined', process: 'undefined' };
  };

  useEffect(() => {
    const modelData = getModelData();
    const fileData = modelData?.fileData; // Use fileData instead of files

    if (fileData && fileData.length) {
      // Use FileData array directly
      readConvertedModel(fileData);
    } else {
      readModel();
    }
  }, [mtkModelData, navigationState]);

  const readModel = async () => {
    const model = getModel();
    dispatch(setLoading(true));

    if (await checkServerAvailable()) {
      try {
        const files = await getConvertedModel(model);
        readConvertedModel(files);
      } catch (error) {
        const errorMessage = `Unable to load model: ${model.name}`;
        dispatch(setError(errorMessage));
        alert(errorMessage);
      }
    } else {
      const errorMessage = `Unavailable to read model: ${model.name}`;
      dispatch(setError(errorMessage));
      alert(errorMessage);
    }

    dispatch(setLoading(false));
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

    const modelData = getModelData();
    if (viewerRef.currentProduct && modelData?.isCreateThumbnail) {
      setTimeout(() => {
        viewerRef.viewport.captureSceneImage((imageBlob: Blob | null) => {
          if (imageBlob && modelData?.model) {
            saveThumbnail(imageBlob, modelData.model);
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

    dispatch(setLoading(true));
    viewerRef.clearViewer();
    viewerRef
      .loadModel(files)
      .then(onConvertedModelLoaded)
      .catch((e: Error) => {
        console.log(`Unable to load model from folder: `, e);
        const errorMessage = `Unable to load model from folder [${e.message}]`;
        dispatch(setError(errorMessage));
        alert(errorMessage);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [setPartOptions, setCurrentProduct, viewerRef, onConvertedModelLoaded, dispatch]);

  const onSelectedFromViewport = (
    intersection: Intersection<Object3D>[] | null,
    isMultipleSelectionModifiersUsed?: boolean,
  ) => {
    viewerRef.currentFeaturesStructureManager?.selectFromViewer(intersection, isMultipleSelectionModifiersUsed);
  };

  return (
    <Container>
      <Allotment defaultSizes={[3, 1]} minSize={300} >
        <div style={{ display: 'flex', height: '600px' }}>
          <div style={{ width: "75%", height: '100%' }}>
            <Allotment.Pane >
              <div style={{ height: '600px' }}>
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
                  style={{ width: '100%', height: 600 }}
                />
              </div>
            </Allotment.Pane>
          </div>
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
        </div>
      </Allotment>
    </Container>
  );
};