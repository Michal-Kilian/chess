import { PieceColor } from "./pieces";

export type GameVariant =
	| "player-vs-bot"
	| "player-vs-player";

type TimeFormatType =
	| "bullet"
	| "blitz"
	| "rapid"
	| "standard";

export type TimeFormat = {
	id: string;
	type: TimeFormatType;
	title: string;
	seconds: number;
	increment: number;
};

export type Player = {
	id: string;
	username: string;
	color: PieceColor;
	rating: number;
};

export type GameEnding =
	| 'checkmate_white_wins'
	| 'checkmate_black_wins'
	| 'timeout_white_wins'
	| 'timeout_black_wins'
	| 'stalemate'
	| 'draw_insufficient_material'
	| 'draw_fifty_move'
	| 'draw_threefold_repetition';