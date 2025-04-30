import {
  Accessor,
  Component,
  createEffect,
  createSignal,
  For,
  onMount,
} from 'solid-js';
import {
  ChessboardNotation, Coordinates,
  FileId,
  RankId,
  Square,
} from '../lib/types/chessboard';
import { PieceColor, PiecePositionAlgebraic } from '../lib/types/pieces';
import { Dynamic } from 'solid-js/web';
import { coordinatesToPosition, Piece, positionToCoordinates } from '../lib/pieces/Piece';
import { initialPieceMap } from '../lib/board/Board';
import { findKingPosition, getInitialSquares, getNotation, togglePieceColor } from '../lib/utils/utils';
import { SquareOverlay } from '../components/square-overlay';

interface ChessboardProps {
  orientation: Accessor<PieceColor>;
}

export const Chessboard: Component<ChessboardProps> = ({
  orientation,
}: ChessboardProps) => {
  const [board, setBoard] = createSignal<Array<Square>>([]);
  const [pieceMap, setPieceMap] =
    createSignal<Partial<Record<PiecePositionAlgebraic, Piece | undefined>>>(
      initialPieceMap
    );
  const [notation, setNotation] = createSignal<ChessboardNotation>();
  const [selectedPiece, setSelectedPiece] = createSignal<Piece | undefined>(
    undefined
  );

  const [whiteKingPosition, setWhiteKingPosition] = createSignal<
    PiecePositionAlgebraic | null
  >(findKingPosition(initialPieceMap, 'white'));
  const [blackKingPosition, setBlackKingPosition] = createSignal<
    PiecePositionAlgebraic | null
  >(findKingPosition(initialPieceMap, 'black'));

  const [capturedWhitePieces, setCapturedWhitePieces] = createSignal<
    Array<Piece>
  >([]);
  const [capturedBlackPieces, setCapturedBlackPieces] = createSignal<
    Array<Piece>
  >([]);

  const [turn, setTurn] = createSignal<PieceColor>("white");
  const [enPassantTarget, setEnPassantTarget] = createSignal<
    PiecePositionAlgebraic | null
  >(null);

  onMount(() => {
    setBoard(getInitialSquares());
    setNotation(getNotation(orientation()));
  });

  createEffect(() => {
    setNotation(getNotation(orientation()));
  });

  const handleSquareClick = (square: Square) => {
    const clickedPosition: PiecePositionAlgebraic = `${square.file}${square.rank}`;
    const pieceOnClickedSquare = (): Piece | undefined => pieceMap()[clickedPosition];
    const currentSelectedPiece = (): Piece | undefined => selectedPiece();

    if (currentSelectedPiece()) {
      const startPosition: PiecePositionAlgebraic =
        currentSelectedPiece()!.position;

      if (clickedPosition === startPosition) {
        setSelectedPiece(undefined);
      } else {
        const ownKingPosition: PiecePositionAlgebraic | null =
          currentSelectedPiece()!.color === 'white'
            ? whiteKingPosition()
            : blackKingPosition();

        if (!ownKingPosition) {
          setSelectedPiece(undefined);
          return;
        }

        const validMoves: Array<PiecePositionAlgebraic> = currentSelectedPiece()!.getValidMoves(
          pieceMap(),
          ownKingPosition,
          enPassantTarget(),
        );

        if (validMoves.includes(clickedPosition)) {
          const nextPieceMap = { ...pieceMap() };
          const pieceToCapture: Piece | undefined = nextPieceMap[clickedPosition];

          const movedPiece: Piece = currentSelectedPiece()!.clone();
          movedPiece.position = clickedPosition;
          movedPiece.hasMoved = true;

          nextPieceMap[startPosition] = undefined;
          nextPieceMap[clickedPosition] = movedPiece;

          if (movedPiece.type === 'king') {
            if (movedPiece.color === 'white') {
              setWhiteKingPosition(clickedPosition);
            } else {
              setBlackKingPosition(clickedPosition);
            }
          }

          if (pieceToCapture) {
            pieceToCapture.captured = true;
            if (pieceToCapture.color === 'white') {
              setCapturedWhitePieces([...capturedWhitePieces(), pieceToCapture]);
            } else {
              setCapturedBlackPieces([...capturedBlackPieces(), pieceToCapture]);
            }
          }

          if (
            movedPiece.type === 'pawn' &&
            clickedPosition === enPassantTarget()
          ) {
            const direction: 1 | -1 = movedPiece.color === 'white' ? -1 : 1;
            const targetCoords: Coordinates | null = positionToCoordinates(clickedPosition);
            if (targetCoords) {
              const capturedPawnCoords: Coordinates = {
                fileIndex: targetCoords.fileIndex,
                rankIndex: targetCoords.rankIndex + direction,
              };
              const capturedPawnPos: PiecePositionAlgebraic | null = coordinatesToPosition(capturedPawnCoords);
              if (capturedPawnPos) {
                const actualCapturedPawn: Piece | undefined = nextPieceMap[capturedPawnPos];
                if (
                  actualCapturedPawn &&
                  actualCapturedPawn.type === 'pawn' &&
                  actualCapturedPawn.color !== movedPiece.color
                ) {
                  nextPieceMap[capturedPawnPos] = undefined;
                  actualCapturedPawn.captured = true;
                  if (actualCapturedPawn.color === 'white') {
                    setCapturedWhitePieces([
                      ...capturedWhitePieces(),
                      actualCapturedPawn,
                    ]);
                  } else {
                    setCapturedBlackPieces([
                      ...capturedBlackPieces(),
                      actualCapturedPawn,
                    ]);
                  }
                }
              }
            }
          }

          let nextEnPassantTarget: PiecePositionAlgebraic | null = null;
          if (movedPiece.type === 'pawn') {
            const startCoords: Coordinates | null = positionToCoordinates(startPosition);
            const endCoords: Coordinates | null = positionToCoordinates(clickedPosition);
            if (startCoords && endCoords && Math.abs(startCoords.rankIndex - endCoords.rankIndex) === 2) {
              const direction: 1 | -1 = movedPiece.color === 'white' ? 1 : -1;
              nextEnPassantTarget = coordinatesToPosition({
                fileIndex: startCoords.fileIndex,
                rankIndex: startCoords.rankIndex + direction,
              });
            }
          }
          setEnPassantTarget(nextEnPassantTarget);


          setPieceMap(nextPieceMap);
          setSelectedPiece(undefined);
          setTurn(togglePieceColor(turn()));

          // TODO: Handle Castling (move the rook) - needs more logic here or in Piece class
          // TODO: Handle Pawn Promotion - check if pawn reached last rank
          // TODO: Check for check/checkmate/stalemate after the move
        } else {
          if (
            pieceOnClickedSquare() &&
            pieceOnClickedSquare()!.color === currentSelectedPiece()!.color
          ) {
            setSelectedPiece(pieceOnClickedSquare);
          } else {
            setSelectedPiece(undefined);
          }
        }
      }
    } else {
      if (pieceOnClickedSquare() && pieceOnClickedSquare()!.color === turn()) {
        setSelectedPiece(pieceOnClickedSquare());
      }
    }
  };

  return (
    <div class="flex flex-row w-full h-full text-center items-center justify-center overflow-hidden">
      <div class="w-8 h-[448px] flex flex-col items-center justify-around">
        <For each={notation()?.ranks}>
          {(rank: RankId) => (
            <div class="w-14 h-full flex items-center justify-center text-xs text-gray-300">
              {rank}
            </div>
          )}
        </For>
      </div>

      <div>
        <div class="h-8 w-[448px] text-white" />

        <div
          classList={{
            'rotate-180': orientation() === 'black',
          }}
          class="bg-gray-300 grid grid-cols-8 grid-rows-8 transition-transform duration-1000" // Added transition-transform
        >
          <For each={board()}>
            {(square: Square) => {
              const piecePositionAlgebraic: PiecePositionAlgebraic = `${square.file}${square.rank}`;
              const piece = (): Piece | undefined => pieceMap()[piecePositionAlgebraic];
              const isSelected = (): boolean =>
                !!selectedPiece() && !!piece() && (piece()?.position === selectedPiece()?.position);
              const isValidMoveTarget = (): boolean => {
                const sp = selectedPiece();
                if (!sp) return false;
                const ownKingPos =
                  sp.color === 'white'
                    ? whiteKingPosition()
                    : blackKingPosition();
                if (!ownKingPos) return false;
                return sp
                  .getValidMoves(pieceMap(), ownKingPos, enPassantTarget())
                  .includes(piecePositionAlgebraic);
              };

              return (
                <div
                  classList={{
                    'bg-gray-500 text-white': square.even,
                    'bg-gray-200 text-gray-900': !square.even,
                    'outline outline-4 outline-blue-500 outline-offset-[-4px] z-10':
                      isSelected(),
                    'hover:outline hover:outline-2 hover:outline-gray-500 hover:outline-offset-[-2px]':
                      !!piece() && piece()?.color === turn(),
                  }}
                  class="relative h-14 w-14 flex items-center justify-center text-xs cursor-pointer"
                  onClick={() => {
                    if (
                      selectedPiece() ||
                      (piece() && piece()?.color === turn())
                    ) {
                      handleSquareClick(square);
                    }
                  }}
                >
                  <div
                    classList={{
                      'rotate-180': orientation() === 'black',
                    }}
                    class="transition-transform duration-1000 w-full h-full flex items-center justify-center"
                  >
                    <div class="z-20">
                      <Dynamic component={piece()?.image} />
                    </div>

                    <SquareOverlay
                      selectedPiece={selectedPiece()}
                      pieceMap={pieceMap()}
                      piecePositionAlgebraic={piecePositionAlgebraic}
                    />
                  </div>
                </div>
              );
            }}
          </For>
        </div>

        <div class="h-8 w-full flex">
          <For each={notation()?.files}>
            {(file: FileId) => (
              <div class="h-14 w-full flex pt-2 items-top justify-center text-center text-xs text-gray-300">
                {file}
              </div>
            )}
          </For>
        </div>
      </div>

      <div class="w-8 h-[448px]" />

      {/* TODO: Display captured pieces using capturedWhitePieces() and capturedBlackPieces() */}
    </div>
  );
};
