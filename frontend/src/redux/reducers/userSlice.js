import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      state.user = action.payload.user;
      sessionStorage.setItem("vidhyalaya-app-token", action.payload.token);
    },
    logout: (state) => {
      state.currentUser = null;
      state.user = null;
      sessionStorage.removeItem("vidhyalaya-app-token");
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
