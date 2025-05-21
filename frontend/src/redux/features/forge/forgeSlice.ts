
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/services/interceptor"; 


interface ForgeState {
  token: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}


const initialState: ForgeState = {
  token: '',
  status: 'idle',
  error: null,
};


export const getForgeToken = createAsyncThunk<string>(
  'forge/getToken',
  async () => {
    const response = await apiClient.get('/cad/forge-token/', {
      method: 'GET',
      withCredentials: true,
    });
    console.log("Forge token response", response.data);
    return response.data.data;
  }
);


const forgeSlice = createSlice({
  name: 'forge',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getForgeToken.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getForgeToken.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.token = action.payload;
      })
      .addCase(getForgeToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      });
  }
});

export default forgeSlice.reducer;
