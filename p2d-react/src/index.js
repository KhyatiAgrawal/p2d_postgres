import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import App from './App';
import Feed from './pages/Feed/Feed'
import Cart from './pages/Cart/Cart'

ReactDOM.render(<App />, document.getElementById('root'));

const history = createHistory({
    basename: process.env.PUBLIC_URL,
  });

ReactDOM.render(
  <BrowserRouter history={history} basename={process.env.PUBLIC_URL}>
		<Switch>
			<Route exact path="/" component={() => <App />} />
			<Route exact path="/feed" component={Feed} />
			<Route exact path="/cart" component={Cart} />
		</Switch>
  </BrowserRouter>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();