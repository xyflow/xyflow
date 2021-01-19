import { bindActionCreators, ActionCreatorsMapObject } from 'redux';
import { useStore as useStoreRedux, useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { useMemo } from 'react';

import { ReactFlowState, AppDispatch } from './index';
import { ActionTypes } from './action-types';

export const useTypedSelector: TypedUseSelectorHook<ReactFlowState> = useSelector;

export function useActions(actions: ActionTypes, deps?: any): ActionTypes {
  const dispatch: AppDispatch = useDispatch();

  const action = useMemo(
    () => {
      if (Array.isArray(actions)) {
        return actions.map((a) => bindActionCreators(a, dispatch));
      }
      return bindActionCreators<ActionCreatorsMapObject<ActionTypes>>(actions, dispatch);
    },
    deps ? [dispatch, ...deps] : [dispatch]
  );

  return action;
}

export const useStoreActions = useActions;
export const useStoreState = useTypedSelector;
export const useStore = useStoreRedux;
