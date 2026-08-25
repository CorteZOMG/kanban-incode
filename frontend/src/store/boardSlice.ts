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

async function handleResponse<T>(
  res: Response,
  fallbackErrorMsg: string,
): Promise<T> {
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        'Board not found. Verify the Board ID (it has to be 32 character line lol).',
      );
    }
    let errorJson: { message?: string | string[] } | null = null;
    try {
      errorJson = (await res.json()) as { message?: string | string[] };
    } catch {
      // Body was not JSON
    }
    const message = Array.isArray(errorJson?.message)
      ? errorJson.message.join(', ')
      : errorJson?.message;

    throw new Error(message || fallbackErrorMsg);
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new Error('Received invalid format from server.');
  }
}

// Async Thunks for API Calls

export const fetchBoard = createAsyncThunk(
  'board/fetchBoard',
  async (boardId: string) => {
    const res = await fetch(`${API_BASE}/boards/${boardId}`);
    return handleResponse<Board>(
      res,
      'Board not found. Verify the Board ID (it has to be 32 character line lol)',
    );
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
    return handleResponse<Board>(res, 'Failed to create board.');
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
    return handleResponse<Board>(res, 'Failed to update board title.');
  },
);

export const deleteBoard = createAsyncThunk(
  'board/deleteBoard',
  async (id: string) => {
    const res = await fetch(`${API_BASE}/boards/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error('Failed to delete board.');
    }
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
    return handleResponse<Card>(res, 'Failed to create card.');
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
    return handleResponse<Card>(res, 'Failed to update card.');
  },
);

export const deleteCard = createAsyncThunk(
  'board/deleteCard',
  async (id: string) => {
    const res = await fetch(`${API_BASE}/cards/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error('Failed to delete card.');
    }
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
    return handleResponse<Card>(res, 'Failed to move card.');
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
