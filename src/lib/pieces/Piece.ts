import {
  PieceColor,
  PieceNotation,
  PiecePositionAlgebraic,
  PieceType,
  PieceValue,
} from '../types/pieces';
import { Component } from 'solid-js';
import { Coordinates, FileId, RankId } from '../types/chessboard';
import { v4 as uuidv4 } from 'uuid';

export const fileIds: Array<FileId> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export const rankIds: Array<RankId> = [1, 2, 3, 4, 5, 6, 7, 8];

export const positionToCoordinates = (
  pos: PiecePositionAlgebraic
): Coordinates | null => {
  if (!pos || pos.length !== 2) return null;
  const file = pos[0] as FileId;
  const rank = parseInt(pos[1], 10) as RankId;
  const fileIndex: number = fileIds.indexOf(file);
  const rankIndex: number = rankIds.indexOf(rank);

  if (fileIndex === -1 || rankIndex === -1) return null;

  return { fileIndex, rankIndex };
};

export const coordinatesToPosition = (
  coords: Coordinates
): PiecePositionAlgebraic | null => {
  if (
    coords.fileIndex < 0 ||
    coords.fileIndex > 7 ||
    coords.rankIndex < 0 ||
    coords.rankIndex > 7
  ) {
    return null;
  }
  const file = fileIds[coords.fileIndex];
  const rank = rankIds[coords.rankIndex];
  return `${file}${rank}` as PiecePositionAlgebraic;
};

export const isOnBoard = (coords: Coordinates): boolean => {
  return (
    coords.fileIndex >= 0 &&
    coords.fileIndex <= 7 &&
    coords.rankIndex >= 0 &&
    coords.rankIndex <= 7
  );
};

export abstract class Piece {
  id: string;
  color: PieceColor;
  position: PiecePositionAlgebraic;
  type: PieceType;
  notation: PieceNotation;
  image: Component;
  symbol: string;
  value: PieceValue;
  hasMoved: boolean;
  captured: boolean;

  protected constructor(
    color: PieceColor,
    position: PiecePositionAlgebraic,
    type: PieceType,
    notation: PieceNotation,
    image: Component,
    symbol: string,
    value: PieceValue,
    hasMoved: boolean,
    captured: boolean
  ) {
    this.id = uuidv4();
    this.color = color;
    this.position = position;
    this.type = type;
    this.notation = notation;
    this.image = image;
    this.symbol = symbol;
    this.value = value;
    this.hasMoved = hasMoved;
    this.captured = false;
  }

  abstract clone(): this;

  abstract getPotentialMoves(
    pieceMap: Partial<Record<PiecePositionAlgebraic, Piece | undefined>>,
  ): Array<PiecePositionAlgebraic>;

  abstract getValidMoves(
    pieceMap: Partial<Record<PiecePositionAlgebraic, Piece | undefined>>,
    ownKingPosition: PiecePositionAlgebraic,
    enPassantTarget?: PiecePositionAlgebraic | null,
  ): Array<PiecePositionAlgebraic>
}
