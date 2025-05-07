import { Accessor, Component } from "solid-js";

interface ChessClockProps {
    seconds: Accessor<number>;
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
        <div class="h-fit my-3 px-3 py-2 text-normal font-medium text-white bg-slate-800 rounded-md min-w-18 w-fit flex items-center justify-center shadow-md">
            {formatTime()}
        </div>
    );
};