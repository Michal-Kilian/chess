import { Component, createSignal } from "solid-js";
import { Card, CardContent } from "./components/ui/card";
import { Bot, UserRound, ChevronDown } from "lucide-solid";
import { A } from "@solidjs/router";
import { ColorDrawer } from "./components/color-drawer";

const App: Component = () => {
  const [showColorDrawer, setShowColorDrawer] = createSignal<boolean>(false);

  return (
    <div class="flex flex-1 flex-col w-full h-screen items-center justify-center bg-background text-slate-200 overflow-hidden bg-slate-900">
      <div class="max-w-48 max-h-48 mb-10 shadow-xl rounded-full">
        <img src="/src/assets/Logo.png" alt="Logo" />
      </div>
      <div class="flex flex-row items-center justify-center w-full max-w-lg gap-x-10">
        <div
          class="relative w-1/2 h-full"
          onMouseEnter={() => setTimeout(() => setShowColorDrawer(true), 300)}
          onMouseLeave={() => setShowColorDrawer(false)}
        >
          <Card class="w-full h-full hover:scale-105 transition-all duration-300 bg-slate-800 border-none shadow-xl text-slate-200 cursor-pointer">
            <A href="/player-vs-bot?color=random">
              <CardContent class="pt-6 flex flex-row items-center justify-center gap-x-3">
                <Bot class="w-14 h-14" />
                <div class="">vs</div>
                <UserRound class="w-14 h-14" />
              </CardContent>
            </A>
          </Card>
          <ColorDrawer
            drawerOpen={showColorDrawer}
          />
        </div>
        <Card class="w-1/2 h-full hover:scale-105 transition-all duration-300 bg-slate-800 border-none shadow-xl text-slate-200 cursor-pointer">
          <A href="/player-vs-player">
            <CardContent class="pt-6 flex flex-row items-center justify-center gap-x-3">
              <UserRound class="w-14 h-14" />
              <div class="">vs</div>
              <UserRound class="w-14 h-14" />
            </CardContent>
          </A>
        </Card>
      </div>
    </div>
  );
};

export default App;
