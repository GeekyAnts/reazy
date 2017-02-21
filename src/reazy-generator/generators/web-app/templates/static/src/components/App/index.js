import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router';
import logo from '../../images/logo.svg';
import '../../styles/index.css';

@inject("view.app", "app", "domain.user")
@observer
class App extends Component {

  increment() {
    this.props['view.app'].count ++;
  }

  decrement() {
    this.props['view.app'].count --;
  }

  render() {
    const userStore = this.props['domain.user'];

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{`Welcome, ${userStore.username}`}</h2>
          <button><Link to={`/login`}>Logout</Link></button>
        </div>
        <p className="App-intro">
          Count: {this.props['view.app'].count}
        </p>
        <button onClick={() => this.increment()}>Increment</button>
        <button onClick={() => this.decrement()}>Decrement</button>
      </div>
    );
  }
}

export default App;
