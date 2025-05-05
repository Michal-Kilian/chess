import { PiecePositionAlgebraic } from '../types/pieces';
import { Piece } from '../pieces/Piece';
import { Rook } from '../pieces/Rook';
import { Knight } from '../pieces/Knight';
import { Bishop } from '../pieces/Bishop';
import { Queen } from '../pieces/Queen';
import { King } from '../pieces/King';
import { Pawn } from '../pieces/Pawn';
import { Evaluation, Opening } from '../types/chessboard';

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

export const initialEvaluation: Evaluation = {
  winning: 'equal',
  blackMaterialDifference: 0,
  whiteMaterialDifference: 0,
};

export const knownOpenings: Record<string, Opening> = {
  'E4 E5 NF3 NC6 BB5': {
    name: 'Ruy Lopez',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
  },
  'E4 E5 NF3 NC6 BC4': {
    name: 'Italian Game',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
  },
  'E4 E5 NF3 NF6': {
    name: "Petrov's Defense",
    moves: ['e4', 'e5', 'Nf3', 'Nf6'],
  },
  'D4 D5': { name: "Queen's Pawn Game", moves: ['d4', 'd5'] },
  'D4 NF6 C4': { name: "Queen's Pawn Opening", moves: ['d4', 'Nf6', 'c4'] },
  'D4 NF6 C4 G6 NC3 BG7': {
    name: "King's Indian Defense",
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'],
  },
  'D4 D5 C4 C6': { name: 'Slav Defense', moves: ['d4', 'd5', 'c4', 'c6'] },
  'D4 D5 C4 E6': { name: "Queen's Gambit", moves: ['d4', 'd5', 'c4', 'e6'] },
  'E4 C5': { name: 'Sicilian Defense', moves: ['e4', 'c5'] },
  'E4 C6': { name: 'Caro-Kann Defense', moves: ['e4', 'c6'] },
  'E4 E6': { name: 'French Defense', moves: ['e4', 'e6'] },
  'E4 NF6': { name: "Alekhine's Defense", moves: ['e4', 'Nf6'] },
  'D4 NF6 C4 C5 D5 B5': {
    name: 'Benko Gambit',
    moves: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'b5'],
  },
  'D4 NF6 C4 C5': { name: 'Benoni Defense', moves: ['d4', 'Nf6', 'c4', 'c5'] },
  F4: { name: "Bird's Opening", moves: ['f4'] },
  'D4 NF6 C4 E6 NF3 BB4': {
    name: 'Bogo-Indian Defense',
    moves: ['d4', 'Nf6', 'c4', 'e6', 'Nf3', 'Bb4'],
  },
  'D4 NF6 C4 E5': { name: 'Budapest Gambit', moves: ['d4', 'Nf6', 'c4', 'e5'] },
  'D4 NF6 C4 G6 NC3 D5': {
    name: 'Grünfeld Defense',
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5'],
  },
  'D4 NF6 NF3 E6': { name: 'Colle System', moves: ['d4', 'Nf6', 'Nf3', 'e6'] },
  'D4 F5': { name: 'Dutch Defense', moves: ['d4', 'f5'] },
  C4: { name: 'English Opening', moves: ['c4'] },
  'E4 E5 NF3 NC6 BC4 BC5 B4': {
    name: 'Evans Gambit',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4'],
  },
  'E4 E5 NF3 NC6 NF3': {
    name: 'Four Knights Game',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Nf3'],
  },
  'E4 E5': { name: "King's Pawn Game", moves: ['e4', 'e5'] },
  'D4 NF6 B5': { name: 'Torre Attack', moves: ['d4', 'Nf6', 'B5'] },
  'D4 NF6 C4 E6': {
    name: "Queen's Indian Defense",
    moves: ['d4', 'Nf6', 'c4', 'e6'],
  },
  'NF3 D5 C4': { name: 'Réti Opening', moves: ['Nf3', 'd5', 'c4'] },
  D5: { name: 'Scandinavian Defense', moves: ['d5'] },
  'E4 E5 NF3 NC6 D4': {
    name: 'Scotch Game',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4'],
  },
  'D4 D5 C4': { name: "Queen's Gambit", moves: ['d4', 'd5', 'c4'] },
  'D4 D5 C4 DXC4': {
    name: "Queen's Gambit Accepted",
    moves: ['d4', 'd5', 'c4', 'dxc4'],
  },
  'E4 E5 NC3': { name: 'Vienna Game', moves: ['e4', 'e5', 'Nc3'] },
  'D4 D6': { name: 'Wade Defense', moves: ['d4', 'd6'] },
  'D4 NF6 C4 E6 NF3 BB4+': {
    name: 'Nimzo-Indian Defense',
    moves: ['d4', 'Nf6', 'c4', 'e6', 'Nf3', 'Bb4+'],
  },
  'E4 NB6': { name: 'Nimzowitsch Defense', moves: ['e4', 'Nb6'] },
  'E4 E5 D3': { name: "Philidor's Defense", moves: ['e4', 'e5', 'd3'] },
  'E4 D6 D4 NF6': { name: 'Pirc Defense', moves: ['e4', 'd6', 'd4', 'Nf6'] },
  D4: { name: "Queen's Pawn Game", moves: ['d4'] },
  'C4 E5': { name: 'Reversed Sicilian', moves: ['c4', 'e5'] },
  'E4 G6': { name: 'Modern Defense', moves: ['e4', 'g6'] },
  'D4 NF6 C4 G6': {
    name: "King's Indian Attack",
    moves: ['d4', 'Nf6', 'c4', 'g6'],
  },
  'E4 E5 F4': { name: "King's Gambit", moves: ['e4', 'e5', 'f4'] },
  'D4 NF6 C4 E6 G3': {
    name: 'Catalan Opening',
    moves: ['d4', 'Nf6', 'c4', 'e6', 'g3'],
  },
  'D4 NF6 C4 G6 NC3 BG7 E4 D6': {
    name: "King's Indian Defense",
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6'],
  },
};