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
};