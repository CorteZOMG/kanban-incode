import { useState } from 'react';
import {
  type Card,
  type ColumnStatus,
  updateCard,
  deleteCard,
  moveCard,
} from '../store/boardSlice';
import { useAppDispatch } from '../store/hooks';

interface CardItemProps {
  card: Card;
  index: number;
  status: ColumnStatus;
}

export const CardItem = ({ card, index, status }: CardItemProps) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dropPosition, setDropPosition] = useState<'above' | 'below' | null>(
    null,
  );
  const [isDraggingSelf, setIsDraggingSelf] = useState(false);

  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    void dispatch(
      updateCard({
        id: card.id,
        title,
        description,
      }),
    );
    setIsEditing(false);
  };

  const handleDelete = () => {
    void dispatch(deleteCard(card.id));
    setShowDeleteConfirm(false);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', card.id);
    setIsDraggingSelf(true);
  };

  const handleDragEnd = () => {
    setIsDraggingSelf(false);
    setDropPosition(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    if (offsetY < rect.height / 2) {
      setDropPosition('above');
    } else {
      setDropPosition('below');
    }
  };

  const handleDragLeave = () => {
    setDropPosition(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const draggedCardId = e.dataTransfer.getData('text/plain');
    const position = dropPosition;
    setDropPosition(null);

    if (!draggedCardId || draggedCardId === card.id) return;

    const targetOrder = position === 'below' ? index + 1 : index;

    void dispatch(
      moveCard({
        id: draggedCardId,
        status,
        order: targetOrder,
      }),
    );
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleUpdate}
        className="p-3.5 bg-white border border-slate-300 rounded-lg shadow-sm flex flex-col gap-2.5"
      >
        <input
          type="text"
          className="w-full px-3 py-1.5 border border-slate-300 rounded-md outline-none text-xs font-semibold focus:border-slate-800"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full px-3 py-1.5 border border-slate-300 rounded-md outline-none text-xs resize-none focus:border-slate-800"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description..."
        />
        <div className="flex justify-end gap-1.5">
          <button
            type="button"
            className="px-2.5 py-1 text-xs border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-2.5 py-1 text-xs font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative p-3.5 bg-white border rounded-lg shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing flex flex-col gap-1.5 ${
        isDraggingSelf ? 'opacity-40 scale-95' : 'opacity-100'
      } ${
        dropPosition === 'above'
          ? 'border-t-4 border-t-slate-800 border-x-slate-200 border-b-slate-200'
          : dropPosition === 'below'
            ? 'border-b-4 border-b-slate-800 border-x-slate-200 border-t-slate-200'
            : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <h4 className="font-semibold text-sm text-slate-900 break-words leading-snug">
          {card.title}
        </h4>

        {/* Inline Card Delete Confirmation */}
        {showDeleteConfirm ? (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-red-600 font-medium">Delete?</span>
            <button
              onClick={handleDelete}
              className="text-red-600 font-bold hover:underline cursor-pointer"
            >
              Yes
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-slate-500 hover:underline cursor-pointer"
            >
              No
            </button>
          </div>
        ) : (
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="px-1.5 py-0.5 text-xs text-slate-500 hover:text-slate-900 rounded transition-colors cursor-pointer font-medium"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="px-1.5 py-0.5 text-xs text-red-500 hover:text-red-700 rounded transition-colors cursor-pointer font-medium"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {card.description && (
        <p className="text-xs text-slate-500 break-words whitespace-pre-wrap leading-relaxed">
          {card.description}
        </p>
      )}
    </div>
  );
};
