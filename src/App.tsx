import { Component, createEffect, createSignal, For, Show } from 'solid-js';
import { Chessboard } from './chessboard/Chessboard';
import { PieceColor, PiecePositionAlgebraic } from './components/types/pieces';
import { Button } from './components/ui/button';
import { ArrowDownUp } from 'lucide-solid';
import { Piece } from './components/pieces/Piece';
import {
  calculateEvaluation,
  displayEvaluation,
  getGradientPercentage,
} from './components/utils/utils';
import { Evaluation } from './components/types/chessboard';
import { initialPieceMap } from './components/board/Board';

const App: Component = () => {
  const [orientation, setOrientation] = createSignal<PieceColor>('white');

  const [pieceMap, setPieceMap] =
    createSignal<Partial<Record<PiecePositionAlgebraic, Piece | undefined>>>(
      initialPieceMap
    );

  const [capturedWhitePieces, setCapturedWhitePieces] = createSignal<
    Array<Piece>
  >([]);
  const [capturedBlackPieces, setCapturedBlackPieces] = createSignal<
    Array<Piece>
  >([]);
  const [evaluation, setEvaluation] = createSignal<Evaluation>({
    winning: 'equal',
    blackMaterialDifference: 0,
    whiteMaterialDifference: 0,
  });

  createEffect(() => {
    setEvaluation(
      calculateEvaluation(capturedWhitePieces(), capturedBlackPieces())
    );
  });

  const toggleOrientation = () => {
    setOrientation(orientation() === 'white' ? 'black' : 'white');
  };

  return (
    <div class="flex flex-1 flex-row w-full h-screen items-center justify-center bg-background text-foreground overflow-hidden bg-slate-900">
      <div class="w-full h-full flex flex-row items-center justify-center gap-x-6 p-10">
        <div class="w-full h-full flex flex-col items-center justify-between text-white">
          <div class="w-full h-fit flex flex-col items-start justify-center gap-y-1 bg-slate-800 rounded-md px-3 py-2">
            <div class="flex flex-row items-center justify-between w-full">
              <div class="flex flex-row items-center gap-x-3 justify-start">
                <label class="text-slate-200">Player 1</label>
                <Show when={evaluation()!.blackMaterialDifference !== 0}>
                  <span class="text-slate-500 font-medium">
                    {displayEvaluation(evaluation()!.blackMaterialDifference)}
                  </span>
                </Show>
              </div>
              <div class="rounded-full w-6 h-6 bg-black" />
            </div>
            <Show when={capturedWhitePieces().length > 0}>
              <div class="flex flex-row flex-wrap items-center justify-start p-1">
                <For each={capturedWhitePieces()}>
                  {(piece: Piece) => <span>{piece.symbol}</span>}
                </For>
              </div>
            </Show>
          </div>

          <div class="w-full h-fit flex flex-col items-start justify-center gap-y-1 bg-slate-800 rounded-md px-3 py-2">
            <div class="flex flex-row items-center justify-between w-full">
              <div class="flex flex-row items-center gap-x-3 justify-start">
                <label class="text-slate-200">Player 2</label>
                <Show when={evaluation()!.whiteMaterialDifference !== 0}>
                  <span class="text-slate-500 font-medium">
                    {displayEvaluation(evaluation()!.whiteMaterialDifference)}
                  </span>
                </Show>
              </div>
              <div class="rounded-full w-6 h-6 bg-white" />
            </div>
            <Show when={capturedBlackPieces().length > 0}>
              <div class="flex flex-row flex-wrap items-center justify-start p-1">
                <For each={capturedBlackPieces()}>
                  {(piece: Piece) => <span>{piece.symbol}</span>}
                </For>
              </div>
            </Show>
          </div>
        </div>

        <div
          class="relative w-8 h-full rounded-full border-2 border-slate-800 overflow-hidden transition-all duration-1000"
          style={{
            background: `linear-gradient(to top, 
              ${orientation() === 'white' ? 'white' : 'black'} 0%, 
              ${orientation() === 'white' ? 'white' : 'black'} ${getGradientPercentage(evaluation(), orientation())}%, 
              ${orientation() === 'white' ? 'black' : 'white'} ${getGradientPercentage(evaluation(), orientation())}%, 
              ${orientation() === 'white' ? 'black' : 'white'} 100%)`,
          }}
        >
          <Show when={evaluation().winning !== 'equal'}>
            <span class="absolute top-1 right-0 left-0 text-center text-slate-500 text-sm">
              {displayEvaluation(
                orientation() === 'white'
                  ? evaluation().blackMaterialDifference
                  : evaluation().whiteMaterialDifference
              )}
            </span>
            <span class="absolute bottom-1 right-0 left-0 text-center text-slate-500 text-sm">
              {displayEvaluation(
                orientation() === 'white'
                  ? evaluation().blackMaterialDifference
                  : evaluation().whiteMaterialDifference
              )}
            </span>
          </Show>
        </div>
      </div>
      <Chessboard
        orientation={orientation}
        pieceMap={pieceMap}
        setPieceMap={setPieceMap}
        capturedWhitePieces={capturedWhitePieces}
        setCapturedWhitePieces={setCapturedWhitePieces}
        capturedBlackPieces={capturedBlackPieces}
        setCapturedBlackPieces={setCapturedBlackPieces}
      />
      <div class="w-full h-full flex items-center justify-center p-10">
        <div class="w-full h-full">
          <div class="flex flex-row items-center justify-between p-2">
            <Button
              size="icon"
              variant="default"
              onClick={toggleOrientation}
              class="cursor-pointer bg-slate-300 hover:bg-slate-100 transition-colors duration-300"
            >
              <ArrowDownUp class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
