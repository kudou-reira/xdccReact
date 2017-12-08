import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import store from './reducers';

import HomeScreen from './screens/homeScreen';
import AltScreen from './screens/altScreen';
import DownloadListScreen from './screens/downloadListScreen';

const rootElement = document.querySelector(document.currentScript.getAttribute('data-container'));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <MuiThemeProvider>
        <div>
          <Switch>
            <Route exact path="/" component={HomeScreen} />
            <Route exact path="/alt" component={AltScreen} />
            <Route exact path="/downloadList" component={DownloadListScreen} />
          </Switch>
        </div>
      </MuiThemeProvider>
    </Router>
  </Provider>,
  rootElement
);
