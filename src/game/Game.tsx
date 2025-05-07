import { Component, createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js';
import { Chessboard } from '../chessboard/Chessboard';
import { PieceColor, PiecePositionAlgebraic } from '../lib/types/pieces';
import { ArrowDownUp, ChevronLeft, ChevronRight, House, RotateCcw, Volume2, VolumeX } from 'lucide-solid';
import { Piece } from '../lib/pieces/Piece';
import { calculateEvaluation, resolvePlayerColor } from '../lib/utils/utils';
import { Evaluation, Move } from '../lib/types/chessboard';
import { defaultTimeFormat, initialEvaluation, initialPieceMap } from '../lib/board/Board';
import { EvaluationBar } from '../chessboard/EvaluationBar';
import { PlayerDisplay } from '../chessboard/PlayerDisplay';
import { CapturedPiecesDisplay } from '../chessboard/CapturedPiecesDisplay';
import { MoveList } from '../chessboard/MoveList';
import { Button } from '../components/ui/button';
import { A, useSearchParams } from '@solidjs/router';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GameVariant } from '@/lib/types/game';
import { ChessClock } from '@/chessboard/ChessClock';
import { AudioPlayer } from '@/lib/audio-player/AudioPlayer';
import { GameStartDialog } from './GameStartDialog';
import { I } from 'node_modules/@kobalte/core/dist/index-4a5ea3cf';

interface GameProps {
    variant: GameVariant;
}

type GameSearchParams = {
    color: PieceColor | "random";
    time: string;
    increment: string;
};

const Game: Component<GameProps> = (props: GameProps) => {
    const [searchParams] = useSearchParams<GameSearchParams>();
    const colorChoice: PieceColor | "random" = searchParams.color as PieceColor | "random" ?? "random";
    const playersColor = resolvePlayerColor(colorChoice);
    const initialSeconds = Number(searchParams.time) || defaultTimeFormat.seconds;
    const initialIncrement = Number(searchParams.increment) || defaultTimeFormat.increment;

    const [orientation, setOrientation] = createSignal<PieceColor>(playersColor);
    const [turn, setTurn] = createSignal<PieceColor | "none">("none");
    const [pieceMap, setPieceMap] =
        createSignal<Partial<Record<PiecePositionAlgebraic, Piece | undefined>>>(
            initialPieceMap
        );
    const [moves, setMoves] = createSignal<Array<Move>>([]);
    const [capturedWhitePieces, setCapturedWhitePieces] = createSignal<
        Array<Piece>
    >([]);
    const [capturedBlackPieces, setCapturedBlackPieces] = createSignal<
        Array<Piece>
    >([]);
    const [evaluation, setEvaluation] = createSignal<Evaluation>(
        initialEvaluation
    );
    const [whiteSeconds, setWhiteSeconds] = createSignal<number>(initialSeconds);
    const [blackSeconds, setBlackSeconds] = createSignal<number>(initialSeconds);
    const [increment, setIncrement] = createSignal<number>(initialIncrement);

    const [gameStartDialogOpen, setGameStartDialogOpen] = createSignal<boolean>(true);

    createEffect(() => {
        setEvaluation(
            calculateEvaluation(capturedWhitePieces(), capturedBlackPieces())
        );
    });

    onMount(() => {
        setTimeout(() => {
            setGameStartDialogOpen(false);
            setTurn("white");
            AudioPlayer.playSound("gameStart");
        }, 2000);
    });

    createEffect(() => {
        if (gameStartDialogOpen()) return;

        const currentTurn = turn();

        let intervalId: NodeJS.Timeout;

        onCleanup(() => {
            if (intervalId !== undefined) {
                clearInterval(intervalId);
            }
        });

        if ((currentTurn === "white" || currentTurn === "black")) {
            intervalId = setInterval(() => {
                const activeTurn = turn();
                const currentWhiteSeconds = whiteSeconds();
                const currentBlackSeconds = blackSeconds();

                if (activeTurn === "white") {
                    if (currentWhiteSeconds > 0) {
                        setWhiteSeconds(s => s - 1);
                    } else {
                        console.log("White timed out!");
                        clearInterval(intervalId);
                        setTurn('none');
                        // TODO: White timed out
                    }

                } else if (activeTurn === "black") {
                    if (currentBlackSeconds > 0) {
                        setBlackSeconds(s => s - 1);
                    } else {
                        console.log("Black timed out!");
                        clearInterval(intervalId);
                        setTurn('none');
                        // TODO: Black timed out
                    }
                }
            }, 1000);
        }
    });

    const toggleOrientation = () => {
        setOrientation(orientation() === 'white' ? 'black' : 'white');
    };

    const resetBoard = () => {
        setOrientation(playersColor);
        setTurn("white");
        setPieceMap(initialPieceMap);
        setMoves([]);
        setCapturedWhitePieces([]);
        setCapturedBlackPieces([]);
        setWhiteSeconds(initialSeconds);
        setBlackSeconds(initialSeconds);
    };

    const showPreviousMove = () => {
        console.log("TODO: Show previous move");
    };

    const showNextMove = () => {
        console.log("TODO: Show next move");
    };

    return (
        <div class="relative flex flex-1 flex-row w-full h-screen items-center justify-center bg-background text-foreground overflow-hidden bg-slate-900">
            <div class="w-full h-full flex flex-row items-center justify-center gap-x-6 p-10">
                <div class="w-full h-full flex flex-col items-center justify-between text-white">
                    <div class="relative w-full h-22 flex flex-col items-start justify-start gap-y-2 bg-slate-800 rounded-md px-3 py-3 shadow-md">
                        <Show when={orientation() === "white"} fallback={
                            <>
                                <PlayerDisplay
                                    playerName="Player 1"
                                    color="white"
                                    evaluation={evaluation}
                                />
                                <CapturedPiecesDisplay capturedPieces={capturedBlackPieces} />
                                <div class="absolute top-full right-0">
                                    <ChessClock seconds={whiteSeconds} />
                                </div>
                            </>
                        }>
                            <PlayerDisplay
                                playerName="Player 2"
                                color="black"
                                evaluation={evaluation}
                            />
                            <CapturedPiecesDisplay capturedPieces={capturedWhitePieces} />
                            <div class="absolute top-full right-0">
                                <ChessClock seconds={blackSeconds} />
                            </div>
                        </Show>
                    </div>

                    <div class="relative w-full h-22 flex flex-col items-start justify-start gap-y-2 bg-slate-800 rounded-md px-3 py-3">
                        <Show when={orientation() === "white"} fallback={
                            <>
                                <PlayerDisplay
                                    playerName="Player 2"
                                    color="black"
                                    evaluation={evaluation}
                                />
                                <CapturedPiecesDisplay capturedPieces={capturedWhitePieces} />
                                <div class="absolute bottom-full right-0">
                                    <ChessClock seconds={blackSeconds} />
                                </div>
                            </>
                        }>
                            <PlayerDisplay
                                playerName="Player 1"
                                color="white"
                                evaluation={evaluation}
                            />
                            <CapturedPiecesDisplay capturedPieces={capturedBlackPieces} />
                            <div class="absolute bottom-full right-0">
                                <ChessClock seconds={whiteSeconds} />
                            </div>
                        </Show>
                    </div>
                </div>

                <EvaluationBar evaluation={evaluation} orientation={orientation} />
            </div>
            <Chessboard
                orientation={orientation}
                setOrientation={setOrientation}
                turn={turn}
                setTurn={setTurn}
                playersColor={playersColor}
                pieceMap={pieceMap}
                moves={moves}
                setMoves={setMoves}
                setPieceMap={setPieceMap}
                capturedWhitePieces={capturedWhitePieces}
                setCapturedWhitePieces={setCapturedWhitePieces}
                capturedBlackPieces={capturedBlackPieces}
                setCapturedBlackPieces={setCapturedBlackPieces}
            />
            <div class="w-full h-full flex flex-col gap-10 items-center justify-center p-10">
                <MoveList moves={moves} />

                <div class="w-full h-1/2 flex flex-col items-center justify-between bg-slate-800 rounded-md">
                    <div class="w-fit w-full flex flex-row items-center justify-center gap-x-3 p-3">
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    variant="default"
                                    size="icon"
                                    onClick={showPreviousMove}
                                    class="cursor-pointer"
                                >
                                    <ChevronLeft class="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Previous move
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    variant="default"
                                    size="icon"
                                    onClick={showNextMove}
                                    class="cursor-pointer"
                                >
                                    <ChevronRight class="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Next move
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <div class="flex flex-row w-full items-center justify-between p-3 gap-x-3">
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    variant="default"
                                    size="icon"
                                    onClick={toggleOrientation}
                                    class="cursor-pointer"
                                >
                                    <ArrowDownUp class="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Toggle orientation
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    variant="default"
                                    size="icon"
                                    onClick={() => AudioPlayer.toggleMute()}
                                    class="cursor-pointer"
                                >
                                    <Show when={AudioPlayer.isMutedSignal()} fallback={
                                        <Volume2 class="w-4 h-4" />
                                    }>
                                        <VolumeX class="w-4 h-4" />
                                    </Show>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <Show when={AudioPlayer.isMutedSignal()} fallback="Unmuted">
                                    Muted
                                </Show>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger>
                                <A href="/">
                                    <Button
                                        variant="default"
                                        size="icon"
                                        class="cursor-pointer"
                                    >
                                        <House class="w-4 h-4" />
                                    </Button>
                                </A>
                            </TooltipTrigger>
                            <TooltipContent>
                                Home
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    variant="default"
                                    size="icon"
                                    onClick={resetBoard}
                                    class="cursor-pointer"
                                >
                                    <RotateCcw class="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Reset board
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>

            <GameStartDialog
                open={gameStartDialogOpen}
                setOpen={setGameStartDialogOpen}
                player1={{
                    id: "1",
                    username: "Jozo",
                    color: "white",
                }}
                player2={{
                    id: "2",
                    username: "Fero",
                    color: "black",
                }}
                gameVariant="player-vs-player"
                timeFormat={defaultTimeFormat}
            />
        </div>
    );
};

export default Game;