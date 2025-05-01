import {
  Accessor,
  Component,
  createEffect,
  createSignal,
  For,
  onMount, Setter,
} from 'solid-js';
import {
  ChessboardNotation,
  Coordinates,
  Square,
} from '../components/types/chessboard';
import { PieceColor, PiecePositionAlgebraic } from '../components/types/pieces';
import { Dynamic } from 'solid-js/web';
import { coordinatesToPosition, Piece, positionToCoordinates } from '../components/pieces/Piece';
import { findKingPosition, getInitialSquares, getNotation, togglePieceColor } from '../components/utils/utils';
import { SquareOverlay } from '../components/square-overlay';
import { Notation } from './Notation';

interface ChessboardProps {
  orientation: Accessor<PieceColor>;
  pieceMap: Accessor<Partial<Record<PiecePositionAlgebraic, Piece | undefined>>>;
  setPieceMap: Setter<Partial<Record<PiecePositionAlgebraic, Piece | undefined>>>;
  capturedWhitePieces: Accessor<Array<Piece>>;
  setCapturedWhitePieces: Setter<Array<Piece>>;
  capturedBlackPieces: Accessor<Array<Piece>>;
  setCapturedBlackPieces: Setter<Array<Piece>>;
}

export const Chessboard: Component<ChessboardProps> = ({
  orientation,
  pieceMap,
  setPieceMap,
  capturedWhitePieces,
  setCapturedWhitePieces,
  capturedBlackPieces,
  setCapturedBlackPieces,
}: ChessboardProps) => {
  const [board, setBoard] = createSignal<Array<Square>>([]);
  const [notation, setNotation] = createSignal<ChessboardNotation>();
  const [selectedPiece, setSelectedPiece] = createSignal<Piece | undefined>(
    undefined
  );

  const [whiteKingPosition, setWhiteKingPosition] = createSignal<
    PiecePositionAlgebraic | null
  >(findKingPosition(pieceMap(), 'white'));
  const [blackKingPosition, setBlackKingPosition] = createSignal<
    PiecePositionAlgebraic | null
  >(findKingPosition(pieceMap(), 'black'));

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
    <div class="relative w-[448px] h-[448px] min-w-[448px] min-h-[448px]">
      <div
        classList={{
          'rotate-180': orientation() === 'black',
        }}
        class="bg-gray-300 grid grid-cols-8 grid-rows-8 transition-transform duration-1000 w-full h-full"
      >
        <For each={board()}>
          {(square: Square) => {
            const piecePositionAlgebraic: PiecePositionAlgebraic = `${square.file}${square.rank}`;
            const piece = (): Piece | undefined => pieceMap()[piecePositionAlgebraic];
            const isSelected = (): boolean =>
              !!selectedPiece() && !!piece() && (piece()?.position === selectedPiece()?.position);
            /*const isValidMoveTarget = (): boolean => {
              const sp = selectedPiece();
              if (!sp) return false;
              const ownKingPos: PiecePositionAlgebraic | null =
                sp.color === 'white'
                  ? whiteKingPosition()
                  : blackKingPosition();
              if (!ownKingPos) return false;
              return sp
                .getValidMoves(pieceMap(), ownKingPos, enPassantTarget())
                .includes(piecePositionAlgebraic);
            };*/

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

      <Notation notation={notation()} side="vertical" />
      <Notation notation={notation()} side="horizontal" />
    </div>
  );
};
