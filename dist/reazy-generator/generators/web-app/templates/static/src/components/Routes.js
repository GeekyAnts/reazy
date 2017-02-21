import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import App from './App';
import Login from './Login';

export default class Routes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/app" component={App} />
      </Router>
    );
  }
}
