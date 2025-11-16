/**
 * Pushbutton Component Simulator
 *
 * Simulates a pushbutton that connects/disconnects pins when pressed
 */

import type { Node } from '@xyflow/react';
import type {
  ComponentSimulator,
  ComponentState,
  SimulationState,
  PinState,
} from '../types';

export class PushbuttonSimulator implements ComponentSimulator {
  nodeType = 'pushbutton';

  initialize(node: Node, state: SimulationState): ComponentState {
    const pins = new Map<string, PinState>();

    // Pushbutton typically has 4 pins, but acts as 2 pairs
    // When pressed, pin1 connects to pin2, pin3 connects to pin4
    pins.set('1', {
      pinName: '1',
      signalType: 'digital',
      value: 'LOW',
    });

    pins.set('2', {
      pinName: '2',
      signalType: 'digital',
      value: 'LOW',
    });

    pins.set('3', {
      pinName: '3',
      signalType: 'digital',
      value: 'LOW',
    });

    pins.set('4', {
      pinName: '4',
      signalType: 'digital',
      value: 'LOW',
    });

    return {
      nodeId: node.id,
      nodeType: this.nodeType,
      pins,
      internalState: {
        pressed: node.data?.pressed || false,
      },
    };
  }

  update(
    componentState: ComponentState,
    changedPins: string[],
    state: SimulationState
  ): boolean {
    const pin1 = componentState.pins.get('1');
    const pin2 = componentState.pins.get('2');
    const pin3 = componentState.pins.get('3');
    const pin4 = componentState.pins.get('4');

    if (!pin1 || !pin2 || !pin3 || !pin4) return false;

    const pressed = componentState.internalState.pressed;

    let changed = false;

    if (pressed) {
      // When pressed, connect pin pairs
      // Pins 1-2 are connected
      if (pin1.value === 'HIGH' && pin2.value !== 'HIGH') {
        pin2.value = 'HIGH';
        changed = true;
      }
      if (pin2.value === 'HIGH' && pin1.value !== 'HIGH') {
        pin1.value = 'HIGH';
        changed = true;
      }

      // Pins 3-4 are connected
      if (pin3.value === 'HIGH' && pin4.value !== 'HIGH') {
        pin4.value = 'HIGH';
        changed = true;
      }
      if (pin4.value === 'HIGH' && pin3.value !== 'HIGH') {
        pin3.value = 'HIGH';
        changed = true;
      }
    } else {
      // When not pressed, pins are disconnected
      // Outputs go to LOW (pulled down)
      if (pin2.value !== 'LOW') {
        pin2.value = 'LOW';
        changed = true;
      }
      if (pin4.value !== 'LOW') {
        pin4.value = 'LOW';
        changed = true;
      }
    }

    return changed;
  }

  getVisualState(componentState: ComponentState): Record<string, any> {
    return {
      pressed: componentState.internalState.pressed,
    };
  }
}
