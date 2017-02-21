import React from 'react';
import ReactDOM from 'react-dom';
import Routes from '../../components/Routes';
import '../../styles/index.css';
import { Provider } from 'mobx-react';

export default function() {
  return function() {
    const app = this;
    const stores = app.get('state').getAllStores();
    const services = app.getAllServices();

    return ReactDOM.render(
      <Provider {...stores} {...services} app={app}>
        <Routes />
      </Provider>,
      document.getElementById('root')
    );
  }

}
