import { GameVariant } from "@/lib/types/game";
import { cn } from "@/lib/utils/solid-ui-utils";
import { Bot, UserRound } from "lucide-solid";
import { Component, Show } from "solid-js";

interface GameVariantDisplayProps {
    gameVariant: GameVariant;
    className?: string;
}

export const GameVariantDisplay: Component<GameVariantDisplayProps> = (props: GameVariantDisplayProps) => {
    return (
        <div class="pt-6 flex flex-row items-center justify-center gap-x-3">
            <Show when={props.gameVariant === "player-vs-bot"} fallback={
                <UserRound class={cn("w-14 h-14", props.className)} />
            }>
                <Bot class={cn("w-14 h-14", props.className)} />
            </Show>
            <div>vs</div>
            <UserRound class={cn("w-14 h-14", props.className)} />
        </div>
    );
};