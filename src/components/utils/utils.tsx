import { PieceColor, PiecePositionAlgebraic, PieceType } from '../types/pieces';
import { Evaluation, FileId, RankId, Square } from '../types/chessboard';
import { Piece } from '../pieces/Piece';
import { WhiteKing } from '../icons/white-king';
import { BlackKing } from '../icons/black-king';
import { WhiteQueen } from '../icons/white-queen';
import { BlackQueen } from '../icons/black-queen';
import { WhiteRook } from '../icons/white-rook';
import { BlackRook } from '../icons/black-rook';
import { WhiteBishop } from '../icons/white-bishop';
import { BlackBishop } from '../icons/black-bishop';
import { WhiteKnight } from '../icons/white-knight';
import { BlackKnight } from '../icons/black-knight';
import { WhitePawn } from '../icons/white-pawn';
import { BlackPawn } from '../icons/black-pawn';

const fileIds: Array<FileId> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const rankIds: Array<RankId> = [1, 2, 3, 4, 5, 6, 7, 8];

export const getInitialSquares = (): Array<Square> => {
  let squares: Array<Square> = [];

  for (
    let rankIndex: number = rankIds.length - 1;
    rankIndex >= 0;
    rankIndex--
  ) {
    for (let fileIndex: number = 0; fileIndex < fileIds.length; fileIndex++) {
      squares.push({
        file: fileIds[fileIndex],
        rank: rankIds[rankIndex],
        even:
          (rankIndex % 2 === 0 && fileIndex % 2 === 0) ||
          (rankIndex % 2 !== 0 && fileIndex % 2 !== 0),
      });
    }
  }

  return squares;
};

export const getNotation = (orientation: PieceColor) => {
  return {
    files: orientation === 'white' ? fileIds : [...fileIds].reverse(),
    ranks: orientation === 'white' ? [...rankIds].reverse() : rankIds,
  };
};

export const togglePieceColor = (pieceColor: PieceColor): PieceColor => {
  return pieceColor === 'white' ? 'black' : 'white';
};

export const isSquareAttacked = (
  square: PiecePositionAlgebraic,
  attackerColor: PieceColor,
  pieceMap: Partial<Record<PiecePositionAlgebraic, Piece | undefined>>
): boolean => {
  for (const position in pieceMap) {
    const piece: Piece | undefined =
      pieceMap[position as PiecePositionAlgebraic];
    if (piece && piece.color === attackerColor) {
      const potentialAttacks = piece.getPotentialMoves(pieceMap);
      if (potentialAttacks.includes(square)) {
        return true;
      }
    }
  }
  return false;
};

export const findKingPosition = (
  pieceMap: Partial<Record<PiecePositionAlgebraic, Piece | undefined>>,
  kingColor: PieceColor
): PiecePositionAlgebraic | null => {
  for (const [position, piece] of Object.entries(pieceMap)) {
    const algebraicPos = position as PiecePositionAlgebraic;

    if (piece) {
      if (piece.type === 'king' && piece.color === kingColor) {
        return algebraicPos;
      }
    }
  }
  return null;
};

export const getPieceImage = (pieceType: PieceType, pieceColor: PieceColor) => {
  switch (pieceType) {
    case 'king':
      return pieceColor === 'white' ? <WhiteKing /> : <BlackKing />;
    case 'queen':
      return pieceColor === 'white' ? <WhiteQueen /> : <BlackQueen />;
    case 'rook':
      return pieceColor === 'white' ? <WhiteRook /> : <BlackRook />;
    case 'bishop':
      return pieceColor === 'white' ? <WhiteBishop /> : <BlackBishop />;
    case 'knight':
      return pieceColor === 'white' ? <WhiteKnight /> : <BlackKnight />;
    case 'pawn':
      return pieceColor === 'white' ? <WhitePawn /> : <BlackPawn />;
    default:
      return;
  }
};

export const calculateEvaluation = (
  capturedWhitePieces: Array<Piece>,
  capturedBlackPieces: Array<Piece>
): Evaluation => {
  const whiteMaterialLoss: number = capturedWhitePieces.reduce(
    (acc: number, piece: Piece): number => acc + piece.value,
    0
  );
  const blackMaterialLoss: number = capturedBlackPieces.reduce(
    (acc: number, piece: Piece): number => acc + piece.value,
    0
  );

  const whiteStanding: number = -whiteMaterialLoss;
  const blackStanding: number = -blackMaterialLoss;

  const materialDifference: number = whiteStanding - blackStanding;

  return {
    winning:
      materialDifference > 0
        ? 'white'
        : materialDifference < 0
          ? 'black'
          : 'equal',
    whiteMaterialDifference: materialDifference,
    blackMaterialDifference: -materialDifference,
  } satisfies Evaluation;
};

export const displayEvaluation = (evaluation: number): string => {
  return evaluation > 0 ? '+' + evaluation.toString() : evaluation.toString();
};

export const getGradientPercentage = (
  evaluation: Evaluation,
  orientation: PieceColor
): number => {
  const maxMaterialDifference: number = 30;
  const materialDifference: number = evaluation.whiteMaterialDifference;
  const percentage = (materialDifference / maxMaterialDifference) * 50 + 50;
  return orientation === 'white' ? percentage : 100 - percentage;
};
