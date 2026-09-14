import type { ExtractState, Mutate, StateCreator, StoreApi, StoreMutatorIdentifier } from 'zustand';

import type { ReactFlowStore } from '../types';

type TrackedState = Pick<ReactFlowStore, 'nodeLookup' | 'edgeLookup' | 'updatedNodes' | 'updatedEdges'>;

type Middleware = <
  T extends TrackedState,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  initializer: StateCreator<T, [...Mps, ['xyflow/middleware', never]], Mcs>
) => StateCreator<T, Mps, [['xyflow/middleware', never], ...Mcs]>;

declare module 'zustand' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface StoreMutators<S, A> {
    'xyflow/middleware': Omit<S, 'subscribeTracked'> & {
      subscribeTracked: () => {
        subscribe: (listener: () => void) => () => void;
        getState: () => ExtractState<S>;
      };
    };
  }
}

export type MiddlewareStoreApi<T> = Mutate<StoreApi<T>, [['xyflow/middleware', never]]>;

type MiddlewareImpl = <T extends TrackedState>(initializer: StateCreator<T, [], []>) => StateCreator<T, [], []>;

type Subscription = {
  props: Set<PropertyKey>;
  callback: () => void;
};

const noop = () => {};

const middlewareImpl: MiddlewareImpl = (initializer) => (set, get, api) => {
  const store = api as MiddlewareStoreApi<ReturnType<typeof initializer>>;
  const subscriptions = new Set<Subscription>();

  const setState = store.setState;
  store.setState = (...args) => {
    setState(...(args as Parameters<typeof setState>));
    if (typeof args[0] === 'function' || args[1] === true) {
      for (const subscription of subscriptions) {
        subscription.callback();
      }
    } else {
      const props = new Set<PropertyKey>(Reflect.ownKeys(args[0]));
      // Only use IDs from this update; the store retains the previous update's sets.
      for (const id of args[0].updatedNodes ?? []) {
        props.add(`n-${id}`);
      }
      for (const id of args[0].updatedEdges ?? []) {
        props.add(`e-${id}`);
      }
      if (props.size > 0) {
        for (const subscription of subscriptions) {
          for (const prop of subscription.props) {
            if (props.has(prop)) {
              subscription.callback();
              break;
            }
          }
        }
      }
    }
  };

  function getProxiedState(subscription: Subscription) {
    subscription.props.clear();
    return new Proxy(store.getState(), {
      get(target, prop, receiver) {
        switch (prop) {
          case 'getInternalNodeById':
            return (id: string) => {
              subscription.props.add(`n-${id}`);
              return target.nodeLookup.get(id);
            };
          case 'getEdgeById':
            return (id: string) => {
              subscription.props.add(`e-${id}`);
              return target.edgeLookup.get(id);
            };
          case 'nodeLookup':
            subscription.props.add('nodes');
            return;
          // falls through
          default:
            subscription.props.add(prop);
            return Reflect.get(target, prop, receiver);
        }
      },
    });
  }

  store.subscribeTracked = () => {
    const subscription: Subscription = { props: new Set<PropertyKey>(), callback: noop };
    return {
      subscribe: (callback) => {
        subscription.callback = callback;
        subscriptions.add(subscription);
        return () => {
          subscriptions.delete(subscription);
          subscription.callback = noop;
        };
      },
      getState: () => getProxiedState(subscription),
    };
  };

  return initializer(store.setState, get, store);
};

export const middleware = middlewareImpl as unknown as Middleware;
