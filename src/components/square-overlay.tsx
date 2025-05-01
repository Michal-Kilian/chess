import { Piece } from '../components/pieces/Piece';
import { PiecePositionAlgebraic } from '../components/types/pieces';
import { Component, Match, Switch } from 'solid-js';

interface SquareOverlayProps {
  selectedPiece: Piece | undefined;
  pieceMap: Partial<Record<PiecePositionAlgebraic, Piece | undefined>>;
  piecePositionAlgebraic: PiecePositionAlgebraic;
  ownKingPosition: PiecePositionAlgebraic | null;
  enPassantTarget: PiecePositionAlgebraic | null;
}

export const SquareOverlay: Component<SquareOverlayProps> = (
  props: SquareOverlayProps
) => {
  const isEmptyPotentialSquare = (): boolean =>
    !!props.selectedPiece &&
    props.selectedPiece
      ?.getValidMoves(
        props.pieceMap,
        props.ownKingPosition!,
        props.enPassantTarget
      )
      .includes(props.piecePositionAlgebraic) &&
    !props.pieceMap[props.piecePositionAlgebraic];
  const isOpponentPiecePotentialSquare = (): boolean =>
    (!!props.selectedPiece &&
      props
        .selectedPiece!.getValidMoves(
          props.pieceMap,
          props.ownKingPosition!,
          props.enPassantTarget
        )
        .includes(props.piecePositionAlgebraic) &&
      props.pieceMap[props.piecePositionAlgebraic] &&
      props.pieceMap[props.piecePositionAlgebraic]?.color !==
        props.selectedPiece?.color) ??
    false;

  return (
    <Switch fallback={<></>}>
      <Match when={isEmptyPotentialSquare()}>
        <div class="z-10 absolute w-6 h-6 top-4 right-4 border-2 border-gray-300 bg-gray-300 rounded-full" />
      </Match>
      <Match when={isOpponentPiecePotentialSquare()}>
        <div class="z-1 absolute w-12 h-12 top-1 right-1 border-2 border-gray-300 rounded-full" />
      </Match>
    </Switch>
  );
};
