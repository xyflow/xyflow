import { bindActionCreators } from 'redux';
import { useStore as useStoreRedux, useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { useMemo } from 'react';

import { ReactFlowState, AppDispatch } from './index';
import { actions } from './actions';

export const useTypedSelector: TypedUseSelectorHook<ReactFlowState> = useSelector;

export function useActions(actionSelector: any): any {
  const dispatch: AppDispatch = useDispatch();

  const action = useMemo(() => {
    const currAction = actionSelector(actions);
    return bindActionCreators(currAction, dispatch);
  }, [dispatch, actionSelector]);

  return action;
}

export const useStoreActions = useActions;
export const useStoreState = useTypedSelector;
export const useStore = useStoreRedux;
