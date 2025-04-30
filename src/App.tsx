import { Component, createSignal } from 'solid-js';
import { Chessboard } from './chessboard/Chessboard';
import { PieceColor } from './lib/types/pieces';

const App: Component = () => {
  const [orientation, setOrientation] = createSignal<PieceColor>('white');

  const toggleOrientation = () => {
    setOrientation(orientation() === 'white' ? 'black' : 'white');
  };

  return (
    <div class="flex flex-1 flex-col w-screen h-screen items-center justify-center bg-gray-900">
      <div class="mt-4 max-w-md w-full flex flex-row items-center justify-between gap-x-2">
        <h1 class="text-xl font-medium text-white">
          Orientation: {orientation()}
        </h1>
        <button
          class="py-2 px-4 rounded-full font-medium text-white bg-gray-600 hover:bg-gray-500 cursor-pointer"
          onClick={toggleOrientation}
        >
          Switch to {orientation() === 'white' ? 'black' : 'white'}
        </button>
      </div>
      <Chessboard orientation={orientation} />
    </div>
  );
};

export default App;
