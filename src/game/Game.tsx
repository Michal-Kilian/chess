import { Component, createEffect, createSignal, createUniqueId, onCleanup, onMount, Show } from 'solid-js';
import { Chessboard } from '../chessboard/Chessboard';
import { PieceColor, PiecePositionAlgebraic } from '../lib/types/pieces';
import { Piece } from '../lib/pieces/Piece';
import { calculateEvaluation, resolvePlayerColor, togglePieceColor } from '../lib/utils/utils';
import { Evaluation, Move } from '../lib/types/chessboard';
import { defaultTimeFormat, initialEvaluation, initialPieceMap, timeFormats } from '../lib/configuration/Configuration';
import { EvaluationBar } from './EvaluationBar';
import { PlayerDisplay } from './PlayerDisplay';
import { CapturedPiecesDisplay } from './CapturedPiecesDisplay';
import { MoveList } from './MoveList';
import { useSearchParams } from '@solidjs/router';
import { GameEnding, GameVariant, Player, TimeFormat } from '@/lib/types/game';
import { ChessClock } from '@/game/ChessClock';
import { AudioPlayer } from '@/lib/audio-player/AudioPlayer';
import { GameStartDialog } from './GameStartDialog';
import { GameControls } from './GameControls';
import { GameEndDialog } from './GameEndDialog';

interface GameProps {
	variant: GameVariant;
}

type GameSearchParams = {
	color: PieceColor | "random";
	time: string;
	increment: string;
};

const Game: Component<GameProps> = (props: GameProps) => {
	const gameVariant = props.variant;

	const [searchParams] = useSearchParams<GameSearchParams>();
	const colorChoice: PieceColor | "random" = searchParams.color as PieceColor | "random" ?? "random";
	const playersColor = resolvePlayerColor(colorChoice);
	const initialSeconds = Number(searchParams.time) || defaultTimeFormat.seconds;
	const initialIncrement = Number(searchParams.increment) || defaultTimeFormat.increment;

	const timeFormat: TimeFormat = timeFormats.find((timeFormat: TimeFormat) => timeFormat.seconds === initialSeconds && timeFormat.increment === initialIncrement) ?? defaultTimeFormat;

	const [me, setMe] = createSignal<Player>({
		id: createUniqueId(),
		username: "Alik",
		color: playersColor,
		rating: 1000,
	});
	const [opponent, setOpponent] = createSignal<Player>({
		id: createUniqueId(),
		username: "Protialik",
		color: togglePieceColor(playersColor) as PieceColor,
		rating: 3310,
	});
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

	const [gameEnding, setGameEnding] = createSignal<GameEnding | undefined>(undefined);

	const [gameStartDialogOpen, setGameStartDialogOpen] = createSignal<boolean>(true);
	const [gameEndDialogOpen, setGameEndDialogOpen] = createSignal<boolean>(false);

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
						setGameEnding("timeout_black_wins");
						setGameEndDialogOpen(true);
					}

				} else if (activeTurn === "black") {
					if (currentBlackSeconds > 0) {
						setBlackSeconds(s => s - 1);
					} else {
						console.log("Black timed out!");
						clearInterval(intervalId);
						setTurn('none');
						setGameEnding("timeout_white_wins");
						setGameEndDialogOpen(true);
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

		setTimeout(() => {

		}, 2000);
	};

	const showPreviousMove = () => {
		console.log("TODO: Show previous move");
	};

	const showNextMove = () => {
		console.log("TODO: Show next move");
	};

	return (
		<div class="relative flex flex-1 flex-row w-full h-screen items-center justify-center bg-background text-foreground overflow-hidden">
			<div class="w-full h-full flex flex-row items-center justify-center gap-x-6 p-10">
				<div class="w-full h-full flex flex-col items-center justify-between">
					<div class="relative w-full h-22 flex flex-col items-start justify-start gap-y-2 bg-accent text-accent-foreground rounded-md px-3 py-3 shadow-md">
						<Show when={orientation() === "white"} fallback={
							<>
								<PlayerDisplay
									playerName={playersColor === "white" ? me().username : opponent().username}
									color="white"
									evaluation={evaluation}
								/>
								<CapturedPiecesDisplay capturedPieces={capturedBlackPieces} />
								<div class="absolute top-full right-0">
									<ChessClock
										seconds={whiteSeconds}
										turn={turn}
										color="white"
									/>
								</div>
							</>
						}>
							<PlayerDisplay
								playerName={playersColor === "black" ? me().username : opponent().username}
								color="black"
								evaluation={evaluation}
							/>
							<CapturedPiecesDisplay capturedPieces={capturedWhitePieces} />
							<div class="absolute top-full right-0">
								<ChessClock
									seconds={blackSeconds}
									turn={turn}
									color="black"
								/>
							</div>
						</Show>
					</div>

					<div class="relative w-full h-22 flex flex-col items-start justify-start gap-y-2 bg-accent text-accent-foreground rounded-md px-3 py-3 shadow-md">
						<Show when={orientation() === "white"} fallback={
							<>
								<PlayerDisplay
									playerName={playersColor === "black" ? me().username : opponent().username}
									color="black"
									evaluation={evaluation}
								/>
								<CapturedPiecesDisplay capturedPieces={capturedWhitePieces} />
								<div class="absolute bottom-full right-0">
									<ChessClock
										seconds={blackSeconds}
										turn={turn}
										color="black"
									/>
								</div>
							</>
						}>
							<PlayerDisplay
								playerName={playersColor === "white" ? me().username : opponent().username}
								color="white"
								evaluation={evaluation}
							/>
							<CapturedPiecesDisplay capturedPieces={capturedBlackPieces} />
							<div class="absolute bottom-full right-0">
								<ChessClock
									seconds={whiteSeconds}
									turn={turn}
									color="white"
								/>
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

				<GameControls
					handleToggleOrientation={toggleOrientation}
					handleResetBoard={resetBoard}
					handleShowPreviousMove={showPreviousMove}
					handleShowNextMove={showNextMove}
				/>
			</div>

			<GameStartDialog
				open={gameStartDialogOpen}
				setOpen={setGameStartDialogOpen}
				me={me}
				opponent={opponent}
				gameVariant={gameVariant}
				timeFormat={timeFormat}
			/>

			<GameEndDialog
				open={gameEndDialogOpen}
				setOpen={setGameEndDialogOpen}
				me={me}
				opponent={opponent}
				gameVariant={gameVariant}
				timeFormat={timeFormat}
				gameEnding={gameEnding}
			/>
		</div>
	);
};

export default Game;