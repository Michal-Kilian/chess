import { render } from 'solid-js/web';

import './index.css';
import { Route, Router } from '@solidjs/router';
import App from './App';
import Game from './game/Game';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?'
  );
}

render(
  () => (
    <Router>
      <Route path="/" component={App} />
      <Route path="/player-vs-bot/" component={() => <Game variant="player-vs-bot" />} />
      <Route path="/player-vs-player" component={() => <Game variant="player-vs-player" />} />
      {/*<Route path="/online" component={Game} />*/}
    </Router>
  ), root!
);
