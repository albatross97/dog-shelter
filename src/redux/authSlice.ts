import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { findMatchDogId, handleLogin, handleLogout } from '../utils/api';

interface AuthState {
  user: { name: string; email: string } | null;
  favorites: string[];
  match: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AuthState = {
  user: null,
  favorites: [],
  match: null,
  status: 'idle',
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ name, email }: { name: string; email: string }) => {
    const data = await handleLogin(name, email);
    return data;
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  const data = await handleLogout();
  return data;
});

export const fetchMatchedDogId = createAsyncThunk(
  'auth/fetchMatchedDogId',
  async (favoriteDogIds: string[]) => {
    const { match } = await findMatchDogId(favoriteDogIds);
    return match;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const dogId = action.payload;
      state.favorites = [...state.favorites, dogId];
    },
    removeFavorite: (state, action) => {
      const dogId = action.payload;
      state.favorites = state.favorites.filter((id) => id !== dogId);
    },
  },
  extraReducers: (builder) => {
    builder
      // login actions
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = 'failed';
      })

      // logout actions
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
      })
      .addCase(logoutUser.rejected, (state) => {
        state.status = 'failed';
      })

      // fetchMatchedDogId actions
      .addCase(fetchMatchedDogId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMatchedDogId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.match = action.payload;
      })
      .addCase(fetchMatchedDogId.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { addFavorite, removeFavorite } = authSlice.actions;

export default authSlice.reducer;
