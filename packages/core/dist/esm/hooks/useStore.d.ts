import type { StoreApi } from 'zustand';
import type { ReactFlowState } from '../types';
declare type ExtractState = StoreApi<ReactFlowState> extends {
    getState: () => infer T;
} ? T : never;
declare function useStore<StateSlice = ExtractState>(selector: (state: ReactFlowState) => StateSlice, equalityFn?: (a: StateSlice, b: StateSlice) => boolean): StateSlice;
declare const useStoreApi: () => {
    getState: () => ReactFlowState;
    setState: (partial: ReactFlowState | Partial<ReactFlowState> | ((state: ReactFlowState) => ReactFlowState | Partial<ReactFlowState>), replace?: boolean | undefined) => void;
    subscribe: (listener: (state: ReactFlowState, prevState: ReactFlowState) => void) => () => void;
    destroy: () => void;
};
export { useStore, useStoreApi };
//# sourceMappingURL=useStore.d.ts.map