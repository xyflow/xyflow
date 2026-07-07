import type { Connection } from '@xyflow/system';
import type { Ref, ToRefs } from 'vue';
import type { Edge, FlowProps, Node, VueFlowStoreHandle } from '../types';
import { mergeAriaLabelConfig } from '@xyflow/system';
import { effectScope, isRef, toRaw, toRef, watch } from 'vue';
import { isDef } from '../utils';
import { storeToRefs } from './storeToRefs';

/**
 * Two-way bind a `v-model` array ref to the store, identity-in / snapshot-out, with native `watch`.
 *
 * Runs for BOTH the owned- and reused-store paths: the store's canonical nodes/edges are always an
 * internal `shallowRef` (see `createStore`), never the v-model ref, so this is the single place the model
 * ref is bridged to the store. Both directions flush synchronously so the model ref and the store's
 * synchronous reads (`getNodes`/`state.nodes`) never disagree within a tick.
 *
 * - **out** (store → model): snapshot on every membership change; element refs are shared, so per-node
 *   field mutations surface without a copy.
 * - **in** (model → store): adopt externally-assigned arrays via `setItems`, ignoring our own snapshot
 *   (identity check against `lastSnapshot`) — replacing the previous `@vueuse` `watchPausable` flag dance.
 */
function syncModelArray<ModelItem, StoreItem>(
  model: Ref<ModelItem[] | undefined> | undefined,
  storeItems: Ref<StoreItem[]>,
  setItems: (items: ModelItem[]) => void,
) {
  if (!model) {
    return;
  }

  // the array we last pushed store → model; the `in` watcher skips it so the snapshot doesn't loop back
  let lastSnapshot: ModelItem[] | undefined;

  watch(
    [storeItems, () => storeItems.value.length],
    () => {
      lastSnapshot = [...storeItems.value] as unknown as ModelItem[];
      model.value = lastSnapshot;
    },
    // `flush: 'sync'` so the user's v-model ref mirrors a store commit on the SAME tick (matching the
    // synchronous store reads) — otherwise it lags a flush behind `getNodes`, the reported footgun.
    // seed the model only if the store already holds elements (populated by `setState(props)` on create)
    { immediate: storeItems.value.length > 0, flush: 'sync' },
  );

  watch(
    [model, () => model.value?.length],
    ([next]) => {
      if (!Array.isArray(next)) {
        return;
      }

      // compare raw identities: a deep model `ref` hands our own snapshot back as its reactive proxy,
      // which would fail a plain `===` and loop snapshot → setItems → snapshot forever
      const nextRaw = toRaw(next);
      if (nextRaw === lastSnapshot) {
        return;
      }

      setItems(nextRaw);
    },
    // `flush: 'sync'` so an external `nodes.value = [...]` is adopted into the store immediately, keeping
    // the model ref and `getNodes` consistent on the same tick in both directions
    { immediate: true, flush: 'sync' },
  );
}

/**
 * Watches props and updates the store accordingly
 *
 * @internal
 * @param models v-model refs for nodes/edges — bridged to the store here (see {@link syncModelArray})
 * @param props the `<VueFlow>` props
 * @param handle the created store handle ({@link VueFlowStoreHandle}) — instance (actions) + reactive state
 */
export function useWatchProps<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  models: ToRefs<Pick<FlowProps<NodeType, EdgeType>, 'nodes' | 'edges'>>,
  props: FlowProps<NodeType, EdgeType>,
  handle: VueFlowStoreHandle<NodeType, EdgeType>,
) {
  const { instance, state } = handle;
  // refs over the reactive state (writable) so the prop→store sync below can assign as before
  const storeRefs = storeToRefs(state);

  const scope = effectScope(true);

  scope.run(() => {
    // Bridge the v-model nodes/edges refs to the store's internal canonical signals (both store paths).
    const watchNodesValue = () => {
      scope.run(() => {
        syncModelArray(models.nodes, storeRefs.nodes, nodes => instance.setNodes(nodes));
      });
    };

    const watchEdgesValue = () => {
      scope.run(() => {
        syncModelArray(models.edges, storeRefs.edges, edges => instance.setEdges(edges));
      });
    };

    const watchMaxZoom = () => {
      scope.run(() => {
        watch(
          () => props.maxZoom,
          (maxZoom) => {
            if (maxZoom && isDef(maxZoom)) {
              instance.setMaxZoom(maxZoom);
            }
          },
          {
            immediate: true,
          },
        );
      });
    };

    const watchMinZoom = () => {
      scope.run(() => {
        watch(
          () => props.minZoom,
          (minZoom) => {
            if (minZoom && isDef(minZoom)) {
              instance.setMinZoom(minZoom);
            }
          },
          { immediate: true },
        );
      });
    };

    const watchTranslateExtent = () => {
      scope.run(() => {
        watch(
          () => props.translateExtent,
          (translateExtent) => {
            if (translateExtent && isDef(translateExtent)) {
              instance.setTranslateExtent(translateExtent);
            }
          },
          {
            immediate: true,
          },
        );
      });
    };

    const watchNodeExtent = () => {
      scope.run(() => {
        watch(
          () => props.nodeExtent,
          (nodeExtent) => {
            if (nodeExtent && isDef(nodeExtent)) {
              instance.setNodeExtent(nodeExtent);
            }
          },
          {
            immediate: true,
          },
        );
      });
    };

    const watchAriaLabelConfig = () => {
      scope.run(() => {
        watch(
          () => props.ariaLabelConfig,
          (ariaLabelConfig) => {
            // merge over the defaults so unspecified keys keep their default text (handled here rather than
            // in `watchRest`, which would assign the partial verbatim and drop the defaults)
            state.ariaLabelConfig = mergeAriaLabelConfig(ariaLabelConfig);
          },
          { immediate: true },
        );
      });
    };

    const watchApplyDefault = () => {
      scope.run(() => {
        watch(
          () => props.autoApplyChanges,
          (autoApplyChanges) => {
            if (isDef(autoApplyChanges)) {
              storeRefs.autoApplyChanges.value = autoApplyChanges;
            }
          },
          {
            immediate: true,
          },
        );
      });
    };

    const watchAutoConnect = () => {
      scope.run(() => {
        const autoConnector = async (params: Connection) => {
          let connection: boolean | Connection = params;

          if (typeof props.autoConnect === 'function') {
            connection = await props.autoConnect(params);
          }

          if (connection !== false) {
            instance.addEdges([connection]);
          }
        };

        watch(
          () => props.autoConnect,
          (autConnect) => {
            if (isDef(autConnect)) {
              storeRefs.autoConnect.value = autConnect;
            }
          },
          { immediate: true },
        );

        watch(
          storeRefs.autoConnect,
          (autoConnectEnabled, _, onCleanup) => {
            if (autoConnectEnabled) {
              instance.onConnect(autoConnector);
            }
            else {
              state.hooks.connect.off(autoConnector);
            }

            onCleanup(() => {
              state.hooks.connect.off(autoConnector);
            });
          },
          { immediate: true },
        );
      });
    };

    const watchRest = () => {
      const skip: (keyof typeof props)[] = [
        'id',
        'translateExtent',
        'nodeExtent',
        'edges',
        'nodes',
        'maxZoom',
        'minZoom',
        'autoApplyChanges',
        'autoConnect',
        // `viewport` isn't a state field (it's a getter on the instance); `useViewportSync` two-way binds it
        'viewport',
        // merged (not assigned verbatim) by `watchAriaLabelConfig`
        'ariaLabelConfig',
      ];

      for (const key of Object.keys(props)) {
        const propKey = key as keyof typeof props;
        if (!skip.includes(propKey)) {
          const propValue = toRef(() => props[propKey]);

          const storeRef = storeRefs[propKey as keyof typeof storeRefs];

          if (isRef(storeRef)) {
            scope.run(() => {
              watch(
                propValue,
                (nextValue) => {
                  if (isDef(nextValue)) {
                    ;(storeRef.value as any) = nextValue;
                  }
                },
                { immediate: true },
              );
            });
          }
        }
      }
    };

    const runAll = () => {
      // both owned + reused stores bridge nodes/edges here — the store's canonical signal is always
      // internal, so the v-model ref is never the backing store and always needs syncing
      watchNodesValue();
      watchEdgesValue();
      watchMinZoom();
      watchMaxZoom();
      watchTranslateExtent();
      watchNodeExtent();
      watchApplyDefault();
      watchAutoConnect();
      watchAriaLabelConfig();
      watchRest();
    };

    runAll();
  });

  return () => scope.stop();
}
