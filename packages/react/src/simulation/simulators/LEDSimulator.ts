/**
 * LED Component Simulator
 *
 * Simulates an LED that lights up based on voltage/signal
 */

import type { Node } from '@xyflow/react';
import type {
  ComponentSimulator,
  ComponentState,
  SimulationState,
  PinState,
} from '../types';

export class LEDSimulator implements ComponentSimulator {
  nodeType = 'led';

  initialize(node: Node, state: SimulationState): ComponentState {
    const pins = new Map<string, PinState>();

    // LED has two pins: anode (+) and cathode (-)
    pins.set('anode', {
      pinName: 'anode',
      signalType: 'digital',
      value: 'LOW',
    });

    pins.set('cathode', {
      pinName: 'cathode',
      signalType: 'digital',
      value: 'LOW',
    });

    return {
      nodeId: node.id,
      nodeType: this.nodeType,
      pins,
      internalState: {
        brightness: 0, // 0-1
        color: node.data?.color || '#ff0000',
      },
    };
  }

  update(
    componentState: ComponentState,
    changedPins: string[],
    state: SimulationState
  ): boolean {
    const anode = componentState.pins.get('anode');
    const cathode = componentState.pins.get('cathode');

    if (!anode || !cathode) return false;

    // LED lights up when anode is HIGH and cathode is LOW (forward biased)
    const isOn = anode.value === 'HIGH' && cathode.value === 'LOW';

    const newBrightness = isOn ? 1.0 : 0.0;
    const changed = componentState.internalState.brightness !== newBrightness;

    componentState.internalState.brightness = newBrightness;

    return changed;
  }

  getVisualState(componentState: ComponentState): Record<string, any> {
    return {
      brightness: componentState.internalState.brightness,
      color: componentState.internalState.color,
      glowing: componentState.internalState.brightness > 0,
    };
  }
}
