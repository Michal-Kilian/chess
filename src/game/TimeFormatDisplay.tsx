import { TimeFormatIcon } from "@/lib/icons/TimeFormatIcon";
import { TimeFormat } from "@/lib/types/game";
import { cn } from "@/lib/utils/solid-ui-utils";
import { getFormattedTime } from "@/lib/utils/utils";
import { Component, Match, Show, Switch } from "solid-js";

interface TimeFormatDisplayProps {
    timeFormat: TimeFormat;
    className?: string;
    titleClassName?: string;
    secondsClassName?: string;
}

export const TimeFormatDisplay: Component<TimeFormatDisplayProps> = (props: TimeFormatDisplayProps) => {
    return (
        <div class={cn("px-3 py-2 flex flex-row items-center justify-center w-fit rounded-md", props.className)}>
            <Switch>
                <Match when={props.timeFormat.type === "bullet"}>
                    <TimeFormatIcon timeFormatType="bullet" />
                </Match>
                <Match when={props.timeFormat.type === "blitz"}>
                    <TimeFormatIcon timeFormatType="blitz" />
                </Match>
                <Match when={props.timeFormat.type === "rapid"}>
                    <TimeFormatIcon timeFormatType="rapid" />
                </Match>
                <Match when={props.timeFormat.type === "standard"}>
                    <TimeFormatIcon timeFormatType="standard" />
                </Match>
            </Switch>
            <span class={cn("text-slate-200 font-medium mx-3", props.titleClassName)}>
                {props.timeFormat.title}
            </span>
            <div class={cn("text-slate-400 text-sm text-right", props.secondsClassName)}>
                {getFormattedTime(props.timeFormat.seconds)}
                <Show when={props.timeFormat.increment > 0}>
                    {"+" + props.timeFormat.increment.toString()}
                </Show>
            </div>
        </div>
    );
};