import { Accessor, Component, createMemo, For, JSX, Show } from 'solid-js';
import { Piece } from '../lib/pieces/Piece';
import { Dynamic } from 'solid-js/web';
import { BlackBishop } from '@/lib/icons/black-bishop';
import { PieceType } from '@/lib/types/pieces';

interface CapturedPiecesDisplayProps {
  capturedPieces: Accessor<Array<Piece>>;
}

export const CapturedPiecesDisplay: Component<CapturedPiecesDisplayProps> = (
  props: CapturedPiecesDisplayProps
) => {
  const pieceOrder: Array<PieceType> = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];

  const groupedPieces = () => {
    const groups: Record<PieceType, Piece[]> = {
      pawn: [],
      knight: [],
      bishop: [],
      rook: [],
      queen: [],
      king: [],
    };

    props.capturedPieces().forEach(piece => {
      if (groups[piece.type]) {
        groups[piece.type].push(piece);
      }
    });

    return groups;
  };

  const maxStackSize = () => {
    let max = 0;
    for (const type in groupedPieces()) {
      if (groupedPieces()[type as PieceType]) {
        max = Math.max(max, groupedPieces()[type as PieceType].length);
      }
    }
    return max;
  };

  const overlapAmountPx = 6;

  const calculateStackWidth = (count: number, pieceSizePx: number, overlapPx: number): string => {
    if (count <= 1) return `${pieceSizePx}px`;
    return `${pieceSizePx + (count - 1) * overlapPx}px`;
  };

  const pieceSizePx = 20;

  return (
    <Show when={props.capturedPieces().length > 0}>
      <div class="flex flex-row flex-wrap items-end justify-start p-0.5">
        <For each={pieceOrder}>
          {(pieceType) => {
            const piecesInStack = () => groupedPieces()[pieceType];
            const stackCount = () => piecesInStack() ? piecesInStack().length : 0;

            return (
              <Show when={stackCount() > 0}>
                <div
                  class="relative inline-block mr-1 last:mr-0"
                  style={{
                    width: calculateStackWidth(stackCount(), pieceSizePx, overlapAmountPx),
                    height: `${pieceSizePx}px`,
                  }}
                >
                  <For each={piecesInStack()}>
                    {(piece, index) => (
                      <Dynamic
                        component={piece.image as Component<JSX.SvgSVGAttributes<SVGSVGElement>>}
                        class="w-5 h-5 absolute bottom-0"
                        style={{
                          left: `${index() * overlapAmountPx}px`,
                          'z-index': index(),
                        }}
                      />
                    )}
                  </For>
                </div>
              </Show>
            );
          }}
        </For>
      </div>
    </Show>
  );
};