import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  STORAGE_KEYS,
  createId,
  normalizeEmail,
  readJSON,
  removeStorageItem,
  writeJSON,
} from "../lib/storage";

const readUsers = () => {
  const users = readJSON(STORAGE_KEYS.users, []);
  return Array.isArray(users) ? users : [];
};

const readSessionEmail = () => {
  const sessionEmail = readJSON(STORAGE_KEYS.session, "");

  if (typeof sessionEmail !== "string") {
    return "";
  }

  return normalizeEmail(sessionEmail);
};

const initialUsers = readUsers();
const initialSessionEmail = readSessionEmail();
const initialCurrentUser = initialUsers.find(
  (user) => user.email === initialSessionEmail,
);

if (initialSessionEmail && !initialCurrentUser) {
  removeStorageItem(STORAGE_KEYS.session);
}

const initialState = {
  users: initialUsers,
  currentUserEmail: initialCurrentUser ? initialCurrentUser.email : "",
  status: "idle",
  error: null,
};

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    const normalizedEmail = normalizeEmail(email || "");
    const trimmedName = (name || "").trim();
    const trimmedPassword = (password || "").trim();
    const users = readUsers();

    if (!trimmedName) {
      return rejectWithValue("Please enter your name.");
    }

    if (!normalizedEmail) {
      return rejectWithValue("Please enter a valid email address.");
    }

    if (trimmedPassword.length < 6) {
      return rejectWithValue("Password must be at least 6 characters long.");
    }

    if (users.some((user) => user.email === normalizedEmail)) {
      return rejectWithValue("An account with this email already exists.");
    }

    const newUser = {
      id: createId("user"),
      name: trimmedName,
      email: normalizedEmail,
      password: trimmedPassword,
      createdAt: new Date().toISOString(),
    };

    const nextUsers = [...users, newUser];
    writeJSON(STORAGE_KEYS.users, nextUsers);
    writeJSON(STORAGE_KEYS.session, normalizedEmail);

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    const normalizedEmail = normalizeEmail(email || "");
    const trimmedPassword = (password || "").trim();
    const users = readUsers();
    const user = users.find((entry) => entry.email === normalizedEmail);

    if (!normalizedEmail || !trimmedPassword) {
      return rejectWithValue("Enter both email and password.");
    }

    if (!user || user.password !== trimmedPassword) {
      return rejectWithValue("Incorrect email or password.");
    }

    writeJSON(STORAGE_KEYS.session, user.email);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  },
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  removeStorageItem(STORAGE_KEYS.session);
  return true;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.users = readUsers();
        state.currentUserEmail = action.payload.email;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message || "Signup failed.";
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.users = readUsers();
        state.currentUserEmail = action.payload.email;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message || "Login failed.";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "idle";
        state.error = null;
        state.currentUserEmail = "";
      });
  },
});

export const selectCurrentUser = (state) =>
  state.auth.users.find((user) => user.email === state.auth.currentUserEmail) ||
  null;

export default authSlice.reducer;
