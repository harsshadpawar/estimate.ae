// fileSlice.ts - Enhanced version with proper FileData handling
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RcFile } from 'antd/es/upload';
import { FileData } from 'shared/features/mtk-explorer/base/FileData';

interface FileWithPath {
  name: string;
  relativePath: string;
  file?: RcFile;
}

interface MTKModel {
  name: string;
  process: string;
}

interface MTKModelData {
  model: MTKModel;
  files: FileWithPath[];
  fileData: FileData[]; // Add this for proper FileData objects
  isCreateThumbnail: boolean;
}

interface FileState {
  // Current file management
  uploadedFiles: FileWithPath[];
  rawFiles: RcFile[];
  fileData: FileData[]; // Add FileData array
  isLoading: boolean;
  error: string | null;
  baseFiles: any,
  baseFileList: any,
  // Model information
  modelName?: string;
  processType?: string;
  rootFolderName?: string;

  // MTK specific data structure
  mtkModelData: MTKModelData | null;

  // Navigation state (to replace React Router state)
  navigationState: {
    pathname: string;
    search: string;
    hash: string;
    state: MTKModelData | null;
    key?: string;
  } | null;
}

const initialState: FileState = {
  uploadedFiles: [],
  baseFiles: [],
  baseFileList: [],
  rawFiles: [],
  fileData: [],
  isLoading: false,
  error: null,
  modelName: undefined,
  processType: undefined,
  rootFolderName: undefined,
  mtkModelData: null,
  navigationState: null,
};

// Helper function to convert RcFile to FileData
const convertRcFileToFileData = async (file: RcFile): Promise<FileData> => {
  const arrayBuffer = await file.arrayBuffer();
  return new FileData(
    [arrayBuffer],
    file.name,
    file.webkitRelativePath || file.name
  );
};

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setUploadedFiles: (state, action: PayloadAction<RcFile[]>) => {
      state.rawFiles = action.payload;

      // Convert RcFile[] to FileWithPath[]
      state.uploadedFiles = action.payload.map((file) => ({
        name: file.name,
        relativePath: file.webkitRelativePath || file.name,
        file: file
      }));

      state.error = null;

      // Extract root folder name and model info
      if (action.payload.length > 0) {
        const firstFile = action.payload[0];
        const relativePath = firstFile.webkitRelativePath || firstFile.name;
        const pathParts = relativePath.split('/');

        if (pathParts.length > 1) {
          state.rootFolderName = pathParts[0];
          state.modelName = pathParts[0];
        } else {
          state.modelName = firstFile.name.split('.')[0];
        }

        state.processType = 'upload';
      }
    },

    // New action to set FileData array
    setFileData: (state, action: PayloadAction<FileData[]>) => {
      state.fileData = action.payload;
    },

    setUploadedFilesWithPaths: (state, action: PayloadAction<FileWithPath[]>) => {
      state.uploadedFiles = action.payload;
      state.error = null;

      if (action.payload.length > 0) {
        const firstFile = action.payload[0];
        const pathParts = firstFile.relativePath.split('/');

        if (pathParts.length > 1) {
          state.rootFolderName = pathParts[0];
          state.modelName = pathParts[0];
        } else {
          state.modelName = firstFile.name.split('.')[0];
        }

        state.processType = 'upload';
      }
    },

    // New action to create MTK model data structure
    createMTKModelData: (state) => {
      if (state.modelName && state.uploadedFiles.length > 0) {
        const model: MTKModel = {
          name: state.modelName,
          process: state.processType || 'upload'
        };

        state.mtkModelData = {
          model,
          files: state.uploadedFiles,
          fileData: state.fileData, // Include FileData array
          isCreateThumbnail: false
        };

        // Create navigation state similar to React Router
        state.navigationState = {
          pathname: `/mtk-explorer/viewer/${state.processType || 'upload'}/${state.modelName}`,
          search: "",
          hash: "",
          state: state.mtkModelData,
          key: `key_${Date.now()}`
        };
      }
    },
    baseStore: (state, action) => {
      state.baseFiles = action.payload._file;
      state.baseFileList = action.payload.fileList;
    },
    // Action to set MTK model data directly
    setMTKModelData: (state, action: PayloadAction<MTKModelData>) => {
      state.mtkModelData = action.payload;
      state.modelName = action.payload.model.name;
      state.processType = action.payload.model.process;
      state.uploadedFiles = action.payload.files;
      state.fileData = action.payload.fileData;

      // Update navigation state
      state.navigationState = {
        pathname: `/mtk-explorer/viewer/${action.payload.model.process}/${action.payload.model.name}`,
        search: "",
        hash: "",
        state: action.payload,
        key: `key_${Date.now()}`
      };
    },

    // Action to simulate navigation state
    setNavigationState: (state, action: PayloadAction<{
      pathname: string;
      search?: string;
      hash?: string;
      state: MTKModelData | null;
      key?: string;
    }>) => {
      state.navigationState = {
        search: "",
        hash: "",
        ...action.payload
      };

      if (action.payload.state) {
        state.mtkModelData = action.payload.state;
        state.modelName = action.payload.state.model.name;
        state.processType = action.payload.state.model.process;
        state.uploadedFiles = action.payload.state.files;
        state.fileData = action.payload.state.fileData;
      }
    },

    clearUploadedFiles: (state) => {
      state.uploadedFiles = [];
      state.rawFiles = [];
      state.fileData = [];
      state.modelName = undefined;
      state.processType = undefined;
      state.rootFolderName = undefined;
      state.error = null;
      state.mtkModelData = null;
      state.navigationState = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    setModelInfo: (state, action: PayloadAction<{ name: string; process: string }>) => {
      state.modelName = action.payload.name;
      state.processType = action.payload.process;
    },

    updateThumbnailFlag: (state, action: PayloadAction<boolean>) => {
      if (state.mtkModelData) {
        state.mtkModelData.isCreateThumbnail = action.payload;
      }
    },
  },
});

export const {
  setUploadedFiles,
  setFileData,
  setUploadedFilesWithPaths,
  createMTKModelData,
  baseStore,
  setMTKModelData,
  setNavigationState,
  clearUploadedFiles,
  setLoading,
  setError,
  setModelInfo,
  updateThumbnailFlag
} = fileSlice.actions;

export default fileSlice.reducer;

// Export types for use in other components
export type { FileWithPath, MTKModel, MTKModelData };

// Export helper function
export { convertRcFileToFileData };