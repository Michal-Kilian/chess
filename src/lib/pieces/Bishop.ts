import {
  BishopDirection,
  PieceColor,
  PiecePositionAlgebraic,
} from '../types/pieces';
import { WhiteBishop } from '../icons/white-bishop';
import { BlackBishop } from '../icons/black-bishop';
import {
  coordinatesToPosition,
  isOnBoard,
  Piece,
  positionToCoordinates,
} from './Piece';
import { Coordinates } from '../types/chessboard';
import { togglePieceColor } from '../utils/utils';

export class Bishop extends Piece {
  constructor(color: PieceColor, position: PiecePositionAlgebraic) {
    super(
      color,
      position,
      'bishop',
      'B',
      color === 'white' ? WhiteBishop : BlackBishop,
      color === 'white' ? '♗' : '♝',
      3,
      false,
      false
    );
  }

  getPotentialMoves(
    pieceMap: Partial<Record<PiecePositionAlgebraic, Piece | undefined>>
  ): Array<PiecePositionAlgebraic> {
    const moves: Array<PiecePositionAlgebraic> = [];
    const currentCoordinates: Coordinates | null = positionToCoordinates(
      this.position
    );
    if (!currentCoordinates) return [];

    const directions: Array<BishopDirection> = [
      { file: 1, rank: 1 },
      { file: 1, rank: -1 },
      { file: -1, rank: 1 },
      { file: -1, rank: -1 },
    ];

    for (const dir of directions) {
      let nextCoordinates: Coordinates = { ...currentCoordinates };
      while (true) {
        nextCoordinates.fileIndex += dir.file;
        nextCoordinates.rankIndex += dir.rank;

        if (!isOnBoard(nextCoordinates)) break;

        const nextPosition: PiecePositionAlgebraic | null =
          coordinatesToPosition(nextCoordinates);
        if (!nextPosition) break;

        const targetPiece: Piece | undefined = pieceMap[nextPosition];

        if (targetPiece) {
          if (targetPiece.color !== this.color) {
            moves.push(nextPosition);
          }
          break;
        } else {
          moves.push(nextPosition);
        }
      }
    }
    return moves;
  }

  getValidMoves(
    pieceMap: Partial<Record<PiecePositionAlgebraic, Piece | undefined>>,
    ownKingPosition: PiecePositionAlgebraic | null
  ): Array<PiecePositionAlgebraic> {
    if (!ownKingPosition) {
      console.error('Cannot get valid moves without own king position.');
      return [];
    }

    const potentialMoves: Array<PiecePositionAlgebraic> =
      this.getPotentialMoves(pieceMap);
    const validMoves: Array<PiecePositionAlgebraic> = [];
    const opponentColor: PieceColor = togglePieceColor(this.color);

    for (const moveToTry of potentialMoves) {
      const tempPieceMap = { ...pieceMap };

      delete tempPieceMap[this.position];
      tempPieceMap[moveToTry] = this;

      let kingIsAttacked: boolean = false;
      for (const position in tempPieceMap) {
        const attackerPiece: Piece | undefined =
          tempPieceMap[position as PiecePositionAlgebraic];

        if (attackerPiece && attackerPiece.color === opponentColor) {
          const attacks: Array<PiecePositionAlgebraic> =
            attackerPiece.getPotentialMoves(tempPieceMap);

          if (attacks.includes(ownKingPosition)) {
            kingIsAttacked = true;
            break;
          }
        }
      }
      if (!kingIsAttacked) {
        validMoves.push(moveToTry);
      }
    }
    return validMoves;
  }

  clone(): this {
    const clonedPiece = new Bishop(this.color, this.position);
    clonedPiece.hasMoved = this.hasMoved;
    clonedPiece.captured = this.captured;
    return clonedPiece as this;
  }
}