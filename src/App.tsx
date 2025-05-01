import { Component, createEffect, createSignal } from 'solid-js';
import { Chessboard } from './chessboard/Chessboard';
import { PieceColor, PiecePositionAlgebraic } from './components/types/pieces';
import { Button } from './components/ui/button';
import { ArrowDownUp } from 'lucide-solid';
import { Piece } from './components/pieces/Piece';
import {
  calculateEvaluation,
} from './components/utils/utils';
import { Evaluation, Move } from './components/types/chessboard';
import { initialPieceMap } from './components/board/Board';
import { EvaluationBar } from './chessboard/EvaluationBar';
import { PlayerDisplay } from './chessboard/PlayerDisplay';
import { CapturedPiecesDisplay } from './chessboard/CapturedPiecesDisplay';
import { MoveList } from './chessboard/MoveList';

const App: Component = () => {
  const [orientation, setOrientation] = createSignal<PieceColor>('white');
  const [pieceMap, setPieceMap] =
    createSignal<Partial<Record<PiecePositionAlgebraic, Piece | undefined>>>(
      initialPieceMap,
    );
  const [moves, setMoves] = createSignal<Array<Move>>([]);
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
      calculateEvaluation(capturedWhitePieces(), capturedBlackPieces()),
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
            <PlayerDisplay
              playerName="Player 1"
              color="black"
              evaluation={evaluation}
            />

            <CapturedPiecesDisplay
              capturedPieces={capturedWhitePieces}
            />
          </div>

          <div class="w-full h-fit flex flex-col items-start justify-center gap-y-1 bg-slate-800 rounded-md px-3 py-2">
            <PlayerDisplay
              playerName="Player 2"
              color="white"
              evaluation={evaluation}
            />

            <CapturedPiecesDisplay
              capturedPieces={capturedBlackPieces}
            />
          </div>
        </div>

        <EvaluationBar
          evaluation={evaluation}
          orientation={orientation}
        />
      </div>
      <Chessboard
        orientation={orientation}
        setOrientation={setOrientation}
        pieceMap={pieceMap}
        moves={moves}
        setMoves={setMoves}
        setPieceMap={setPieceMap}
        capturedWhitePieces={capturedWhitePieces}
        setCapturedWhitePieces={setCapturedWhitePieces}
        capturedBlackPieces={capturedBlackPieces}
        setCapturedBlackPieces={setCapturedBlackPieces}
      />
      <div class="w-full h-full flex flex-col gap-10 items-center justify-center p-10">
        <MoveList
          moves={moves}
        />

        <div class="w-full h-1/2 bg-slate-800 rounded-md">
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
  )
    ;
};

export default App;
