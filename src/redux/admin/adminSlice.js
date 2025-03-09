import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  name: null,
  email: null,
  role: null,
  is_super_admin: false,
  token: null,
  services: [],
};

const adminSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, ...userDetails } = action.payload;
      return {
        ...state,
        ...userDetails,
        token,
      };
    },
    clearCredentials: () => initialState,
    updateServices: (state, action) => {
      state.services = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, updateServices } =
  adminSlice.actions;
export default adminSlice.reducer;
