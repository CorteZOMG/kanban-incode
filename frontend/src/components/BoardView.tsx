import { useAppSelector } from '../store/hooks';
import { Column } from './Column';

export const BoardView = () => {
  const { currentBoard } = useAppSelector((state) => state.board);

  if (!currentBoard) {
    return (
      <div className="flex flex-col items-center justify-center p-14 border border-dashed border-slate-300 rounded-xl text-center bg-slate-50/50">
        <h3 className="text-base font-bold text-slate-800 mb-1">
          No Board Loaded
        </h3>
        <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
          Enter a board ID above and click <strong>Load</strong>, or click{' '}
          <strong>+ New Board</strong> to generate a fresh Kanban workspace.
        </p>
      </div>
    );
  }

  const cards = currentBoard.cards || [];
  const todoCards = cards.filter((c) => c.status === 'TODO');
  const inProgressCards = cards.filter((c) => c.status === 'IN_PROGRESS');
  const doneCards = cards.filter((c) => c.status === 'DONE');

  return (
    <div className="flex flex-col md:flex-row gap-5 w-full">
      <Column
        title="To Do"
        status="TODO"
        cards={todoCards}
        boardId={currentBoard.id}
      />
      <Column
        title="In Progress"
        status="IN_PROGRESS"
        cards={inProgressCards}
        boardId={currentBoard.id}
      />
      <Column
        title="Done"
        status="DONE"
        cards={doneCards}
        boardId={currentBoard.id}
      />
    </div>
  );
};
