import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchBoard,
  createBoard,
  updateBoard,
  deleteBoard,
} from '../store/boardSlice';

export const Header = () => {
  const [inputBoardId, setInputBoardId] = useState('');
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const dispatch = useAppDispatch();
  const { currentBoard, loading, error } = useAppSelector(
    (state) => state.board,
  );

  const handleLoadBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputBoardId.trim()) return;
    void dispatch(fetchBoard(inputBoardId.trim()));
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    await dispatch(createBoard(newBoardTitle.trim()));
    setNewBoardTitle('');
    setIsCreating(false);
  };

  const handleStartRename = () => {
    if (currentBoard) {
      setEditedTitle(currentBoard.title);
      setIsEditingTitle(true);
    }
  };

  const handleSaveRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBoard || !editedTitle.trim()) return;
    await dispatch(
      updateBoard({ id: currentBoard.id, title: editedTitle.trim() }),
    );
    setIsEditingTitle(false);
  };

  const handleDeleteBoard = async () => {
    if (!currentBoard) return;
    await dispatch(deleteBoard(currentBoard.id));
    setInputBoardId('');
    setShowDeleteConfirm(false);
  };

  const handleCopyId = () => {
    if (currentBoard) {
      void navigator.clipboard.writeText(currentBoard.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="mb-8 flex flex-col gap-4 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {/* Load Board Form */}
        <form onSubmit={handleLoadBoard} className="flex gap-2 flex-1">
          <input
            type="text"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-800 transition-all"
            placeholder="Enter a board ID here..."
            value={inputBoardId}
            onChange={(e) => setInputBoardId(e.target.value)}
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load'}
          </button>
        </form>

        {/* New Board Toggle */}
        <button
          className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? 'Cancel' : '+ New Board'}
        </button>
      </div>

      {/* Create Board Form */}
      {isCreating && (
        <form
          onSubmit={(e) => void handleCreateBoard(e)}
          className="flex gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg"
        >
          <input
            type="text"
            className="flex-1 px-3.5 py-2 bg-white border border-gray-300 rounded-md outline-none text-sm focus:border-gray-800"
            placeholder="Enter new board title (e.g. Sprint 1 Kanban)..."
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 text-white rounded-md font-medium text-sm hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Create
          </button>
        </form>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* Current Active Board Bar */}
      {currentBoard && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {isEditingTitle ? (
              <form
                onSubmit={(e) => void handleSaveRename(e)}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  className="px-3 py-1 border border-gray-300 rounded outline-none text-sm font-bold text-gray-900 focus:border-gray-800"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  autoFocus
                  required
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-gray-900 text-white rounded text-xs font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(false)}
                  className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h2 className="text-lg font-bold text-gray-900">
                  {currentBoard.title}
                </h2>
                <button
                  onClick={handleStartRename}
                  className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Rename
                </button>
              </>
            )}

            {/* Inline Delete Confirmation */}
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 font-medium">
                  Delete board?
                </span>
                <button
                  onClick={() => void handleDeleteBoard()}
                  className="px-2.5 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors cursor-pointer"
              >
                Delete Board
              </button>
            )}
          </div>

          {/* Plain solid gray background with inline 'Copied!' state */}
          <div
            className="flex items-center gap-2 bg-gray-200 px-3 py-1.5 rounded text-xs cursor-pointer hover:bg-gray-300 transition-colors"
            onClick={handleCopyId}
            title="Click to copy Board ID"
          >
            <span className="font-mono text-gray-800">
              ID: {currentBoard.id}
            </span>
            <span
              className={
                copied
                  ? 'text-green-700 font-bold'
                  : 'text-gray-600 font-medium'
              }
            >
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
