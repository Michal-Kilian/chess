import { Accessor, Component, Show } from 'solid-js';
import {
    displayEvaluation,
    getGradientPercentage,
} from '../lib/utils/utils';
import { Evaluation } from '../lib/types/chessboard';
import { PieceColor } from '../lib/types/pieces';

interface EvaluationBarProps {
    evaluation: Accessor<Evaluation>;
    orientation: Accessor<PieceColor>;
}

export const EvaluationBar: Component<EvaluationBarProps> = (
    props: EvaluationBarProps
) => {
    return (
        <div
            class="relative w-8 h-full rounded-full border-2 border-slate-800 overflow-hidden transition-all duration-1000 shadow-md"
            style={{
                background: `linear-gradient(to top, 
          ${props.orientation() === 'white' ? 'white' : 'black'} 0%, 
          ${props.orientation() === 'white' ? 'white' : 'black'} ${getGradientPercentage(props.evaluation(), props.orientation())}%, 
          ${props.orientation() === 'white' ? 'black' : 'white'} ${getGradientPercentage(props.evaluation(), props.orientation())}%, 
          ${props.orientation() === 'white' ? 'black' : 'white'} 100%)`,
            }}
        >
            <Show when={props.evaluation().winning !== 'equal'}>
                <span class="absolute top-1 right-0 left-0 text-center text-slate-500 text-sm">
                    {displayEvaluation(
                        props.orientation() === 'white'
                            ? props.evaluation().blackMaterialDifference
                            : props.evaluation().whiteMaterialDifference
                    )}
                </span>
                <span class="absolute bottom-1 right-0 left-0 text-center text-slate-500 text-sm">
                    {displayEvaluation(
                        props.orientation() === 'white'
                            ? props.evaluation().whiteMaterialDifference
                            : props.evaluation().blackMaterialDifference
                    )}
                </span>
            </Show>
        </div>
    );
};