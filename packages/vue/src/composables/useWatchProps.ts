import type { Connection } from '@xyflow/system';
import type { Ref, ToRefs } from 'vue';
import type { Edge, FlowProps, Node, VueFlowStoreHandle } from '../types';
import { mergeAriaLabelConfig } from '@xyflow/system';
import { effectScope, isRef, toRaw, toRef, watch } from 'vue';
import { isDef } from '../utils';
import { storeToRefs } from './storeToRefs';

/**
 * Two-way bind a `v-model` array ref to the store's canonical `shallowRef` (never the v-model ref itself).
 *
 * - **out** (store → model): snapshot on every membership change; element refs are shared, so per-node
 *   field mutations surface without a copy.
 * - **in** (model → store): adopt externally-assigned arrays via `setItems`, skipping our own snapshot.
 *
 * Both directions flush synchronously so the model ref and the store's synchronous reads never disagree.
 */
function syncModelArray<ModelItem, StoreItem>(
  model: Ref<ModelItem[] | undefined> | undefined,
  storeItems: Ref<StoreItem[]>,
  setItems: (items: ModelItem[]) => void,
  syncBack: boolean,
) {
  if (!model) {
    return;
  }

  // the array we last pushed store → model; the `in` watcher skips it so the snapshot doesn't loop back
  let lastSnapshot: ModelItem[] | undefined;

  // OUT (store → model): only for a managed binding (`v-model`). A controlled one-way `:nodes` owns its
  // own array, so we never write back to it — we only adopt reassignments IN (below).
  // `flush: 'sync'` so the v-model ref mirrors a store commit on the same tick as the synchronous reads;
  // seed the model only if the store already holds elements.
  if (syncBack) {
    watch(
      [storeItems, () => storeItems.value.length],
      () => {
        lastSnapshot = [...storeItems.value] as unknown as ModelItem[];
        model.value = lastSnapshot;
      },
      { immediate: storeItems.value.length > 0, flush: 'sync' },
    );
  }

  watch(
    [model, () => model.value?.length],
    ([next]) => {
      if (!Array.isArray(next)) {
        return;
      }

      // compare raw identities: a deep model ref hands our snapshot back as a proxy that fails `===`,
      // looping snapshot → setItems → snapshot forever
      const nextRaw = toRaw(next);
      if (nextRaw === lastSnapshot) {
        return;
      }

      setItems(nextRaw);
    },
    // `flush: 'sync'` so an external `nodes.value = [...]` is adopted immediately, keeping both sides on the same tick
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
 * @param syncBack per-collection managed flag — a managed binding (`v-model`) mirrors store changes back to
 *   the model ref; a controlled one-way `:nodes` does not
 */
export function useWatchProps<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  models: ToRefs<Pick<FlowProps<NodeType, EdgeType>, 'nodes' | 'edges'>>,
  props: FlowProps<NodeType, EdgeType>,
  handle: VueFlowStoreHandle<NodeType, EdgeType>,
  syncBack: { nodes: boolean; edges: boolean },
) {
  const { instance, state } = handle;
  // refs over the reactive state (writable) so the prop→store sync below can assign as before
  const storeRefs = storeToRefs(state);

  const scope = effectScope(true);

  scope.run(() => {
    // Bridge the v-model nodes/edges refs to the store's internal canonical signals (both store paths).
    const watchNodesValue = () => {
      scope.run(() => {
        syncModelArray(models.nodes, storeRefs.nodes, nodes => instance.setNodes(nodes), syncBack.nodes);
      });
    };

    const watchEdgesValue = () => {
      scope.run(() => {
        syncModelArray(models.edges, storeRefs.edges, edges => instance.setEdges(edges), syncBack.edges);
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
            // merge over defaults so unspecified keys keep their default text (watchRest would assign the partial verbatim)
            state.ariaLabelConfig = mergeAriaLabelConfig(ariaLabelConfig);
          },
          { immediate: true },
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
      watchNodesValue();
      watchEdgesValue();
      watchMinZoom();
      watchMaxZoom();
      watchTranslateExtent();
      watchNodeExtent();
      watchAutoConnect();
      watchAriaLabelConfig();
      watchRest();
    };

    runAll();
  });

  return () => scope.stop();
}
