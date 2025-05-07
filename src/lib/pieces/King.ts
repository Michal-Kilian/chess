import {
  KingDirection,
  PieceColor,
  PiecePositionAlgebraic,
} from '../types/pieces';
import { WhiteKing } from '../icons/white-king';
import { BlackKing } from '../icons/black-king';
import {
  coordinatesToPosition,
  isOnBoard,
  Piece,
  positionToCoordinates,
} from './Piece';
import { Coordinates } from '../types/chessboard';
import { isSquareAttacked } from '../utils/utils';

export class King extends Piece {
  constructor(color: PieceColor, position: PiecePositionAlgebraic) {
    super(
      color,
      position,
      'king',
      'K',
      color === 'white' ? WhiteKing : BlackKing,
      color === 'white' ? '♔' : '♚',
      -1,
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

    const offsets: Array<KingDirection> = [
      { file: 0, rank: 1 },
      { file: 0, rank: -1 },
      { file: 1, rank: 0 },
      { file: -1, rank: 0 },
      { file: 1, rank: 1 },
      { file: 1, rank: -1 },
      { file: -1, rank: 1 },
      { file: -1, rank: -1 },
    ];

    for (const offset of offsets) {
      const targetCoords: Coordinates = {
        fileIndex: currentCoordinates.fileIndex + offset.file,
        rankIndex: currentCoordinates.rankIndex + offset.rank,
      };

      if (isOnBoard(targetCoords)) {
        const targetPosition: PiecePositionAlgebraic | null =
          coordinatesToPosition(targetCoords);
        if (targetPosition) {
          const targetPiece: Piece | undefined = pieceMap[targetPosition];
          if (!targetPiece || targetPiece.color !== this.color) {
            moves.push(targetPosition);
          }
        }
      }
    }

    if (!this.hasMoved) {
      const rank: '1' | '8' = this.color === 'white' ? '1' : '8';
      const kingSideTarget: PiecePositionAlgebraic = `G${rank}`;
      const queenSideTarget: PiecePositionAlgebraic = `C${rank}`;

      const kingSideRookPosition = `H${rank}` as PiecePositionAlgebraic;
      const kingSideRook: Piece | undefined = pieceMap[kingSideRookPosition];
      if (
        kingSideRook?.type === 'rook' &&
        kingSideRook?.color === this.color &&
        !kingSideRook.hasMoved
      ) {
        const fSquare = `F${rank}` as PiecePositionAlgebraic;
        const gSquare = `G${rank}` as PiecePositionAlgebraic;
        if (!pieceMap[fSquare] && !pieceMap[gSquare]) {
          moves.push(kingSideTarget);
        }
      }

      const queenSideRookPosition = `A${rank}` as PiecePositionAlgebraic;
      const queenSideRook: Piece | undefined = pieceMap[queenSideRookPosition];
      if (
        queenSideRook?.type === 'rook' &&
        queenSideRook?.color === this.color &&
        !queenSideRook.hasMoved
      ) {
        const bSquare = `B${rank}` as PiecePositionAlgebraic;
        const cSquare = `C${rank}` as PiecePositionAlgebraic;
        const dSquare = `D${rank}` as PiecePositionAlgebraic;
        if (!pieceMap[bSquare] && !pieceMap[cSquare] && !pieceMap[dSquare]) {
          moves.push(queenSideTarget);
        }
      }
    }

    return moves;
  };

  getValidMoves(
    pieceMap: Partial<Record<PiecePositionAlgebraic, Piece | undefined>>
  ): Array<PiecePositionAlgebraic> {
    const potentialMoves: Array<PiecePositionAlgebraic> =
      this.getPotentialMoves(pieceMap);
    const validMoves: Array<PiecePositionAlgebraic> = [];
    const opponentColor: PieceColor =
      this.color === 'white' ? 'black' : 'white';
    const rank: '1' | '8' = this.color === 'white' ? '1' : '8';
    const kingSideCastleTarget: PiecePositionAlgebraic = `G${rank}`;
    const queenSideCastleTarget: PiecePositionAlgebraic = `C${rank}`;

    for (const moveToTry of potentialMoves) {
      if (
        moveToTry !== kingSideCastleTarget &&
        moveToTry !== queenSideCastleTarget
      ) {
        const targetIsAttacked: boolean = isSquareAttacked(
          moveToTry,
          opponentColor,
          pieceMap
        );

        if (!targetIsAttacked) {
          validMoves.push(moveToTry);
        }
      }
    }

    const canPotentiallyCastleKingSide: boolean =
      potentialMoves.includes(kingSideCastleTarget);
    const canPotentiallyCastleQueenSide: boolean = potentialMoves.includes(
      queenSideCastleTarget
    );

    if (canPotentiallyCastleKingSide || canPotentiallyCastleQueenSide) {
      const kingIsCurrentlyInCheck: boolean = isSquareAttacked(
        this.position,
        opponentColor,
        pieceMap
      );

      if (!kingIsCurrentlyInCheck) {
        if (canPotentiallyCastleKingSide) {
          const fSquare = `F${rank}` as PiecePositionAlgebraic;
          const gSquare = `G${rank}` as PiecePositionAlgebraic;

          const fSquareAttacked: boolean = isSquareAttacked(
            fSquare,
            opponentColor,
            pieceMap
          );
          const gSquareAttacked: boolean = isSquareAttacked(
            gSquare,
            opponentColor,
            pieceMap
          );
          if (!fSquareAttacked && !gSquareAttacked) {
            validMoves.push(kingSideCastleTarget);
          }
        }

        if (canPotentiallyCastleQueenSide) {
          const cSquare = `C${rank}` as PiecePositionAlgebraic;
          const dSquare = `D${rank}` as PiecePositionAlgebraic;

          const cSquareAttacked = isSquareAttacked(
            cSquare,
            opponentColor,
            pieceMap
          );
          const dSquareAttacked = isSquareAttacked(
            dSquare,
            opponentColor,
            pieceMap
          );
          if (!cSquareAttacked && !dSquareAttacked) {
            validMoves.push(queenSideCastleTarget);
          }
        }
      }
    }
    return validMoves;
  }

  clone(): this {
    const clonedPiece = new King(this.color, this.position);
    clonedPiece.hasMoved = this.hasMoved;
    clonedPiece.captured = this.captured;
    return clonedPiece as this;
  };
};