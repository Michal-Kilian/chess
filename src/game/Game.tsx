import { Component, createEffect, createSignal, Match, Show, Switch } from 'solid-js';
import { Chessboard } from '../chessboard/Chessboard';
import { PieceColor, PiecePositionAlgebraic } from '../lib/types/pieces';
import { ArrowDownUp, ChevronLeft, ChevronRight, House, RotateCcw } from 'lucide-solid';
import { Piece } from '../lib/pieces/Piece';
import { calculateEvaluation } from '../lib/utils/utils';
import { Evaluation, Move } from '../lib/types/chessboard';
import { initialEvaluation, initialPieceMap } from '../lib/board/Board';
import { EvaluationBar } from '../chessboard/EvaluationBar';
import { PlayerDisplay } from '../chessboard/PlayerDisplay';
import { CapturedPiecesDisplay } from '../chessboard/CapturedPiecesDisplay';
import { MoveList } from '../chessboard/MoveList';
import { Button } from '../components/ui/button';
import { A } from '@solidjs/router';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GameVariant } from '@/lib/types/game';

interface GameProps {
    variant: GameVariant;
}

const Game: Component<GameProps> = (props: GameProps) => {
    const [orientation, setOrientation] = createSignal<PieceColor>('white');
    const [turn, setTurn] = createSignal<PieceColor>("white");
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

    createEffect(() => {
        setEvaluation(
            calculateEvaluation(capturedWhitePieces(), capturedBlackPieces())
        );
    });

    const toggleOrientation = () => {
        setOrientation(orientation() === 'white' ? 'black' : 'white');
    };

    const resetBoard = () => {
        setOrientation("white");
        setTurn("white");
        setPieceMap(initialPieceMap);
        setMoves([]);
        setCapturedWhitePieces([]);
        setCapturedBlackPieces([]);
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
                    <div class="w-full h-fit flex flex-col items-start justify-center gap-y-1 bg-slate-800 rounded-md px-3 py-2">
                        <Show when={orientation() === "white"} fallback={
                            <>
                                <PlayerDisplay
                                    playerName="Player 1"
                                    color="white"
                                    evaluation={evaluation}
                                />
                                <CapturedPiecesDisplay capturedPieces={capturedBlackPieces} />
                            </>
                        }>
                            <PlayerDisplay
                                playerName="Player 2"
                                color="black"
                                evaluation={evaluation}
                            />
                            <CapturedPiecesDisplay capturedPieces={capturedWhitePieces} />
                        </Show>
                    </div>

                    <div class="w-full h-fit flex flex-col items-start justify-center gap-y-1 bg-slate-800 rounded-md px-3 py-2">
                        <Show when={orientation() === "white"} fallback={
                            <>
                                <PlayerDisplay
                                    playerName="Player 2"
                                    color="black"
                                    evaluation={evaluation}
                                />
                                <CapturedPiecesDisplay capturedPieces={capturedWhitePieces} />
                            </>
                        }>
                            <PlayerDisplay
                                playerName="Player 1"
                                color="white"
                                evaluation={evaluation}
                            />
                            <CapturedPiecesDisplay capturedPieces={capturedBlackPieces} />
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
        </div>
    );
};

export default Game;