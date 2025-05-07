import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GameVariant, Player, TimeFormat } from "@/lib/types/game";
import { Accessor, Component, Setter } from "solid-js";

interface GameStartDialogProps {
	open: Accessor<boolean>;
	setOpen: Setter<boolean>;
	player1: Player;
	player2: Player;
	gameVariant: GameVariant;
	timeFormat: TimeFormat;
}

export const GameStartDialog: Component<GameStartDialogProps> = (props: GameStartDialogProps) => {
	return (
		<Dialog open={props.open()} onOpenChange={props.setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Game starts</DialogTitle>
					<DialogDescription class="flex flex-col w-full items-center justify-center gap-y-2">
						<div>{props.gameVariant}</div>
						<div>{props.timeFormat.title} + {(props.timeFormat.seconds / 60).toString() + " Min"}</div>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter class="flex flex-row w-full justify-between items-center">
					<div>{props.player1.username}</div>
					<div>vs</div>
					<div>{props.player2.username}</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};