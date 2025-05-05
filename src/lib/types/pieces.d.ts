import { FileId, RankId } from './chessboard';

export type PieceType =
  | 'king'
  | 'queen'
  | 'rook'
  | 'knight'
  | 'bishop'
  | 'pawn';

export type PieceNotation = 'K' | 'Q' | 'R' | 'N' | 'B' | 'P';

export type PieceValue = 1 | 3 | 5 | 9 | -1; // -1 for King;

export type PieceColor = 'white' | 'black';

export type PiecePositionAlgebraic = `${FileId}${RankId}`;

export type PawnDirection = 1 | -1;

export type BishopDirection = {
  file: 1 | -1;
  rank: 1 | -1;
};

export type KnightDirection = {
  file: 1 | -1 | 2 | -2;
  rank: 1 | -1 | 2 | -2;
};

export type RookDirection = {
  file: 0 | 1 | -1;
  rank: 0 | 1 | -1;
};

export type QueenDirection = {
  file: 0 | 1 | -1;
  rank: 0 | 1 | -1;
};

export type KingDirection = {
  file: 0 | 1 | -1;
  rank: 0 | 1 | -1;
};