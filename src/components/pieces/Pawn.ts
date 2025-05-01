import { PieceColor, PiecePositionAlgebraic } from '../types/pieces';
import { WhitePawn } from '../icons/white-pawn';
import { BlackPawn } from '../icons/black-pawn';
import {
  coordinatesToPosition,
  isOnBoard,
  Piece,
  positionToCoordinates,
} from './Piece';
import { Coordinates } from '../types/chessboard';

export class Pawn extends Piece {
  constructor(color: PieceColor, position: PiecePositionAlgebraic) {
    super(
      color,
      position,
      'pawn',
      'P',
      color === 'white' ? WhitePawn : BlackPawn,
      color === 'white' ? '♙' : '♟',
      1,
      false,
      false
    );
  }

  getPotentialMoves(
    pieceMap: Partial<Record<PiecePositionAlgebraic, Piece | undefined>>
  ): Array<PiecePositionAlgebraic> {
    const moves: Array<PiecePositionAlgebraic> = [];
    const currentCoords: Coordinates | null = positionToCoordinates(
      this.position
    );
    if (!currentCoords) return [];

    const direction: 1 | -1 = this.color === 'white' ? 1 : -1;
    const startRankIndex: number = this.color === 'white' ? 1 : 6;

    const oneStepCoords: Coordinates = {
      fileIndex: currentCoords.fileIndex,
      rankIndex: currentCoords.rankIndex + direction,
    };
    if (isOnBoard(oneStepCoords)) {
      const oneStepPosition: PiecePositionAlgebraic | null =
        coordinatesToPosition(oneStepCoords);
      if (oneStepPosition && !pieceMap[oneStepPosition]) {
        moves.push(oneStepPosition);

        if (currentCoords.rankIndex === startRankIndex) {
          const twoStepsCoords: Coordinates = {
            fileIndex: currentCoords.fileIndex,
            rankIndex: currentCoords.rankIndex + 2 * direction,
          };
          if (isOnBoard(twoStepsCoords)) {
            const twoStepsPosition: PiecePositionAlgebraic | null =
              coordinatesToPosition(twoStepsCoords);
            if (twoStepsPosition && !pieceMap[twoStepsPosition]) {
              moves.push(twoStepsPosition);
            }
          }
        }
      }
    }

    const captureFileOffsets: Array<number> = [-1, 1];
    for (const fileOffset of captureFileOffsets) {
      const captureCoords: Coordinates = {
        fileIndex: currentCoords.fileIndex + fileOffset,
        rankIndex: currentCoords.rankIndex + direction,
      };

      if (isOnBoard(captureCoords)) {
        const capturePosition: PiecePositionAlgebraic | null =
          coordinatesToPosition(captureCoords);
        if (capturePosition) {
          const targetPiece: Piece | undefined = pieceMap[capturePosition];
          if (targetPiece && targetPiece.color !== this.color) {
            moves.push(capturePosition);
          }
        }
      }
    }
    return moves;
  }

  getValidMoves(
    pieceMap: Partial<Record<PiecePositionAlgebraic, Piece | undefined>>,
    ownKingPosition: PiecePositionAlgebraic | null,
    enPassantTarget: PiecePositionAlgebraic | null
  ): Array<PiecePositionAlgebraic> {
    if (!ownKingPosition) {
      console.error('Cannot get valid pawn moves without own king position.');
      return [];
    }

    const potentialMoves: Array<PiecePositionAlgebraic> =
      this.getPotentialMoves(pieceMap);
    const validMoves: Array<PiecePositionAlgebraic> = [];
    const opponentColor: PieceColor =
      this.color === 'white' ? 'black' : 'white';
    const currentCoords: Coordinates | null = positionToCoordinates(
      this.position
    );
    if (!currentCoords) return [];

    const direction: 1 | -1 = this.color === 'white' ? 1 : -1;

    let potentialEnPassantMove: PiecePositionAlgebraic | null = null;
    if (enPassantTarget) {
      const targetCoords: Coordinates | null =
        positionToCoordinates(enPassantTarget);
      if (targetCoords) {
        if (
          targetCoords.rankIndex === currentCoords.rankIndex + direction &&
          Math.abs(targetCoords.fileIndex - currentCoords.fileIndex) === 1
        ) {
          potentialEnPassantMove = enPassantTarget;
          potentialMoves.push(enPassantTarget);
        }
      }
    }

    for (const moveToTry of potentialMoves) {
      const tempPieceMap = { ...pieceMap };
      let capturedPiecePosition: PiecePositionAlgebraic | null = null;
      let isEnPassantCapture: boolean = false;

      if (moveToTry === potentialEnPassantMove) {
        isEnPassantCapture = true;
        const capturedPawnRankIndex: number = currentCoords.rankIndex;
        const capturedPawnFileIndex: number =
          positionToCoordinates(moveToTry)?.fileIndex ?? -1;
        capturedPiecePosition = coordinatesToPosition({
          fileIndex: capturedPawnFileIndex,
          rankIndex: capturedPawnRankIndex,
        });
      } else {
        capturedPiecePosition = moveToTry;
      }

      delete tempPieceMap[this.position];
      if (isEnPassantCapture && capturedPiecePosition) {
        delete tempPieceMap[capturedPiecePosition];
      }
      tempPieceMap[moveToTry] = this;

      let kingIsAttacked = false;
      for (const pos in tempPieceMap) {
        const attackerPiece: Piece | undefined =
          tempPieceMap[pos as PiecePositionAlgebraic];

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
    const clonedPiece = new Pawn(this.color, this.position);
    clonedPiece.hasMoved = this.hasMoved;
    clonedPiece.captured = this.captured;
    return clonedPiece as this;
  }
}
