import { useDispatch, useSelector } from 'react-redux';
import {
  setUploadedFiles,
  setFileData,
  createMTKModelData,
  convertRcFileToFileData,
  FileWithPath,
  MTKModelData,
  baseStore
} from '@/redux/features/file/fileSlice';
import { useState, useEffect } from 'react';
import { BaseModelViewer } from '../viewer/BaseModelViewer';
import { RcFile } from 'antd/es/upload';
import { useModelLoader } from '@/pages/common/hooks';
import { Box } from '@mui/material';
import FileUpload from '@/pages/dashboard/dashboard/selectModel/fileUpload';
import { Viewport } from '../../features/viewport/ui/Viewport';
import { RootState } from '@/redux/store'; // Adjust import path as needed
import { FileData } from 'shared/features/mtk-explorer/base/FileData';
import CustomButton from '@/components/button';

export function BaseViewer({ step }: any) {
  const [viewer] = useState(new BaseModelViewer());

  const [fileSelected, setFileSelected] = useState(false);
  const dispatch = useDispatch();
  console.log("step", step)
  // Get state from Redux
  const {
    baseFile,
    baseFileList,
    mtkModelData,
    navigationState,
    isLoading,
    error
  } = useSelector((state: RootState) => state.file);

  const { onMTKWEBFileSelected, onMTKWEBFolderSelected } = useModelLoader(viewer);
  useEffect(() => {
    const fetchData = async () => {
      await onMTKWEBFolderSelected(baseFile, baseFileList);
    };

    fetchData();
  }, [baseFile, baseFileList]);
  const handleFolderSelect = async (_file: RcFile, fileList: RcFile[]) => {
    console.log("Selected file:", _file);
    console.log("Full file list:", fileList);

    // Log the webkitRelativePath for debugging
    fileList.forEach(file => {
      console.log(`File: ${file.name}, Path: ${file.webkitRelativePath}`);
    });

    try {
      // Store files in Redux with proper structure
      dispatch(setUploadedFiles(fileList));

      // Convert RcFile[] to FileData[]
      const fileDataPromises = fileList.map(file => convertRcFileToFileData(file));
      const fileDataArray = await Promise.all(fileDataPromises);

      // Store FileData array in Redux
      dispatch(setFileData(fileDataArray));

      // Create MTK model data structure
      dispatch(createMTKModelData());
      dispatch(baseStore({ _file, fileList }));
      await onMTKWEBFolderSelected(_file, fileList);
      setFileSelected(true);
    } catch (error) {
      console.error('Error processing files:', error);
      dispatch(setError(`Error processing files: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }

    return false;
  };

  // Effect to handle MTK model data changes
  useEffect(() => {
    if (mtkModelData && !fileSelected) {
      setFileSelected(true);
    }
  }, [mtkModelData, fileSelected]);

  return (
    <Box sx={{ height: '100%' }}>
      {!fileSelected && (
        <Box
          sx={{
            height: '100%',
            borderRadius: 4,
            border: '1.5px dashed #0591fc',
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <FileUpload onFileSelect={handleFolderSelect} />
          {isLoading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}
        </Box>
      )}
      {fileSelected && (
        <>
          <div style={{ display: 'flex', height: step > 2 ? '500px' : '560px' }}>
            <Viewport
              viewportRef={viewer.viewport}
              isShowSpaceGrid={true}
              style={{ width: '100%', height: 600 }}
            />
          </div>
          {step > 2 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                alignItems: "flex-end",
                justifyContent: "center",
                padding: 2,
              }}
            >
              <CustomButton
                text="Download Estimate Report"
                // onClick={handleEstimationReportClick}
                height="50px"
                width="250px"
                borderRadius="8px"
                fontSize="14px"
                showArrow={true}
              />
              <CustomButton
                text="View Process Report"
                // onClick={handleManufacturingProcessReportClick}
                height="50px"
                width="250px"
                borderRadius="8px"
                fontSize="14px"
                showArrow={true}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}