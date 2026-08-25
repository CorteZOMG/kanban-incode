import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';

export type ColumnStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Card {
  id: string;
  title: string;
  description?: string;
  status: ColumnStatus;
  order: number;
  boardId: string;
}

export interface Board {
  id: string;
  title: string;
  cards: Card[];
}

interface BoardState {
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
}

const initialState: BoardState = {
  currentBoard: null,
  loading: false,
  error: null,
};

const API_BASE =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

// Async Thunks for API Calls

export const fetchBoard = createAsyncThunk(
  'board/fetchBoard',
  async (boardId: string) => {
    const res = await fetch(`${API_BASE}/boards/${boardId}`);
    if (!res.ok) throw new Error('Board not found');
    return (await res.json()) as Board;
  },
);

export const createBoard = createAsyncThunk(
  'board/createBoard',
  async (title: string) => {
    const res = await fetch(`${API_BASE}/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    return (await res.json()) as Board;
  },
);

export const updateBoard = createAsyncThunk(
  'board/updateBoard',
  async (payload: { id: string; title: string }) => {
    const res = await fetch(`${API_BASE}/boards/${payload.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: payload.title }),
    });
    return (await res.json()) as Board;
  },
);

export const deleteBoard = createAsyncThunk(
  'board/deleteBoard',
  async (id: string) => {
    await fetch(`${API_BASE}/boards/${id}`, { method: 'DELETE' });
    return id;
  },
);

export const createCard = createAsyncThunk(
  'board/createCard',
  async (payload: {
    title: string;
    description?: string;
    boardId: string;
    status: ColumnStatus;
  }) => {
    const res = await fetch(`${API_BASE}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return (await res.json()) as Card;
  },
);

export const updateCard = createAsyncThunk(
  'board/updateCard',
  async (payload: { id: string; title?: string; description?: string }) => {
    const res = await fetch(`${API_BASE}/cards/${payload.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: payload.title,
        description: payload.description,
      }),
    });
    return (await res.json()) as Card;
  },
);

export const deleteCard = createAsyncThunk(
  'board/deleteCard',
  async (id: string) => {
    await fetch(`${API_BASE}/cards/${id}`, { method: 'DELETE' });
    return id;
  },
);

export const moveCard = createAsyncThunk(
  'board/moveCard',
  async (payload: { id: string; status: ColumnStatus; order: number }) => {
    const res = await fetch(`${API_BASE}/cards/${payload.id}/move`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: payload.status, order: payload.order }),
    });
    return (await res.json()) as Card;
  },
);

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Board
      .addCase(fetchBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        state.loading = false;
        state.currentBoard = action.payload;
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load board';
      })
      // Create Board
      .addCase(createBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        state.currentBoard = {
          ...action.payload,
          cards: action.payload.cards || [],
        };
      })
      // Update Board
      .addCase(updateBoard.fulfilled, (state, action: PayloadAction<Board>) => {
        if (state.currentBoard) {
          state.currentBoard.title = action.payload.title;
        }
      })
      // Delete Board
      .addCase(deleteBoard.fulfilled, (state) => {
        state.currentBoard = null;
      })
      // Create Card
      .addCase(createCard.fulfilled, (state, action: PayloadAction<Card>) => {
        if (state.currentBoard) {
          state.currentBoard.cards.push(action.payload);
        }
      })
      // Update Card
      .addCase(updateCard.fulfilled, (state, action: PayloadAction<Card>) => {
        if (state.currentBoard) {
          const index = state.currentBoard.cards.findIndex(
            (c) => c.id === action.payload.id,
          );
          if (index !== -1) {
            state.currentBoard.cards[index] = action.payload;
          }
        }
      })
      // Delete Card
      .addCase(deleteCard.fulfilled, (state, action: PayloadAction<string>) => {
        if (state.currentBoard) {
          state.currentBoard.cards = state.currentBoard.cards.filter(
            (c) => c.id !== action.payload,
          );
        }
      })
      // Move Card
      .addCase(moveCard.fulfilled, (state, action: PayloadAction<Card>) => {
        if (state.currentBoard) {
          const index = state.currentBoard.cards.findIndex(
            (c) => c.id === action.payload.id,
          );
          if (index !== -1) {
            state.currentBoard.cards[index] = action.payload;
          }
        }
      });
  },
});

export default boardSlice.reducer;
