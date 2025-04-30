import { PieceColor, PiecePositionAlgebraic } from '../types/pieces';
import { FileId, RankId, Square } from '../types/chessboard';
import { Piece } from '../pieces/Piece';
import { Accessor, Component } from 'solid-js';

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
  return pieceColor === "white" ? "black" : "white";
};

export const isSquareAttacked = (
  square: PiecePositionAlgebraic,
  attackerColor: PieceColor,
  pieceMap: Partial<Record<PiecePositionAlgebraic, Piece | undefined>>
): boolean => {
  for (const position in pieceMap) {
    const piece: Piece | undefined = pieceMap[position as PiecePositionAlgebraic];
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
  kingColor: PieceColor,
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
