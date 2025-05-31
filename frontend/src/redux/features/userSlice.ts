import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/services/interceptor";
import { triggerToast } from "@/components/customToast";

// Types
type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name: string;
  role: string;
  title: string;
  gender: string;
  date_of_birth: string;
  email_verified: boolean;
  is_active: boolean;
  subscription_plan: string;
  created_at: string;
  updated_at: string;
};

type UserState = {
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

// Initial State
const initialState: UserState = {
  users: [],
  status: "idle",
  error: null,
};

// Thunks
export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get("/user/");
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch users.";
    triggerToast(errorMessage, "error");
    return rejectWithValue(errorMessage);
  }
});

export const addUser = createAsyncThunk("users/addUser", async (user: Partial<User>, { rejectWithValue }) => {
  try {
    const response = await apiClient.post("/user/register", user);
    triggerToast(response.data?.message || "User added successfully!", "success");
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to add user.";
    triggerToast(errorMessage, "error");
    return rejectWithValue(errorMessage);
  }
});

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, user }: { id: string; user: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/user/${id}`, user);
      triggerToast(response.data?.message || "User updated successfully!", "success");
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update user.";
      triggerToast(errorMessage, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteUser = createAsyncThunk("users/deleteUser", async (id: string, { rejectWithValue }) => {
  try {
    const response = await apiClient.delete(`/user/${id}`);
    triggerToast(response.data?.message || "User deleted successfully!", "success");
    return id;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to delete user.";
    triggerToast(errorMessage, "error");
    return rejectWithValue(errorMessage);
  }
});

export const assignRole = createAsyncThunk(
  "users/assignRole",
  async ({ id, role_name }: { id: string; role_name: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/user/${id}/assign-role`, { role_name });
      triggerToast(response.data?.message || "Role assigned successfully!", "success");
      // fetchUsers(); // Refresh the user list after assigning role
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to assign role.";
      triggerToast(errorMessage, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Users
    builder.addCase(fetchUsers.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.status = "succeeded";
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
    });

    // Add User
    builder.addCase(addUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.status = "succeeded";
      state.users.push(action.payload);
    });
    builder.addCase(addUser.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
    });

    // Update User
    builder.addCase(updateUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.status = "succeeded";
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    });
    builder.addCase(updateUser.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
    });

    // Delete User
    builder.addCase(deleteUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
      state.status = "succeeded";
      state.users = state.users.filter((user) => user.id !== action.payload);
    });
    builder.addCase(deleteUser.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
    });

    // Assign Role
    builder.addCase(assignRole.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(assignRole.fulfilled, (state, action: PayloadAction<User>) => {
      state.status = "succeeded";
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    });
    builder.addCase(assignRole.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
    });
  },
});

export default userSlice.reducer;