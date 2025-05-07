import { Accessor, Component, Match, Setter, Show, Switch } from 'solid-js';
// Removed unused Select imports:
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { timeFormats } from '@/lib/board/Board'; // Assuming timeFormats is imported from here
import { TimeFormat } from '@/lib/types/game';
import { TimeFormatIcon } from '@/lib/icons/TimeFormatIcon';
import { ChevronDown, ChevronUp } from 'lucide-solid';
import { Properties } from 'solid-js/web';

interface TimeFormatSelectProps {
    selectedTimeFormat: Accessor<TimeFormat>;
    setSelectedTimeFormat: Setter<TimeFormat>;
}

export const TimeFormatSelect: Component<TimeFormatSelectProps> = (
    props: TimeFormatSelectProps
) => {
    const setPreviousTimeFormat = () => {
        const currentIndex: number = timeFormats.findIndex(
            (timeFormat: TimeFormat) => timeFormat.id === props.selectedTimeFormat().id
        );
        let previousIndex: number = currentIndex - 1;
        if (previousIndex < 0) {
            previousIndex = timeFormats.length - 1;
        }
        props.setSelectedTimeFormat(timeFormats[previousIndex]);
    };

    const setNextTimeFormat = () => {
        const currentIndex: number = timeFormats.findIndex(
            (timeFormat: TimeFormat) => timeFormat.id === props.selectedTimeFormat().id
        );
        let nextIndex: number = currentIndex + 1;
        if (nextIndex >= timeFormats.length) {
            nextIndex = 0;
        }
        props.setSelectedTimeFormat(timeFormats[nextIndex]);
    };

    return (
        <div class="w-full flex flex-col items-center justify-center gap-y-2 mb-8">
            <ChevronUp
                class="w-6 h-6 hover:bg-slate-700 rounded-md cursor-pointer transition-all duration-300"
                onClick={setPreviousTimeFormat}
            />
            <div class="px-3 py-2 flex flex-row items-center justify-center w-full rounded-md outline-2 outline-2 outline-slate-700">
                <Switch>
                    <Match when={props.selectedTimeFormat().type === "bullet"}>
                        <TimeFormatIcon timeFormatType="bullet" />
                    </Match>
                    <Match when={props.selectedTimeFormat().type === "blitz"}>
                        <TimeFormatIcon timeFormatType="blitz" />
                    </Match>
                    <Match when={props.selectedTimeFormat().type === "rapid"}>
                        <TimeFormatIcon timeFormatType="rapid" />
                    </Match>
                    <Match when={props.selectedTimeFormat().type === "standard"}>
                        <TimeFormatIcon timeFormatType="standard" />
                    </Match>
                </Switch>
                <span class="text-slate-200 font-medium mx-3">
                    {props.selectedTimeFormat().title}
                </span>
                <div class="text-slate-400 text-sm text-right">
                    {(props.selectedTimeFormat().seconds / 60).toString() + ' Min'}
                    <Show when={props.selectedTimeFormat().increment > 0}>
                        {"+" + props.selectedTimeFormat().increment.toString()}
                    </Show>
                </div>
            </div>
            <ChevronDown
                class="w-6 h-6 hover:bg-slate-700 rounded-md cursor-pointer transition-all duration-300"
                onClick={setNextTimeFormat}
            />
        </div>
    );
};
