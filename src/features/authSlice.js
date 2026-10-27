import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      return response.data.token;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);


export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);


const authSlice = createSlice({
  name: "auth",

  initialState: {
    token: localStorage.getItem("token"),
    isAuthenticated: Boolean(localStorage.getItem("token")),
    authChecked: false,
    loading: false,
    error: null,
    registerLoading: false,
    registerError: null,
    registerSuccess: false,
    user: null,
    userLoading: false,
    userError: null,
  },

 

  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    authCheckComplete: (state) => {
      state.authChecked = true;
    },

  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerLoading = false;
        state.registerSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.payload;
        state.registerSuccess = false;
      }).addCase(fetchCurrentUser.pending, (state) => {
        state.userLoading = true;
        state.userError = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.userLoading = false;
        state.userError = action.payload;
        state.isAuthenticated = false;
        state.authChecked = true;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      });
  },
});

export const { logout, authCheckComplete } = authSlice.actions;
export default authSlice.reducer;