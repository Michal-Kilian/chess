import { A } from "@solidjs/router";
import { Accessor, Component } from "solid-js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ColorDrawerProps {
    drawerOpen: Accessor<boolean>;
}

export const ColorDrawer: Component<ColorDrawerProps> = (props: ColorDrawerProps) => {
    return (
        <div
            class="absolute top-full left-0 w-full bg-transparent rounded-b-md transition-all duration-300 p-3"
            classList={{
                "opacity-100 visible": props.drawerOpen(),
                "opacity-0 invisible": !props.drawerOpen(),
            }}
        >
            <div class="flex flex-row items-center justify-center gap-x-5">
                <A href="/player-vs-bot?color=white">
                    <Tooltip>
                        <TooltipTrigger>
                            <div class="w-8 h-8 bg-white rounded-full hover:scale-120 cursor-pointer transition-all duration-300" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Play as white
                        </TooltipContent>
                    </Tooltip>
                </A>
                <A href="/player-vs-bot?color=random">
                    <Tooltip>
                        <TooltipTrigger>
                            <div class="flex items-center justify-center w-8 h-8 bg-gray-500 rounded-full hover:scale-120 cursor-pointer transition-all duration-300" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Play as random
                        </TooltipContent>
                    </Tooltip>
                </A>
                <A href="/player-vs-bot?color=black">
                    <Tooltip>
                        <TooltipTrigger>
                            <div class="w-8 h-8 bg-black rounded-full hover:scale-120 cursor-pointer transition-all duration-300" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Play as black
                        </TooltipContent>
                    </Tooltip>
                </A>
            </div>
        </div>
    );
};