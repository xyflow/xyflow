import { bindActionCreators, Store } from 'redux';
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

export function useActions(actionSelector: (value: any) => any): any {
  const dispatch: ReactFlowDispatch = reduxUseDispatch();

  const action = useMemo(() => {
    const currAction: any = actionSelector(actions);
    return bindActionCreators(currAction, dispatch);
  }, [dispatch, actionSelector]);

  return action;
}

export const useStoreActions = useActions;
export const useStoreState = useTypedSelector;
export const useStore = (): Store<ReactFlowState, ReactFlowAction> => {
  const store = useStoreRedux<ReactFlowState, ReactFlowAction>();
  return store;
};
export const useDispatch: ReactFlowDispatch = reduxUseDispatch;
