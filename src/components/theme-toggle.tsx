import { Component } from "solid-js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-solid";
import { useColorMode } from "@kobalte/core";

export const ThemeToggle: Component = () => {
    const { colorMode, setColorMode } = useColorMode();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger as={Button<"button">} variant="ghost" size="sm" class="w-9 px-0 absolute top-5 right-5">
                <Sun class="size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon class="absolute size-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span class="sr-only">Toggle theme</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setColorMode("light")}>
                    <Sun class="mr-2 size-4" />
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setColorMode("dark")}>
                    <Moon class="mr-2 size-4" />
                    <span>Dark</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};;