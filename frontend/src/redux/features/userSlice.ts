import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../services/interceptor";
import { triggerToast } from "../../components/common/Snackbar";

// Types
type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  role: string;
  title: string;
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
    const response = await apiClient.get("/user/users/");
    return response.data.data.users;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch users.";
    triggerToast(errorMessage, "error");
    return rejectWithValue(errorMessage);
  }
});

export const addUser = createAsyncThunk("/user/user/", async (user: Partial<User>, { rejectWithValue }) => {
  try {
    const response = await apiClient.post("/user/user/", user);
    triggerToast(response.data?.data?.message || "User added successfully!", "success");
    return response.data.data.user;
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
      const response = await apiClient.put(`/user/user/${id}/`, user);
      triggerToast(response.data?.data?.message || "User updated successfully!", "success");
      return response.data.data.user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update user.";
      triggerToast(errorMessage, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteUser = createAsyncThunk("users/deleteUser", async (id: string, { rejectWithValue }) => {
  try {
    const response = await apiClient.delete(`/user/user/${id}/`);
    triggerToast(response.data?.data?.message || "User deleted successfully!", "success");
    return id;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to delete user.";
    triggerToast(errorMessage, "error");
    return rejectWithValue(errorMessage);
  }
});

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
      //triggerToast("Users fetched successfully!", "success");
    });
    builder.addCase(fetchUsers.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
    });

    // Add User
    builder.addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
      triggerToast("User added successfully!", "success");
    });
    builder.addCase(addUser.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
      triggerToast("Failed to add user.", "error");
    });

    // Update User
    builder.addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      triggerToast("User updated successfully!", "success");
    });
    builder.addCase(updateUser.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
      triggerToast("Failed to update user.", "error");
    });

    // Delete User
    builder.addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
      triggerToast("User deleted successfully!", "success");
    });
    builder.addCase(deleteUser.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
      triggerToast("Failed to delete user.", "error");
    });
  },
});

export default userSlice.reducer;