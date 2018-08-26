import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {Provider} from 'react-redux';
import reduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import Home from './home';
import homeReducer from './home/.duck';

import './index.css';

const rootReducer = combineReducers({
  home: homeReducer,
});
let enhancers = [reduxThunk];
if (global.app.environment === 'development') {
  enhancers.push(logger);
}
enhancers = applyMiddleware(...enhancers);
if (global.app.environment === 'development') {
  enhancers = composeWithDevTools(enhancers);
}
const rootStore = createStore(
  rootReducer,
  enhancers
);

/**
 * Main application
 */
export default class App extends React.Component {
  /**
   * Renders the main application
   * @return {String}
   */
  render() {
    return (
      <div id="app">
        <CssBaseline />
        <Provider store={rootStore}>
          <Router>
            <div>
              <Route exact path="/" component={Home} />
              {/* add more routes as you need */}
            </div>
          </Router>
        </Provider>
      </div>
    );
  }
};

(global.app.environment === 'development')
  && (module.hot)
  && module.hot.accept();
const applicationEntrypoint = document.getElementById('app-entrypoint');
applicationEntrypoint ? ReactDOM.render(<App />, applicationEntrypoint) : false;