import { Header } from './components/Header';
import { BoardView } from './components/BoardView';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-8 max-w-7xl mx-auto">
      <Header />
      <BoardView />
    </div>
  );
}
