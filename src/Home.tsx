import { Component, createSignal, Show } from "solid-js";
import { Card, CardContent } from "./components/ui/card";
import { ArrowLeft, Bot, Play, UserRound } from "lucide-solid";
import { GameVariant, TimeFormat } from "./lib/types/game";
import { Button } from "./components/ui/button";
import { A } from "@solidjs/router";
import { PieceColor } from "./lib/types/pieces";
import { defaultTimeFormat } from "./lib/configuration/Configuration";
import { TimeFormatSelect } from "./components/time-format-select";

const Home: Component = () => {
  const [selectedGameMode, setSelectedGameMode] = createSignal<GameVariant | undefined>(undefined);
  const [selectedTimeFormat, setSelectedTimeFormat] = createSignal<TimeFormat>(defaultTimeFormat);
  const [selectedPieceColor, setSelectedPieceColor] = createSignal<PieceColor | "random">("random");

  const constructGameLink = () => {
    const params = new URLSearchParams({
      color: selectedPieceColor(),
      time: selectedTimeFormat().seconds.toString(),
      increment: selectedTimeFormat().increment.toString(),
    });
    return "/" + selectedGameMode() + "?" + params.toString();
  };

  return (
    <div class="flex flex-1 flex-col w-full h-screen items-center justify-center bg-background text-slate-200 overflow-hidden bg-slate-900">
      <div
        class="transition-all duration-300 flex items-center justify-center flex-col"
        classList={{
          "opacity-0 invisible": selectedGameMode() !== undefined,
          "opacity-100 visible": selectedGameMode() === undefined,
        }}
      >
        <div class="max-w-48 max-h-48 mb-10 shadow-xl rounded-full">
          <img src="/src/assets/images/Logo.png" alt="Logo" />
        </div>
        <div class="flex flex-row items-center justify-center w-full max-w-lg gap-x-10">
          <Card
            class="w-1/2 h-full hover:scale-105 transition-all duration-300 bg-slate-800 border-none shadow-xl text-slate-200 cursor-pointer"
            onClick={() => setSelectedGameMode('player-vs-bot')}
          >
            <CardContent class="pt-6 flex flex-row items-center justify-center gap-x-3">
              <Bot class="w-14 h-14" />
              <div class="">vs</div>
              <UserRound class="w-14 h-14" />
            </CardContent>
          </Card>
          <Card
            class="w-1/2 h-full hover:scale-105 transition-all duration-300 bg-slate-800 border-none shadow-xl text-slate-200 cursor-pointer"
            onClick={() => setSelectedGameMode('player-vs-player')}
          >
            <CardContent class="pt-6 flex flex-row items-center justify-center gap-x-3">
              <UserRound class="w-14 h-14" />
              <div class="">vs</div>
              <UserRound class="w-14 h-14" />
            </CardContent>
          </Card>
        </div>
      </div>
      <Show when={selectedGameMode() !== undefined}>
        <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-fit bg-slate-800 rounded-md shadow-xl transition-all duration-300">
          <Show when={selectedGameMode() === "player-vs-bot"}>
            <div class="relative w-full h-full pt-3.5 p-3 flex flex-col items-center justify-between gap-y-3">
              <Button
                variant="ghost"
                size="icon"
                class="absolute top-2 left-2 hover:bg-slate-700 hover:color-slate-200 text-slate-200 cursor-pointer"
                onClick={() => setSelectedGameMode(undefined)}
              >
                <ArrowLeft class="w-6 h-6 text-slate-200" />
              </Button>
              <div class="flex flex-row items-center justify-center gap-x-2 mb-10">
                <Bot class="w-8 h-8" />
                <div class="text-sm">vs</div>
                <UserRound class="w-8 h-8" />
              </div>

              <TimeFormatSelect
                selectedTimeFormat={selectedTimeFormat}
                setSelectedTimeFormat={setSelectedTimeFormat}
              />

              <div class="flex flex-col items-center justify-center gap-y-5 w-full mb-12">
                <span class="text-slate-400 font-medium text-sm w-full text-center">Play as</span>
                <div class="flex flex-row items-center justify-center gap-x-5">
                  <div class="flex flex-col items-center justify-center gap-y-3">
                    <div
                      class="flex items-center justify-center w-12 h-12 bg-white rounded-full hover:scale-120 cursor-pointer transition-transform duration-300"
                      classList={{
                        "outline-2 outline-slate-300 scale-120": selectedPieceColor() === "white"
                      }}
                      onClick={() => setSelectedPieceColor("white")}
                    />
                    <label class="text-xs text-slate-400 font-medium">White</label>
                  </div>
                  <div class="flex flex-col items-center justify-center gap-y-3">
                    <div
                      class="flex items-center justify-center w-12 h-12 bg-gray-500 rounded-full hover:scale-120 cursor-pointer transition-transform duration-300"
                      classList={{
                        "outline-2 outline-slate-300 scale-120": selectedPieceColor() === "random"
                      }}
                      onClick={() => setSelectedPieceColor("random")}
                    />
                    <label class="text-xs text-slate-400 font-medium">Random</label>
                  </div>
                  <div class="flex flex-col items-center justify-center gap-y-3">
                    <div
                      class="flex items-center justify-center w-12 h-12 bg-black rounded-full hover:scale-120 cursor-pointer transition-transform duration-300"
                      classList={{
                        "outline-2 outline-slate-500 scale-120": selectedPieceColor() === "black"
                      }}
                      onClick={() => setSelectedPieceColor("black")}
                    />
                    <label class="text-xs text-slate-400 font-medium">Black</label>
                  </div>
                </div>
              </div>
              <A href={constructGameLink()}>
                <Button
                  variant="default"
                  size="default"
                  class="cursor-pointer min-w-58 w-full"
                >
                  <Play />
                  Play
                </Button>
              </A>
            </div>
          </Show>
          <Show when={selectedGameMode() === "player-vs-player"}>
            <div class="relative w-full h-full pt-3.5 p-3 flex flex-col items-center justify-between gap-y-3">
              <Button
                variant="ghost"
                size="icon"
                class="absolute top-2 left-2 hover:bg-slate-700 hover:color-slate-200 text-slate-200 cursor-pointer"
                onClick={() => setSelectedGameMode(undefined)}
              >
                <ArrowLeft class="w-6 h-6 text-slate-200" />
              </Button>
              <div class="flex flex-row items-center justify-center gap-x-2 mb-10">
                <UserRound class="w-8 h-8" />
                <div class="text-sm">vs</div>
                <UserRound class="w-8 h-8" />
              </div>

              <TimeFormatSelect
                selectedTimeFormat={selectedTimeFormat}
                setSelectedTimeFormat={setSelectedTimeFormat}
              />

              <A href={constructGameLink()}>
                <Button
                  variant="default"
                  size="default"
                  class="cursor-pointer min-w-58 w-full"
                >
                  <Play />
                  Play
                </Button>
              </A>
            </div>
          </Show>
        </div>
      </Show >
    </div >
  );
};

export default Home;
