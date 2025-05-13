import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../../services/interceptor";
import { AxiosError } from "axios";

// Define types for the cost data
interface CostDetails {
  setupCosts: number | null;
  unitCosts: number | null;
  totalCost: number;
  details: any; // Replace `any` with a more specific type if known
}

interface CalculationData {
  // Define the shape of the data sent to the API
  [key: string]: any; // Replace with actual fields
}

interface CostsState extends Partial<CostDetails> {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: CostsState = {
  setupCosts: null,
  unitCosts: null,
  totalCost: 0,
  details: null,
  status: 'idle',
  error: null,
};

// Async thunk
export const calculateCosts = createAsyncThunk<CostDetails,CalculationData,{ rejectValue: string }>(
  'costs/calculate',
  async (calculationData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/calculate/total-cost', calculationData);
      return response.data.data as CostDetails;
    } catch (error) {
      const err = error as AxiosError;
      const errorMessage = (err.response?.data as { message?: string })?.message || 'Failed to calculate costs';
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const costsSlice = createSlice({
  name: 'costs',
  initialState,
  reducers: {
    resetCosts: (state) => {
      state.setupCosts = null;
      state.unitCosts = null;
      state.totalCost = 0;
      state.details = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateCosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(calculateCosts.fulfilled, (state, action: PayloadAction<CostDetails>) => {
        state.status = 'succeeded';
        state.setupCosts = action.payload.setupCosts;
        state.unitCosts = action.payload.unitCosts;
        state.totalCost = action.payload.totalCost;
        state.details = action.payload.details;
      })
      .addCase(calculateCosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unknown error';
      });
  }
});

export const { resetCosts } = costsSlice.actions;
export default costsSlice.reducer;
