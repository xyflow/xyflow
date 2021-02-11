import { bindActionCreators, Store, ActionCreator, ActionCreatorsMapObject } from 'redux';
import {
  useStore as useStoreRedux,
  useSelector,
  useDispatch as reduxUseDispatch,
  TypedUseSelectorHook,
} from 'react-redux';
import { useMemo } from 'react';

import { ReactFlowDispatch } from './index';
import * as actions from './actions';
import { ReactFlowAction } from './actions';
import { ReactFlowState } from '../types';

export const useTypedSelector: TypedUseSelectorHook<ReactFlowState> = useSelector;

export type ActionCreatorSelector<Action> = (acts: typeof actions) => ActionCreator<Action>;
export type ActionMapObjectSelector<Action> = (acts: typeof actions) => ActionCreatorsMapObject<Action>;
export type ActionSelector<Action> = (acts: typeof actions) => ActionCreatorsMapObject<Action> | ActionCreator<Action>;

export function useStoreActions<Action extends ReactFlowAction>(
  actionSelector: ActionCreatorSelector<Action>
): ActionCreator<Action>;

export function useStoreActions<Action extends ReactFlowAction>(
  actionSelector: ActionMapObjectSelector<Action>
): ActionCreatorsMapObject<Action>;

export function useStoreActions<Action extends ReactFlowAction>(actionSelector: ActionSelector<Action>) {
  const dispatch: ReactFlowDispatch = reduxUseDispatch();
  const currAction = actionSelector(actions);

  const action = useMemo(() => {
    // this looks weird but required if both ActionSelector and ActionMapObjectSelector are supported
    return typeof currAction === 'function'
      ? bindActionCreators(currAction, dispatch)
      : bindActionCreators(currAction, dispatch);
  }, [dispatch, currAction]);

  return action;
}

export const useStoreState = useTypedSelector;
export const useStore = (): Store<ReactFlowState, ReactFlowAction> => {
  const store = useStoreRedux<ReactFlowState, ReactFlowAction>();
  return store;
};
export const useDispatch: ReactFlowDispatch = reduxUseDispatch;
