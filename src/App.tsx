import { ColorModeProvider, ColorModeScript, createLocalStorageManager } from "@kobalte/core";
import { Route, Router } from "@solidjs/router";
import { Component, createUniqueId } from "solid-js";
import Home from "./Home";
import Game from "./game/Game";

const App: Component = () => {
	const storageManager = createLocalStorageManager("vite-ui-theme");

	return (
		<>
			<ColorModeScript storageType={storageManager.type} />
			<ColorModeProvider storageManager={storageManager}>
				<Router>
					<Route path="/" component={() => <Home />} />
					<Route
						path="/player-vs-bot/"
						component={() => (
							<Game variant="player-vs-bot" />
						)}
					/>
					<Route
						path="/player-vs-player"
						component={() => (
							<Game variant="player-vs-player" />
						)}
					/>
				</Router>
			</ColorModeProvider>
		</>
	);
};

export default App;