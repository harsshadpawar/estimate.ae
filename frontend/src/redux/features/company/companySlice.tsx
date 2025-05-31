import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/services/interceptor";
import { triggerToast, dismissToast } from "@/components/customToast";

// Types
export type Company = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: any;
};

export type CompanyCreate = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  description?: string;
};

export type CompanyUpdate = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  description?: string;
};

type CompanyState = {
  companies: Company[];
  currentCompany: Company | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
};

// Initial State
const initialState: CompanyState = {
  companies: [],
  currentCompany: null,
  status: "idle",
  error: null,
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

// Thunks
export const createCompany = createAsyncThunk(
  "company/create",
  async (data: CompanyCreate, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/company/create", data);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to create company";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchAllCompanies = createAsyncThunk(
  "company/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/company/");
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to fetch companies";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCompanyById = createAsyncThunk(
  "company/fetchById",
  async (companyId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/company/${companyId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to fetch company";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCompany = createAsyncThunk(
  "company/update",
  async (
    { companyId, data }: { companyId: string; data: CompanyUpdate },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.put(`/company/${companyId}`, data);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to update company";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  "company/delete",
  async (companyId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/company/${companyId}`);
      return { ...response.data, companyId };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to deactivate company";
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCurrentCompany: (state) => {
      state.currentCompany = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCreateStatus: (state) => {
      state.createStatus = "idle";
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = "idle";
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    // Create Company
    builder.addCase(createCompany.pending, (state) => {
      state.createStatus = "loading";
      state.error = null;
    });
    builder.addCase(createCompany.fulfilled, (state, action: PayloadAction<any>) => {
      state.createStatus = "succeeded";
      state.companies.unshift(action.payload.data);
      dismissToast();
      triggerToast(action.payload.message || "Company created successfully!", "success");
    });
    builder.addCase(createCompany.rejected, (state, action: PayloadAction<any>) => {
      state.createStatus = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });

    // Fetch All Companies
    builder.addCase(fetchAllCompanies.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchAllCompanies.fulfilled, (state, action: PayloadAction<any>) => {
      state.status = "succeeded";
      state.companies = action.payload.data || [];
    });
    builder.addCase(fetchAllCompanies.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });

    // Fetch Company By ID
    builder.addCase(fetchCompanyById.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchCompanyById.fulfilled, (state, action: PayloadAction<any>) => {
      state.status = "succeeded";
      state.currentCompany = action.payload.data;
    });
    builder.addCase(fetchCompanyById.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });

    // Update Company
    builder.addCase(updateCompany.pending, (state) => {
      state.updateStatus = "loading";
      state.error = null;
    });
    builder.addCase(updateCompany.fulfilled, (state, action: PayloadAction<any>) => {
      state.updateStatus = "succeeded";
      const updatedCompany = action.payload.data;
      
      // Update in companies array
      const index = state.companies.findIndex(c => c.id === updatedCompany.id);
      if (index !== -1) {
        state.companies[index] = updatedCompany;
      }
      
      // Update current company if it's the same
      if (state.currentCompany?.id === updatedCompany.id) {
        state.currentCompany = updatedCompany;
      }
      
      dismissToast();
      triggerToast(action.payload.message || "Company updated successfully!", "success");
    });
    builder.addCase(updateCompany.rejected, (state, action: PayloadAction<any>) => {
      state.updateStatus = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });

    // Delete Company
    builder.addCase(deleteCompany.pending, (state) => {
      state.deleteStatus = "loading";
      state.error = null;
    });
    builder.addCase(deleteCompany.fulfilled, (state, action: PayloadAction<any>) => {
      state.deleteStatus = "succeeded";
      const { companyId } = action.payload;
      
      // Update company status in the array (mark as deactivated)
      const index = state.companies.findIndex(c => c.id === companyId);
      if (index !== -1) {
        state.companies[index] = { ...state.companies[index], is_active: false };
      }
      
      // Update current company if it's the same
      if (state.currentCompany?.id === companyId) {
        state.currentCompany = { ...state.currentCompany, is_active: false };
      }
      
      dismissToast();
      triggerToast(action.payload.message || "Company deactivated successfully!", "success");
    });
    builder.addCase(deleteCompany.rejected, (state, action: PayloadAction<any>) => {
      state.deleteStatus = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });
  },
});

export const {
  clearCurrentCompany,
  clearError,
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
} = companySlice.actions;

export default companySlice.reducer;