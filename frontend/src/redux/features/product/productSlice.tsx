import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/services/interceptor";
import { triggerToast, dismissToast } from "@/components/customToast";

// Types
export type Product = {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
};

export type ProductCreate = {
  name: string;
  description?: string;
};

export type ProductUpdate = {
  name?: string;
  description?: string;
  is_active?: boolean;
};

type ProductState = {
  products: Product[];
  currentProduct: Product | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
};

// Initial State
const initialState: ProductState = {
  products: [],
  currentProduct: null,
  status: "idle",
  error: null,
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

// Thunks
export const createProduct = createAsyncThunk(
  "product/create",
  async (data: ProductCreate, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/product/create", data);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to create product";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/product/");
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to fetch products";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/product/${productId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to fetch product";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/update",
  async (
    { productId, data }: { productId: number; data: ProductUpdate },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.put(`/product/update/${productId}`, data);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to update product";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (productId: number, { rejectWithValue }) => {
    try {
      // Since there's no delete endpoint, we'll deactivate the product
      const response = await apiClient.put(`/product/update/${productId}`, { is_active: false });
      return { ...response.data, productId };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to deactivate product";
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
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
    // Create Product
    builder.addCase(createProduct.pending, (state) => {
      state.createStatus = "loading";
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action: PayloadAction<any>) => {
      state.createStatus = "succeeded";
      state.products.unshift(action.payload.data);
      dismissToast();
      triggerToast(action.payload.message || "Product created successfully!", "success");
    });
    builder.addCase(createProduct.rejected, (state, action: PayloadAction<any>) => {
      state.createStatus = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });

    // Fetch All Products
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchAllProducts.fulfilled, (state, action: PayloadAction<any>) => {
      state.status = "succeeded";
      state.products = action.payload.data || [];
    });
    builder.addCase(fetchAllProducts.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });

    // Fetch Product By ID
    builder.addCase(fetchProductById.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action: PayloadAction<any>) => {
      state.status = "succeeded";
      state.currentProduct = action.payload.data;
    });
    builder.addCase(fetchProductById.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });

    // Update Product
    builder.addCase(updateProduct.pending, (state) => {
      state.updateStatus = "loading";
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action: PayloadAction<any>) => {
      state.updateStatus = "succeeded";
      const updatedProduct = action.payload.data;
      
      // Update in products array
      const index = state.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
      
      // Update current product if it's the same
      if (state.currentProduct?.id === updatedProduct.id) {
        state.currentProduct = updatedProduct;
      }
      
      dismissToast();
      triggerToast(action.payload.message || "Product updated successfully!", "success");
    });
    builder.addCase(updateProduct.rejected, (state, action: PayloadAction<any>) => {
      state.updateStatus = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });

    // Delete Product
    builder.addCase(deleteProduct.pending, (state) => {
      state.deleteStatus = "loading";
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action: PayloadAction<any>) => {
      state.deleteStatus = "succeeded";
      const { productId } = action.payload;
      
      // Update product status in the array (mark as deactivated)
      const index = state.products.findIndex(p => p.id === productId);
      if (index !== -1) {
        state.products[index] = { ...state.products[index], is_active: false };
      }
      
      // Update current product if it's the same
      if (state.currentProduct?.id === productId) {
        state.currentProduct = { ...state.currentProduct, is_active: false };
      }
      
      dismissToast();
      triggerToast(action.payload.message || "Product deactivated successfully!", "success");
    });
    builder.addCase(deleteProduct.rejected, (state, action: PayloadAction<any>) => {
      state.deleteStatus = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });
  },
});

export const {
  clearCurrentProduct,
  clearError,
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
} = productSlice.actions;

export default productSlice.reducer;