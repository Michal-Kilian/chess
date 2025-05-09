import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AudioPlayer } from "@/lib/audio-player/AudioPlayer";
import { useColorMode } from "@kobalte/core";
import { A } from "@solidjs/router";
import { ArrowDownUp, ChevronLeft, ChevronRight, House, Moon, RotateCcw, Sun, Volume2, VolumeX } from "lucide-solid";
import { Component, Show } from "solid-js";

interface GameControlsProps {
    handleToggleOrientation: () => void;
    handleResetBoard: () => void;
    handleShowPreviousMove: () => void;
    handleShowNextMove: () => void;
}

export const GameControls: Component<GameControlsProps> = (props: GameControlsProps) => {
    const { colorMode, setColorMode } = useColorMode();

    const toggleColorMode = () => {
        if (colorMode() === "light") {
            setColorMode("dark");
        } else {
            setColorMode("light");
        }
    };

    return (
        <div class="w-full h-1/2 flex flex-col items-center justify-between bg-slate-800 rounded-md shadow-md">
            <div class="w-fit w-full flex flex-row items-center justify-center gap-x-3 p-3">
                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="default"
                            size="icon"
                            onClick={props.handleShowPreviousMove}
                            class="cursor-pointer"
                        >
                            <ChevronLeft class="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Previous move
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="default"
                            size="icon"
                            onClick={props.handleShowNextMove}
                            class="cursor-pointer"
                        >
                            <ChevronRight class="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Next move
                    </TooltipContent>
                </Tooltip>
            </div>

            <div class="flex flex-row w-full items-center justify-between p-3 gap-x-3">
                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="default"
                            size="icon"
                            onClick={props.handleToggleOrientation}
                            class="cursor-pointer"
                        >
                            <ArrowDownUp class="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Toggle orientation
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="default"
                            size="icon"
                            onClick={() => AudioPlayer.toggleMute()}
                            class="cursor-pointer"
                        >
                            <Show when={AudioPlayer.isMutedSignal()} fallback={
                                <Volume2 class="w-4 h-4" />
                            }>
                                <VolumeX class="w-4 h-4" />
                            </Show>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <Show when={AudioPlayer.isMutedSignal()} fallback="Unmuted">
                            Muted
                        </Show>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger>
                        <A href="/">
                            <Button
                                variant="default"
                                size="icon"
                                class="cursor-pointer"
                            >
                                <House class="w-4 h-4" />
                            </Button>
                        </A>
                    </TooltipTrigger>
                    <TooltipContent>
                        Home
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="default"
                            size="icon"
                            class="cursor-pointer"
                            onClick={toggleColorMode}
                        >
                            <Show when={colorMode() === "light"} fallback={
                                <Moon class="w-4 h-4" />
                            }>
                                <Sun class="w-4 h-4" />
                            </Show>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <Show when={colorMode() === "light"} fallback="Dark mode">
                            Light mode
                        </Show>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="default"
                            size="icon"
                            onClick={props.handleResetBoard}
                            class="cursor-pointer"
                        >
                            <RotateCcw class="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Reset board
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
};