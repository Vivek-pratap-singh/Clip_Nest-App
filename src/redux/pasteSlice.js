import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  pastes: localStorage.getItem("pastes")
    ? JSON.parse(localStorage.getItem("pastes"))
    : [],
};

export const pasteSlice = createSlice({
  name: "paste",
  initialState,
  reducers: {
    // Add a paste to the state
    addToPastes: (state, action) => {
      state.pastes.push(action.payload);
      localStorage.setItem("pastes", JSON.stringify(state.pastes));
      toast("Paste added successfully!");
    },
    // Update a paste in the state
    updateToPastes: (state, action) => {
      const index = state.pastes.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.pastes[index] = action.payload;
        localStorage.setItem("pastes", JSON.stringify(state.pastes));
      }
    },
    // Remove a paste from the state
    removeFromPaste: (state, action) => {
      state.pastes = state.pastes.filter((p) => p._id !== action.payload);
      localStorage.setItem("pastes", JSON.stringify(state.pastes));
    },

    // Reset all pastes in the state
    resetAllPastes: (state) => {
      state.pastes = [];
      localStorage.removeItem("pastes");
    },
  },
});

// ✅ Correct export
export const { addToPastes, updateToPastes, resetAllPastes, removeFromPaste } =
  pasteSlice.actions;

export default pasteSlice.reducer;
