import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../../services/interceptor";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

// Interfaces
interface SurfaceTreatment {
  id: string;
  active: boolean;
  name: string;
  price_per_kg: number;
  surface_price: number;
}

interface SurfaceTreatmentsState {
  treatments: SurfaceTreatment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: {
    page: number;
    rowsPerPage: number;
    total: number;
  };
}

const initialState: SurfaceTreatmentsState = {
  treatments: [],
  status: 'idle',
  error: null,
  pagination: {
    page: 0,
    rowsPerPage: 10,
    total: 0
  }
};

// ✅ New: Default fetch without params (or with internal defaults)
export const fetchDefaultSurfaceTreatments = createAsyncThunk(
  'surfaceTreatments/fetchDefault',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/surface-treatment', {
        params: { page: 1, size: 10 } // You can change defaults here if needed
      });
      return {
        treatments: response.data?.data?.surface_treatments || [],
        total: response.data?.data?.total || 0
      };
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.message || "Failed to fetch default surface treatments");
    }
  }
);

// Paginated fetch
export const fetchSurfaceTreatments = createAsyncThunk(
  'surfaceTreatments/fetchAll',
  async (
    { page = 0, rowsPerPage = 10 } = {}, // ✅ Default empty object
    { rejectWithValue }
  ) => {
    try {
      console.log("Fetching surface treatments for page:", page, "with rows per page:", rowsPerPage);
      const response = await apiClient.get('/surface-treatment/', {
        params: { page: page + 1, size: rowsPerPage }
      });
      console.log("Fetched surface treatments:", response.data);
      return {
        treatments: response.data?.data?.surface_treatments || [],
        total: response.data?.data?.total || 0
      };
    } catch (error) {
      console.error("Error fetching surface treatments:", error);
      const err = error as AxiosError;
      return rejectWithValue(err.message || "Failed to fetch surface treatments");
    }
  }
);


// Add
export const addSurfaceTreatment = createAsyncThunk(
  'surfaceTreatments/add',
  async (treatment: SurfaceTreatment, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/surface-treatment", treatment);
      toast.success("Surface treatment added successfully");
      return response.data.data.surface_treatment;
    } catch (error) {
      toast.error("Failed to add surface treatment");
      const err = error as AxiosError;
      return rejectWithValue(err.message || "Add failed");
    }
  }
);

// Update
export const updateSurfaceTreatment = createAsyncThunk(
  'surfaceTreatments/update',
  async ({ id, treatment }: { id: string; treatment: SurfaceTreatment }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/surface-treatment/${id}`, treatment);
      toast.success("Surface treatment updated successfully");
      return response.data.data.surface_treatment;
    } catch (error) {
      toast.error("Failed to update surface treatment");
      const err = error as AxiosError;
      return rejectWithValue(err.message || "Update failed");
    }
  }
);

// Import
export const importSurfaceTreatment = createAsyncThunk(
  'surfaceTreatments/import',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/surface-treatment/import/${id}`);
      toast.success("Surface treatment imported successfully");
      return response.data.surface_treatment;
    } catch (error) {
      toast.error("Failed to import surface treatment");
      const err = error as AxiosError;
      return rejectWithValue(err.message || "Import failed");
    }
  }
);

// Delete
export const deleteSurfaceTreatment = createAsyncThunk(
  'surfaceTreatments/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/surface-treatment/${id}`);
      toast.success("Surface treatment deleted successfully");
      return id;
    } catch (error) {
      toast.error("Failed to delete surface treatment");
      const err = error as AxiosError;
      return rejectWithValue(err.message || "Delete failed");
    }
  }
);

// Slice
const surfaceTreatmentsSlice = createSlice({
  name: 'surfaceTreatments',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.rowsPerPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchSurfaceTreatments
      .addCase(fetchSurfaceTreatments.pending, (state) => {
        console.log("Fetching surface treatments...");
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSurfaceTreatments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log("Fetched surface treatments:", action.payload);
        state.treatments = action.payload.treatments;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchSurfaceTreatments.rejected, (state, action) => {
        console.log("Error fetching surface treatments:", action);
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // fetchDefaultSurfaceTreatments
      .addCase(fetchDefaultSurfaceTreatments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDefaultSurfaceTreatments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.treatments = action.payload.treatments;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchDefaultSurfaceTreatments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // add
      .addCase(addSurfaceTreatment.fulfilled, (state, action) => {
        state.treatments.unshift(action.payload);
      })

      // update
      .addCase(updateSurfaceTreatment.fulfilled, (state, action) => {
        const index = state.treatments.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.treatments[index] = action.payload;
        }
      })

      // import
      .addCase(importSurfaceTreatment.fulfilled, (state, action) => {
        state.treatments.unshift(action.payload);
      })

      // delete
      .addCase(deleteSurfaceTreatment.fulfilled, (state, action) => {
        state.treatments = state.treatments.filter(t => t.id !== action.payload);
      });
  }
});

export const { setPage, setRowsPerPage } = surfaceTreatmentsSlice.actions;
export default surfaceTreatmentsSlice.reducer;
