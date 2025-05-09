import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GameEnding, GameVariant, Player, TimeFormat } from "@/lib/types/game";
import { Accessor, Component, Setter } from "solid-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, Play } from "lucide-solid";
import { getFormattedTime } from "@/lib/utils/utils";
import { A } from "@solidjs/router";

interface GameStartDialogProps {
	open: Accessor<boolean>;
	setOpen: Setter<boolean>;
	me: Accessor<Player>;
	opponent: Accessor<Player>;
	gameVariant: GameVariant;
	timeFormat: TimeFormat;
	gameEnding: Accessor<GameEnding | undefined>;
}

export const GameEndDialog: Component<GameStartDialogProps> = (props: GameStartDialogProps) => {
	const meWins = (): boolean => !!props.gameEnding() && props.gameEnding()!.includes(props.me().color);
	const opponentWins = (): boolean => !!props.gameEnding() && props.gameEnding()!.includes(props.opponent().color);

	const getGameEndingTitle = (): string => {
		switch (props.gameEnding()) {
			case "checkmate_white_wins":
				return "White wins";
			case "timeout_white_wins":
				return "White wins";
			case "checkmate_black_wins":
				return "Black wins";
			case "timeout_black_wins":
				return "Black wins";
			default:
				return "Draw";
		}
	};

	const getGameEndingMessage = (): string => {
		switch (props.gameEnding()) {
			case "checkmate_white_wins":
				return "By checkmate";
			case "checkmate_black_wins":
				return "By checkmate";
			case "timeout_white_wins":
				return "By timeout";
			case "timeout_black_wins":
				return "By timeout";
			case "stalemate":
				return "By stalemate";
			case "draw_threefold_repetition":
				return "By threefold repetition";
			case "draw_insufficient_material":
				return "By insufficient material"
			case "draw_fifty_move":
				return "By the 50 move rule"
			default:
				return "";
		}
	};

	/*const constructGameLink = () => {
		const params = new URLSearchParams({
		  color: selectedPieceColor(),
		  time: selectedTimeFormat().seconds.toString(),
		  increment: selectedTimeFormat().increment.toString(),
		});
		return "/" + selectedGameMode() + "?" + params.toString();
	  };*/

	return (
		<Dialog open={props.open()} onOpenChange={props.setOpen}>
			<DialogContent
				class="p-0 bg-pattern-stripes"
			>
				<DialogHeader class="bg-accent p-3 shadow-md">
					<DialogTitle class="flex flex-col items-center justify-center gap-y-2">
						<h1 class="text-2xl text-center">{getGameEndingTitle()}</h1>
						<h2 class="text-center font-normal">{getGameEndingMessage()}</h2>
					</DialogTitle>
				</DialogHeader>
				<div class="p-6 flex flex-col items-center justify-center">
					<div class="w-full flex flex-row items-center justify-between mb-3">
						<span class="w-2/5 text-center text-accent font-medium text-sm">
							{meWins() ? "Wins" : "Loses"}
						</span>
						<div class="w-1/5" />
						<span class="w-2/5 text-center text-accent font-medium text-sm">{opponentWins() ? "Wins" : "Loses"}</span>
					</div>

					<div class="flex flex-row w-full justify-between items-center text-lg">
						<div
							class="w-2/5 text-center px-4 py-3 flex items-center justify-start gap-x-3 bg-slate-50 rounded-md shadow-md"
							classList={{
								"opacity-60": opponentWins()
							}}
						>
							<Avatar>
								<AvatarImage src="src/assets/avatars/avatar-example-2.png" />
								<AvatarFallback />
							</Avatar>
							<div class="flex flex-col items-start justify-center w-full h-full min-w-0">
								<span class="truncate w-full font-medium text-left text-background">{props.me().username}</span>
								<span class="text-accent text-sm w-full text-left">{props.me().rating}</span>
							</div>
						</div>
						<div class="w-1/5 text-center p-1 text-background font-bold text-xl flex flex-row items-center justify-center gap-x-1.5">
							<div
								class="w-6 h-6 rounded-full border-2 border-slate-500"
								classList={{
									"bg-white": props.me().color === "white",
									"bg-black": props.me().color === "black",
								}}
							/>
							<span>vs</span>
							<div
								class="w-6 h-6 rounded-full border-2 border-slate-500"
								classList={{
									"bg-white": props.opponent().color === "white",
									"bg-black": props.opponent().color === "black",
								}}
							/>
						</div>
						<div
							class="w-2/5 text-center px-4 py-3 flex items-center justify-start gap-x-3 bg-slate-50 rounded-md shadow-md"
							classList={{
								"opacity-60": meWins()
							}}
						>
							<div class="flex flex-col items-start justify-center w-full h-full min-w-0">
								<span class="truncate w-full font-medium text-right text-background">{props.opponent().username}</span>
								<span class="text-accent text-sm w-full text-right">{props.opponent().rating}</span>
							</div>
							<Avatar>
								<AvatarImage src="src/assets/avatars/avatar-example-2.png" />
								<AvatarFallback />
							</Avatar>
						</div>
					</div>
				</div>
				<DialogFooter class="w-full flex flex-row items-center justify-between p-6 gap-x-6">
					<A href="/" class="w-1/2">
						<Button
							variant="default"
							size="default"
							class="w-full cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-300 border-2 border-accent"
						>
							<Home class="w-4 h-4" />
							Home
						</Button>
					</A>
					<A href={/*constructGameLink()*/""} class="w-1/2">
						<Button
							variant="secondary"
							size="default"
							class="w-full cursor-pointer hover:scale-105 transition-all duration-300 border-2 border-accent"
						>
							<Play class="w-4 h-4" />
							Play new {getFormattedTime(props.timeFormat.seconds)}
						</Button>
					</A>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};