import { PieceColor, PiecePositionAlgebraic, PieceType } from './pieces';
import { Piece } from '../pieces/Piece';

export type RankId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type FileId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

export type Square = {
  file: FileId;
  rank: RankId;
  even: boolean;
};

export type ChessboardNotation = {
  files: Array<FileId>;
  ranks: Array<RankId>;
};

export type Move = {
  piece: Piece;
  from: PiecePositionAlgebraic;
  to: PiecePositionAlgebraic;
  capturedPiece: Piece | undefined;
  promotion?: PieceType;
  isCastling: boolean;
  isEnPassant: boolean;
  isPremove?: boolean;
  isCheck?: boolean;
};

export type Opening = {
  name: string;
  moves: Array<string>;
};

export interface Coordinates {
  fileIndex: number;
  rankIndex: number;
}

export type Evaluation = {
  winning: PieceColor | 'equal';
  whiteMaterialDifference: number;
  blackMaterialDifference: number;
};