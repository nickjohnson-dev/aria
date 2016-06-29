import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import app from 'ducks/app';
import reducer from './reducer';
import shared from 'ducks/shared';
import song from 'ducks/song';
import rootSaga from './sagas';
import sampleSong from './sample-song';
import './styles/resets.scss';

const { AppContainer } = app.components;

const sagaMiddleware = createSagaMiddleware();

const middleware = applyMiddleware(
  sagaMiddleware,
  thunkMiddleware
);

const store = createStore(reducer, middleware);
sagaMiddleware.run(rootSaga);

const localStorageSong = localStorage.getItem(
  shared.constants.localStorageKey
);

const initialSong = localStorageSong
  ? JSON.parse(localStorageSong)
  : sampleSong;

store.dispatch(song.actions.songLoaded(initialSong));


render(
  React.createElement(Provider, {
    store,
  }, React.createElement(AppContainer)),
  document.querySelector('#zen-app-root')
);
