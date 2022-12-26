import { createSlice } from "@reduxjs/toolkit";
import get from "lodash/get";

const initialState = {
  token: "",
  user: {},
  isAdmin: false,
  permissions: {},
  loginSince: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.token = payload.token;
      state.user = payload.user;
      state.permissions = payload.permissions;
      // admin or superadmin can view
      state.isAdmin = !!(
        get(payload, "user.is_staff") || get(payload, "user.is_superuser")
      );
      state.loginSince = Number(new Date());
    },
    updateUserDetails: (state, { payload }) => {
      state.user = payload;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const { login, logout, updateUserDetails } = authSlice.actions;
export default authSlice.reducer;
