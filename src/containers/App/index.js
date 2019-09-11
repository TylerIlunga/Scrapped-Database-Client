import React, { Component } from 'react';
import Router from '../../components/Router';
import { Provider } from 'react-redux';
import { store } from '../../redux';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}
