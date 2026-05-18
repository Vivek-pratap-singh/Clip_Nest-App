import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  STORAGE_KEYS,
  readJSON,
  writeJSON,
} from "../lib/storage";
import { loginUser, logoutUser, signupUser } from "./authSlice";

const readAllUserPastes = () => {
  const stored = readJSON(STORAGE_KEYS.pastesByUser, {});
  return stored && typeof stored === "object" ? stored : {};
};

const readLegacyPastes = () => {
  const legacy = readJSON(STORAGE_KEYS.legacyPastes, []);
  return Array.isArray(legacy) ? legacy : [];
};

const getPastesForUser = (email) => {
  if (!email) {
    return [];
  }

  const allPastes = readAllUserPastes();
  const userPastes = allPastes[email];

  if (Array.isArray(userPastes)) {
    return userPastes;
  }

  const legacyPastes = readLegacyPastes();
  if (legacyPastes.length > 0 && Object.keys(allPastes).length === 0) {
    const migrated = {
      ...allPastes,
      [email]: legacyPastes,
    };

    writeJSON(STORAGE_KEYS.pastesByUser, migrated);
    return legacyPastes;
  }

  return [];
};

const initialState = {
  pastes: getPastesForUser(readJSON(STORAGE_KEYS.session, "")),
};

export const pasteSlice = createSlice({
  name: "paste",
  initialState,
  reducers: {
    addToPastes: (state, action) => {
      const { userEmail, paste } = action.payload || {};

      if (!userEmail || !paste) {
        return;
      }

      state.pastes = [...state.pastes, paste];

      const allPastes = readAllUserPastes();
      allPastes[userEmail] = state.pastes;
      writeJSON(STORAGE_KEYS.pastesByUser, allPastes);

      toast("Paste added successfully!");
    },
    updateToPastes: (state, action) => {
      const { userEmail, paste } = action.payload || {};

      if (!userEmail || !paste) {
        return;
      }

      const index = state.pastes.findIndex((item) => item._id === paste._id);
      if (index !== -1) {
        state.pastes[index] = paste;

        const allPastes = readAllUserPastes();
        allPastes[userEmail] = state.pastes;
        writeJSON(STORAGE_KEYS.pastesByUser, allPastes);

        toast("Paste updated successfully!");
      }
    },
    removeFromPaste: (state, action) => {
      const { userEmail, pasteId } = action.payload || {};

      if (!userEmail || !pasteId) {
        return;
      }

      state.pastes = state.pastes.filter((item) => item._id !== pasteId);

      const allPastes = readAllUserPastes();
      allPastes[userEmail] = state.pastes;
      writeJSON(STORAGE_KEYS.pastesByUser, allPastes);
    },
    resetAllPastes: (state, action) => {
      const userEmail = action.payload?.userEmail;

      state.pastes = [];

      if (!userEmail) {
        return;
      }

      const allPastes = readAllUserPastes();
      delete allPastes[userEmail];
      writeJSON(STORAGE_KEYS.pastesByUser, allPastes);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.fulfilled, (state, action) => {
        state.pastes = getPastesForUser(action.payload.email);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.pastes = getPastesForUser(action.payload.email);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.pastes = [];
      });
  },
});

export const { addToPastes, updateToPastes, resetAllPastes, removeFromPaste } =
  pasteSlice.actions;

export default pasteSlice.reducer;
