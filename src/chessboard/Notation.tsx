import { Component, For, Match, Switch } from 'solid-js';
import {
  ChessboardNotation,
  FileId,
  RankId,
} from '../components/types/chessboard';

interface NotationProps {
  notation?: ChessboardNotation;
  side: 'horizontal' | 'vertical';
}

export const Notation: Component<NotationProps> = (props: NotationProps) => {
  return (
    <Switch>
      <Match when={props.side === 'vertical'}>
        <div class="absolute top-0 left-[-20px] w-fit h-full flex flex-col items-center justify-center">
          <For each={props.notation?.ranks}>
            {(rank: RankId) => (
              <div class="w-full h-full flex items-center justify-center text-center text-xs text-gray-300">
                {rank}
              </div>
            )}
          </For>
        </div>
      </Match>

      <Match when={props.side === 'horizontal'}>
        <div class="absolute bottom-[-25px] left-0 h-fit w-full flex flex-row items-center justify-center">
          <For each={props.notation?.files}>
            {(file: FileId) => (
              <div class="h-full w-full flex pt-2 items-top justify-center text-center text-xs text-gray-300">
                {file}
              </div>
            )}
          </For>
        </div>
      </Match>
    </Switch>
  );
};
