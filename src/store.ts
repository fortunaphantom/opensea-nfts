import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

import viewStates from 'reducers/viewStates';
import web3 from 'reducers/web3';
import collections from 'reducers/collections';

const store = createStore(
  combineReducers({viewStates, web3, collections}),
  applyMiddleware(thunkMiddleware)
);

export default store;
