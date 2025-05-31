import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { validateToken } from "@/utils/utils";
import apiClient from "@/services/interceptor";
import { triggerToast, dismissToast } from "@/components/customToast";
import { jwtDecode } from "jwt-decode";

// Types
type User = {
  email: string;
  password: string;
};

type RegisterUser = {
  email: string;
  password: string;
  confirmPassword?: string;
  [key: string]: any;
};

type AuthPayload = {
  data: {
    access_token: string;
    refresh_token: string;
    user_role: string;
    [key: string]: any;
  };
};

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  title: string;
  company_name: string;
  avatar?: string;
};

type AuthState = {
  basicUserInfo: any;
  userProfileData: UserProfile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isAuthenticated: boolean;
  role: string | null;
};

// Initial State
const initialState: AuthState = {
  basicUserInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") as string)
    : null,
  userProfileData: null,
  status: "idle",
  error: null,
  isAuthenticated:
    !!localStorage.getItem("access_token") &&
    validateToken(localStorage.getItem("access_token") as string),
  role: localStorage.getItem("role") || null,
};

// Thunks
export const login = createAsyncThunk(
  "auth/login",
  async (data: User, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login/", data);
      console.log("response", response)
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Invalid credentials. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterUser, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/user/register/", data);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data ||
        "Registration failed";
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    data: { email: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/user/verify-otp", data);
      const result = response.data;

      if (response.status !== 200) {
        triggerToast(result.message || "OTP verification failed", "error");
        return rejectWithValue(result.message || "OTP verification failed");
      }

      triggerToast("OTP verified successfully!", "success");
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      triggerToast(message, "error");
      return rejectWithValue(message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      const response = await apiClient.get(`/user/${decoded?.user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user profile";
      return rejectWithValue(errorMessage);
    }
  }
);
export const requestResetOtp = createAsyncThunk(
  "auth/requestResetOtp",
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/user/forget-password", data);

      if (response.status === 200) {
        triggerToast(response.data?.message || "Reset OTP sent successfully!", "success");
        return response.data;
      } else {
        return rejectWithValue(response.data?.message || "Failed to send reset OTP");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An error occurred while sending reset OTP";
      triggerToast(errorMessage, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: { email: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/user/reset-password", data);

      if (response.status == 200) {
        triggerToast(response.data?.message || "Password reset successfully!", "success");
        return response.data;
      } else {
        return rejectWithValue(response.data?.message || "Password reset failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during password reset";
      triggerToast(errorMessage, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/logout");

      if (response.status == 200) {
        triggerToast(response.data?.message || "logout successfully!", "success");
        return response.data;
      } else {
        return rejectWithValue(response.data?.message || "logout failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during logout";
      triggerToast(errorMessage, "error");
      return rejectWithValue(errorMessage);
    }
  }
);
// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // logout: (state) => {
    //   state.basicUserInfo = null;
    //   state.userProfileData = null;
    //   state.status = "idle";
    //   state.error = null;
    //   state.isAuthenticated = false;
    //   state.role = null;
    //   localStorage.clear();
    // },
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
      localStorage.setItem("role", action.payload);
    },
    // setUserProfile: (state, action: PayloadAction<UserProfile>) => {
    //   state.userProfileData = action.payload;
    // },
    clearUserProfile: (state) => {
      state.userProfileData = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<AuthPayload>) => {
      console.log("action.payload.data", action.payload.data);
      const { access_token, refresh_token, user_role, ...userInfo } = action.payload.data;
      state.status = "succeeded";
      state.basicUserInfo = userInfo;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("role", user_role);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      // const decoded = jwtDecode(access_token);
      // console.log("decode",decoded);
      // localStorage.setItem("decoded",JSON.stringify(decoded));
      state.role = user_role;
      state.isAuthenticated = validateToken(access_token);
      dismissToast();
      triggerToast("Login successful!", "success");
    });
    builder.addCase(login.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
      console.log("err", action.payload)
      dismissToast();
      triggerToast(action.payload, "error");
      state.isAuthenticated = false;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action: PayloadAction<AuthPayload>) => {
      const { access_token, refresh_token, user_role, ...userInfo } = action.payload.data;
      state.status = "succeeded";
      state.basicUserInfo = userInfo;
      dismissToast();
      triggerToast("Registered successfully!", "success");
    });
    builder.addCase(register.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action?.payload?.message || "Registration failed";
      state.isAuthenticated = false;

      console.log("Registration Error:", action);

      dismissToast();

      const errorMessage =
        action?.payload?.errors?.[0]?.message ||
        action?.payload?.message ||
        "Registration error";

      triggerToast(errorMessage, "error");
    });


    // Verify OTP
    builder.addCase(verifyOtp.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action: PayloadAction<any>) => {
      state.status = "succeeded";
      state.basicUserInfo = {
        ...state.basicUserInfo,
        ...action.payload,
      };
      dismissToast();
      triggerToast(action.payload.data.message || "OTP verified successfully!", "success");
    });
    builder.addCase(verifyOtp.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
      dismissToast();
      triggerToast(action.payload, "error");
    });

    // Fetch User Profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(
      fetchUserProfile.fulfilled,
      (state, action: PayloadAction<UserProfile>) => {
        console.log("datarole", action?.payload?.data)
        state.status = "succeeded";
        state.userProfileData = action?.payload?.data;
        state.role = action?.payload?.data?.role_name
      }
    );

    builder.addCase(fetchUserProfile.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
    });

    // Request Reset OTP
    builder.addCase(requestResetOtp.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(requestResetOtp.fulfilled, (state) => {
      state.status = "succeeded";
      dismissToast();
    });
    builder.addCase(requestResetOtp.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
    });
    // Reset Password
    builder.addCase(resetPassword.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.status = "succeeded";
      // dismissToast();
    });
    builder.addCase(resetPassword.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
    });
    builder.addCase(logout.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.status = "succeeded";
      state.basicUserInfo = null;
      state.userProfileData = null;
      state.status = "idle";
      state.error = null;
      state.isAuthenticated = false;
      state.role = null;
      localStorage.clear();
      // dismissToast();
    });
    builder.addCase(logout.rejected, (state, action: PayloadAction<any>) => {
      state.status = "failed";
      state.error = action.payload;
    });
  },
});

export const {  setRole, clearUserProfile } = authSlice.actions;
export default authSlice.reducer;
