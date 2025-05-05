import { Accessor, Component, For, Show } from 'solid-js';
import { Piece } from '../lib/pieces/Piece';

interface CapturedPiecesDisplayProps {
    capturedPieces: Accessor<Array<Piece>>;
}

export const CapturedPiecesDisplay: Component<CapturedPiecesDisplayProps> = (
    props: CapturedPiecesDisplayProps
) => {
    return (
        <Show when={props.capturedPieces().length > 0}>
            <div class="flex flex-row flex-wrap items-center justify-start p-1">
                <For each={props.capturedPieces()}>
                    {(piece: Piece) => <span>{piece.symbol}</span>}
                </For>
            </div>
        </Show>
    );
};