import { PieceColor, PiecePositionAlgebraic } from '../types/pieces';
import { Piece } from '../pieces/Piece';
import { King } from '../pieces/King';
import { Pawn } from '../pieces/Pawn';
import { Rook } from '../pieces/Rook';
import { Knight } from '../pieces/Knight';
import { Bishop } from '../pieces/Bishop';
import { Queen } from '../pieces/Queen';

export const initialPieceMap: Partial<
  Record<PiecePositionAlgebraic, Piece | undefined>
> = {
  A1: new Rook('white', 'A1'),
  B1: new Knight('white', 'B1'),
  C1: new Bishop('white', 'C1'),
  D1: new Queen('white', 'D1'),
  E1: new King('white', 'E1'),
  F1: new Bishop('white', 'F1'),
  G1: new Knight('white', 'G1'),
  H1: new Rook('white', 'H1'),
  A2: new Pawn('white', 'A2'),
  B2: new Pawn('white', 'B2'),
  C2: new Pawn('white', 'C2'),
  D2: new Pawn('white', 'D2'),
  E2: new Pawn('white', 'E2'),
  F2: new Pawn('white', 'F2'),
  G2: new Pawn('white', 'G2'),
  H2: new Pawn('white', 'H2'),

  H8: new Rook('black', 'H8'),
  G8: new Knight('black', 'G8'),
  F8: new Bishop('black', 'F8'),
  E8: new King('black', 'E8'),
  D8: new Queen('black', 'D8'),
  C8: new Bishop('black', 'C8'),
  B8: new Knight('black', 'B8'),
  A8: new Rook('black', 'A8'),
  H7: new Pawn('black', 'H7'),
  G7: new Pawn('black', 'G7'),
  F7: new Pawn('black', 'F7'),
  E7: new Pawn('black', 'E7'),
  D7: new Pawn('black', 'D7'),
  C7: new Pawn('black', 'C7'),
  B7: new Pawn('black', 'B7'),
  A7: new Pawn('black', 'A7'),
};
