import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GameVariant, Player, TimeFormat } from "@/lib/types/game";
import { Accessor, Component, Setter } from "solid-js";
import { TimeFormatDisplay } from "./TimeFormatDisplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GameStartDialogProps {
	open: Accessor<boolean>;
	setOpen: Setter<boolean>;
	me: Accessor<Player>;
	opponent: Accessor<Player>;
	gameVariant: GameVariant;
	timeFormat: TimeFormat;
}

export const GameStartDialog: Component<GameStartDialogProps> = (props: GameStartDialogProps) => {
	return (
		<Dialog open={props.open()} onOpenChange={props.setOpen}>
			<DialogContent
				class="p-0 bg-pattern-stripes"
			>
				<DialogHeader class="bg-accent p-3 shadow-md">
					<DialogTitle class="text-2xl text-center">Game starts</DialogTitle>
				</DialogHeader>
				<div class="p-6 flex flex-col items-center justify-center">
					<div class="flex flex-row items-center justify-between">
						<TimeFormatDisplay
							timeFormat={props.timeFormat}
							className="text-accent bg-slate-50 rounded-md px-3 py-2 shadow-md w-fit"
							titleClassName="text-accent"
							secondsClassName="text-accent"
						/>
					</div>
					<div class="flex flex-row w-full justify-between items-center text-lg mt-6">
						<div class="w-2/5 text-center px-4 py-3 flex items-center justify-start gap-x-3 bg-slate-50 rounded-md shadow-md">
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
						<div class="w-2/5 text-center px-4 py-3 flex items-center justify-start gap-x-3 bg-slate-50 rounded-md shadow-md">
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
			</DialogContent>
		</Dialog>
	);
};