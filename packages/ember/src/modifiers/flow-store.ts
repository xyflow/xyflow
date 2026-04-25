import { modifier } from 'ember-modifier';

import type EmberFlowStore from '../store/index.js';
import { registerFlowStore, unregisterFlowStore } from '../store/context.js';

export default modifier<Element, [EmberFlowStore<any, any>]>((element, [store]) => {
  registerFlowStore(element, store);

  return () => {
    unregisterFlowStore(element);
  };
});
