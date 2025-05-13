import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../../services/interceptor";
import { toast } from "react-toastify";

interface UploadCadResponse {
  data: {
    file_id: string;
    data: {
      objectKey: string;
    };
  };
}

interface CadState {
  fileId: string;
  fileName: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: any | null;
}

const initialState: CadState = {
  fileId: '',
  fileName: '',
  status: 'idle',
  error: null
};



export const uploadCadFile = createAsyncThunk<UploadCadResponse,File,{ rejectValue: any }>(
  'cad/upload',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/cad/upload', formData);
      toast.success("File uploaded successfully");
      return response.data as UploadCadResponse;
    } catch (error: any) {
      toast.error("Upload failed");
      return rejectWithValue(error.response?.data || 'Unknown error');
    }
  }
);

// Create slice
const cadSlice = createSlice({
  name: 'cad',
  initialState,
  reducers: {
    resetCadState: (state) => {
      state.fileId = '';
      state.fileName = '';
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadCadFile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadCadFile.fulfilled, (state, action: PayloadAction<UploadCadResponse>) => {
        state.status = 'succeeded';
        state.fileId = action.payload.data.file_id;
        state.fileName = action.payload.data.data.objectKey;
      })
      .addCase(uploadCadFile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { resetCadState } = cadSlice.actions;
export default cadSlice.reducer;
