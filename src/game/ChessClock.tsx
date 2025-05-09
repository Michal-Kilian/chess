import { PieceColor } from "@/lib/types/pieces";
import { Accessor, Component, Match, Show, Switch } from "solid-js";

interface ChessClockProps {
	seconds: Accessor<number>;
	turn: Accessor<PieceColor | "none">;
	color: PieceColor;
}

export const ChessClock: Component<ChessClockProps> = (props: ChessClockProps) => {
	const formatTime = () => {
		if (props.seconds() < 0) return "N/A";
		const days = () => Math.floor(props.seconds() / 86400);
		let remainingSeconds = () => props.seconds() % 86400;
		const hours = () => Math.floor(remainingSeconds() / 3600);
		let remainingSeconds2 = () => remainingSeconds() % 3600;
		const minutes = Math.floor(remainingSeconds2() / 60);
		const seconds = remainingSeconds2() % 60;
		const paddedMinutes = minutes.toString().padStart(2, '0');
		const paddedSeconds = seconds.toString().padStart(2, '0');
		if (days() > 0) {
			return `${days()}:${hours()}:${paddedMinutes}:${paddedSeconds}`;
		} else if (hours() > 0) {
			return `${hours()}:${paddedMinutes}:${paddedSeconds}`;
		} else {
			const totalMinutesForDisplay = Math.floor(props.seconds() / 60);
			return `${totalMinutesForDisplay}:${paddedSeconds}`;
		}
	};

	return (
		<Show when={props.turn() === props.color} fallback={
			<div
				class="h-fit my-3 px-3 py-2 text-normal font-medium bg-accent text-muted-foreground rounded-md min-w-18 w-fit flex items-center justify-center shadow-md"
			>
				{formatTime()}
			</div>
		}>
			<div
				class="h-fit my-3 px-3 py-2 text-normal font-medium bg-accent text-accent-foreground rounded-md min-w-18 w-fit flex items-center justify-center shadow-md"
			>
				{formatTime()}
			</div>
		</Show>

	);
};