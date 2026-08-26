import { useState } from 'react';
import {
  type Card,
  type ColumnStatus,
  createCard,
  moveCard,
} from '../store/boardSlice';
import { useAppDispatch } from '../store/hooks';
import { CardItem } from './CardItem';

interface ColumnProps {
  title: string;
  status: ColumnStatus;
  cards: Card[];
  boardId: string;
}

export const Column = ({ title, status, cards, boardId }: ColumnProps) => {
  const dispatch = useAppDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [isOver, setIsOver] = useState(false);

  const sortedCards = [...cards].sort((a, b) => a.order - b.order);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardTitle.trim()) return;

    void dispatch(
      createCard({
        title: cardTitle.trim(),
        description: cardDescription.trim(),
        boardId,
        status,
      }),
    );

    setCardTitle('');
    setCardDescription('');
    setIsAdding(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const cardId = e.dataTransfer.getData('text/plain');
    if (!cardId) return;

    void dispatch(
      moveCard({
        id: cardId,
        status,
        order: sortedCards.length,
      }),
    );
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 rounded-xl p-4 flex flex-col gap-3 min-h-[550px] shadow-xs transition-all border ${
        isOver
          ? 'bg-slate-100/90 border-slate-400 ring-2 ring-slate-400/20'
          : 'bg-slate-50/80 border-slate-200/90'
      }`}
    >
      {/* Column Title */}
      <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
        <h3 className="font-bold text-sm tracking-wide uppercase text-slate-700">
          {title}
        </h3>
        <span className="bg-slate-200 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
          {sortedCards.length}
        </span>
      </div>

      {/* Cards List */}
      <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto">
        {sortedCards.map((card, idx) => (
          <CardItem key={card.id} card={card} index={idx} status={status} />
        ))}
      </div>

      {/* Add Card Form / Button */}
      {isAdding ? (
        <form
          onSubmit={handleAddCard}
          className="p-3 bg-white border border-slate-300 rounded-lg shadow-sm flex flex-col gap-2.5"
        >
          <input
            type="text"
            className="w-full px-3 py-1.5 border border-slate-300 rounded-md outline-none text-sm font-semibold focus:border-slate-800"
            placeholder="Card title..."
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            autoFocus
            required
          />
          <textarea
            className="w-full px-3 py-1.5 border border-slate-300 rounded-md outline-none text-sm resize-none focus:border-slate-800"
            rows={2}
            placeholder="Description (optional)..."
            value={cardDescription}
            onChange={(e) => setCardDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              className="px-3 py-1 text-xs border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Add Card
            </button>
          </div>
        </form>
      ) : (
        <button
          className="w-full py-2.5 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100/80 hover:border-slate-400 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          onClick={() => setIsAdding(true)}
        >
          <span className="text-base leading-none">+</span> Add Card
        </button>
      )}
    </div>
  );
};
