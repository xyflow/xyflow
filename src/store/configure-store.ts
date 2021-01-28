import { applyMiddleware, compose, createStore, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { ReactFlowState } from '../types';
import reactFlowReducer from './reducer';

export default function configureStore(preloadedState: ReactFlowState): Store<ReactFlowState> {
  const composedEnhancers = compose(applyMiddleware(thunkMiddleware));
  const store = createStore(reactFlowReducer, preloadedState, composedEnhancers);

  return store;
}
