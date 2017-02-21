import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router';
import logo from '../../images/logo.svg';
import '../../styles/index.css';

@inject("view.app", "domain.user")
@observer
export default class Login extends Component {

  handleChange(event) {
    this.props['domain.user'].username = event.target.value;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Reazy</h2>
        </div>
        <p className="App-intro">
          <input placeholder="username" onChange={(e) => this.handleChange(e)} />
          <br />
          <input placeholder="password" />
          <br />
          <button><Link to={`/app`}>Login</Link></button>
        </p>
      </div>
    );
  }
}
