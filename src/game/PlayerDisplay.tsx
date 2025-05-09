import { Accessor, Component, Show } from 'solid-js';
import { displayEvaluation } from '../lib/utils/utils';
import { PieceColor } from '../lib/types/pieces';
import { Evaluation } from '../lib/types/chessboard';

interface PlayerDisplayProps {
    playerName: string;
    color: PieceColor;
    evaluation: Accessor<Evaluation>;
}

export const PlayerDisplay: Component<PlayerDisplayProps> = (
    props: PlayerDisplayProps
) => {
    return (
        <div class="flex flex-row items-center justify-between w-full">
            <div class="flex flex-row items-center gap-x-3 justify-start">
                <label class="text-foreground">{props.playerName}</label>
                <Show
                    when={props.evaluation().winning !== "equal"}
                >
                    <span class="text-muted-foreground font-medium">
                        {displayEvaluation(
                            props.color === 'white'
                                ? props.evaluation()!.whiteMaterialDifference
                                : props.evaluation()!.blackMaterialDifference
                        )}
                    </span>
                </Show>
            </div>
            <div
                class="rounded-full w-6 h-6"
                classList={{
                    'bg-white': props.color === 'white',
                    'bg-black': props.color === 'black',
                }}
            />
        </div>
    );
};