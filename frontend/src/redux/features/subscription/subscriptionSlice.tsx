import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/services/interceptor";
import { triggerToast, dismissToast } from "@/components/customToast";

// Types
export type SubscriptionCreate = {
  user_id?: string;
  company_id?: string;
  product_id: number;
  subscription_plan_id: number;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  status?: string;
};

export type SubscriptionUpdate = {
  id: number;
  user_id?: string;
  company_id?: string;
  product_id?: number;
  subscription_plan_id?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
};

export type Subscription = {
  id: number;
  user_id?: string;
  company_id?: string;
  product_id?: number;
  subscription_plan_id?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
};

export type CountrySubscriptionPlan = {
  id: number;
  name: string;
  price: number;
  duration: number;
  country_id: string;
  features: string[];
  [key: string]: any;
};

type SubscriptionState = {
  subscriptions: Subscription[];
  currentSubscription: Subscription | null;
  countryPlans: CountrySubscriptionPlan[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
};

// Initial State
const initialState: SubscriptionState = {
  subscriptions: [],
  currentSubscription: null,
  countryPlans: [],
  status: "idle",
  error: null,
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

// Thunks
export const createSubscription = createAsyncThunk(
  "subscription/create",
  async (data: SubscriptionCreate, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/subscription/create", data);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to create subscription";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchAllSubscriptions = createAsyncThunk(
  "subscription/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/subscription/");
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to fetch subscriptions";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSubscriptionById = createAsyncThunk(
  "subscription/fetchById",
  async (subscriptionId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/subscription/${subscriptionId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to fetch subscription";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateSubscription = createAsyncThunk(
  "subscription/update",
  async (
    { subscriptionId, data }: { subscriptionId: number; data: SubscriptionUpdate },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.put(`/subscription/${subscriptionId}`, data);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to update subscription";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteSubscription = createAsyncThunk(
  "subscription/delete",
  async (subscriptionId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/subscription/${subscriptionId}`);
      return { subscriptionId, message: response.data.message };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to delete subscription";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCountrySubscriptionPlans = createAsyncThunk(
  "subscription/fetchCountryPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/subscription/country-subscription-plans");
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to fetch country subscription plans";
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSubscription: (state) => {
      state.currentSubscription = null;
    },
    setCurrentSubscription: (state, action: PayloadAction<Subscription>) => {
      state.currentSubscription = action.payload;
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
    // Create Subscription
    builder.addCase(createSubscription.pending, (state) => {
      state.createStatus = "loading";
      state.error = null;
    });
    builder.addCase(createSubscription.fulfilled, (state, action) => {
      state.createStatus = "succeeded";
      state.subscriptions.push(action.payload.data);
      dismissToast();
      triggerToast("Subscription created successfully!", "success");
    });
    builder.addCase(createSubscription.rejected, (state, action: PayloadAction<any>) => {
      state.createStatus = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });

    // Fetch All Subscriptions
    builder.addCase(fetchAllSubscriptions.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchAllSubscriptions.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.subscriptions = action.payload.data || [];
    });
    builder.addCase(fetchAllSubscriptions.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });

    // Fetch Subscription By ID
    builder.addCase(fetchSubscriptionById.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchSubscriptionById.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.currentSubscription = action.payload.data;
    });
    builder.addCase(fetchSubscriptionById.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });

    // Update Subscription
    builder.addCase(updateSubscription.pending, (state) => {
      state.updateStatus = "loading";
      state.error = null;
    });
    builder.addCase(updateSubscription.fulfilled, (state, action) => {
      state.updateStatus = "succeeded";
      const updatedSubscription = action.payload.data;
      const index = state.subscriptions.findIndex(sub => sub.id === updatedSubscription.id);
      if (index !== -1) {
        state.subscriptions[index] = updatedSubscription;
      }
      if (state.currentSubscription?.id === updatedSubscription.id) {
        state.currentSubscription = updatedSubscription;
      }
      dismissToast();
      triggerToast("Subscription updated successfully!", "success");
    });
    builder.addCase(updateSubscription.rejected, (state, action: PayloadAction<any>) => {
      state.updateStatus = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });

    // Delete Subscription
    builder.addCase(deleteSubscription.pending, (state) => {
      state.deleteStatus = "loading";
      state.error = null;
    });
    builder.addCase(deleteSubscription.fulfilled, (state, action) => {
      state.deleteStatus = "succeeded";
      const { subscriptionId } = action.payload;
      state.subscriptions = state.subscriptions.filter(sub => sub.id !== subscriptionId);
      if (state.currentSubscription?.id === subscriptionId) {
        state.currentSubscription = null;
      }
      dismissToast();
      triggerToast("Subscription deleted successfully!", "success");
    });
    builder.addCase(deleteSubscription.rejected, (state, action: PayloadAction<any>) => {
      state.deleteStatus = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });

    // Fetch Country Subscription Plans
    builder.addCase(fetchCountrySubscriptionPlans.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchCountrySubscriptionPlans.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.countryPlans = action.payload.data || [];
    });
    builder.addCase(fetchCountrySubscriptionPlans.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });
  },
});

export const {
  clearError,
  clearCurrentSubscription,
  setCurrentSubscription,
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;