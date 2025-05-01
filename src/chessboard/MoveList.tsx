import {
  Accessor,
  Component,
  createEffect,
  createSignal,
  For,
  Match,
  Switch,
} from 'solid-js';
import { detectChessOpening, getMoveNotation } from '../components/utils/utils';
import { Move } from '../components/types/chessboard';

interface MoveListProps {
  moves: Accessor<Array<Move>>;
}

export const MoveList: Component<MoveListProps> = (props: MoveListProps) => {
  const [moveListRef, setMoveListRef] = createSignal<HTMLDivElement>();

  createEffect(() => {
    if (props.moves()) {
      if (moveListRef()) {
        let newMoveListRef: HTMLDivElement | undefined = moveListRef();
        newMoveListRef!.scrollTo({
          top: moveListRef()!.scrollHeight,
          behavior: 'smooth',
        });
        setMoveListRef(newMoveListRef);
      }
    }
  });

  return (
    <div
      ref={setMoveListRef}
      class="px-3 py-2 w-full h-1/2 bg-slate-800 rounded-md flex flex-col items-start justify-start overflow-y-auto"
    >
      <Switch>
        <Match when={props.moves().length === 0}>
          <span class="min-h-8 h-8 px-2 py-1 w-full flex items-center justify-start border-b border-slate-700 text-slate-200">
            Initial position
          </span>
        </Match>
        <Match when={!detectChessOpening(props.moves())}>
          <span class="min-h-8 h-8 px-2 py-1 w-full flex items-center justify-start border-b border-slate-700 text-slate-200" />
        </Match>
        <Match when={detectChessOpening(props.moves())}>
          <span class="min-h-8 h-8 px-2 py-1 w-full flex items-center justify-start border-b border-slate-700 text-slate-200">
            {detectChessOpening(props.moves())}
          </span>
        </Match>
      </Switch>

      <For
        each={Array.from(
          { length: Math.ceil(props.moves().length / 2) },
          (_: unknown, i: number): number => i
        )}
      >
        {(index: number) => (
          <div class="flex flex-row items-center justify-between text-sm w-full h-fit px-2 py-1 border-b border-slate-700">
            <span class="text-slate-500 w-4">{index + 1}.</span>

            <span
              class="w-10 px-1 py-0.5 rounded-md flex items-center justify-center text-slate-200"
              classList={{
                'bg-slate-700': index * 2 === props.moves().length - 1,
              }}
            >
              {getMoveNotation(props.moves()[index * 2])}
            </span>
            <Switch>
              <Match when={props.moves()[index * 2 + 1]}>
                <span
                  class="w-10 px-1 py-0.5 rounded-md flex items-center justify-center text-slate-200"
                  classList={{
                    'bg-slate-700': index * 2 + 1 === props.moves().length - 1,
                  }}
                >
                  {getMoveNotation(props.moves()[index * 2 + 1])}
                </span>
              </Match>
              <Match when={!props.moves()[index * 2 + 1]}>
                <span class="w-10 px-1 py-0.5 rounded-md flex items-center justify-center text-slate-200" />
              </Match>
            </Switch>
          </div>
        )}
      </For>
    </div>
  );
};
