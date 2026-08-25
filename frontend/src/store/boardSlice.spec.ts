import { describe, it, expect } from 'vitest';
import boardReducer, { type Board } from './boardSlice';

describe('boardSlice reducer', () => {
  const initialState = {
    currentBoard: null,
    loading: false,
    error: null,
  };

  it('should return initial state when passed an empty action', () => {
    const result = boardReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should handle fetchBoard.fulfilled', () => {
    const mockBoard: Board = {
      id: 'board-1',
      title: 'Test Board',
      cards: [],
    };
    const action = {
      type: 'board/fetchBoard/fulfilled',
      payload: mockBoard,
    };

    const state = boardReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.currentBoard).toEqual(mockBoard);
  });

  it('should handle deleteBoard.fulfilled', () => {
    const activeState = {
      currentBoard: { id: 'board-1', title: 'Test', cards: [] },
      loading: false,
      error: null,
    };
    const action = {
      type: 'board/deleteBoard/fulfilled',
    };

    const state = boardReducer(activeState, action);
    expect(state.currentBoard).toBeNull();
  });
});
