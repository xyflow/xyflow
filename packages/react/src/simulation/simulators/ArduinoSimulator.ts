/**
 * Arduino Component Simulator
 *
 * Simulates an Arduino microcontroller with programmable pins
 */

import type { Node } from '@xyflow/react';
import type {
  ComponentSimulator,
  ComponentState,
  SimulationState,
  PinState,
  DigitalValue,
} from '../types';

export class ArduinoSimulator implements ComponentSimulator {
  nodeType = 'arduinoUno';

  initialize(node: Node, state: SimulationState): ComponentState {
    const pins = new Map<string, PinState>();

    // Digital pins (0-13)
    for (let i = 0; i <= 13; i++) {
      pins.set(`D${i}`, {
        pinName: `D${i}`,
        signalType: 'digital',
        value: 'LOW',
      });
    }

    // Analog pins (A0-A5)
    for (let i = 0; i <= 5; i++) {
      pins.set(`A${i}`, {
        pinName: `A${i}`,
        signalType: 'analog',
        value: 0,
      });
    }

    // Power pins
    pins.set('5V', {
      pinName: '5V',
      signalType: 'power',
      value: 'HIGH',
      voltage: 5.0,
    });

    pins.set('3.3V', {
      pinName: '3.3V',
      signalType: 'power',
      value: 'HIGH',
      voltage: 3.3,
    });

    pins.set('GND', {
      pinName: 'GND',
      signalType: 'power',
      value: 'LOW',
      voltage: 0,
    });

    return {
      nodeId: node.id,
      nodeType: this.nodeType,
      pins,
      internalState: {
        program: node.data?.program || null, // User's Arduino code
        pinModes: new Map<string, 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP'>(),
        builtInLED: false, // Pin 13 LED
      },
    };
  }

  update(
    componentState: ComponentState,
    changedPins: string[],
    state: SimulationState
  ): boolean {
    // Execute user program (simplified)
    // In a real implementation, this would run actual Arduino code
    // For now, we'll just handle basic pinMode and digitalWrite

    let changed = false;

    // Example: if program sets pin 13 HIGH, turn on built-in LED
    if (componentState.internalState.program) {
      const program = componentState.internalState.program;

      // Very simple parser (in reality, you'd use an interpreter)
      if (program.includes('digitalWrite(13, HIGH)')) {
        const pin13 = componentState.pins.get('D13');
        if (pin13 && pin13.value !== 'HIGH') {
          pin13.value = 'HIGH';
          componentState.internalState.builtInLED = true;
          changed = true;
        }
      } else if (program.includes('digitalWrite(13, LOW)')) {
        const pin13 = componentState.pins.get('D13');
        if (pin13 && pin13.value !== 'LOW') {
          pin13.value = 'LOW';
          componentState.internalState.builtInLED = false;
          changed = true;
        }
      }

      // Handle blink example
      if (program.includes('// BLINK')) {
        // Toggle pin 13 every second (handled by tick)
      }
    }

    // Read input pins and propagate to outputs based on program
    for (const changedPin of changedPins) {
      const pin = componentState.pins.get(changedPin);
      if (!pin) continue;

      // If it's an input pin, the program might react to it
      // This would be handled by the Arduino program interpreter
    }

    return changed;
  }

  tick(componentState: ComponentState, deltaTime: number, state: SimulationState): void {
    // Handle time-based operations (e.g., delay(), millis())
    if (!componentState.internalState.program) return;

    const program = componentState.internalState.program;

    // Example: Handle blink
    if (program.includes('// BLINK')) {
      if (!componentState.internalState.blinkTimer) {
        componentState.internalState.blinkTimer = 0;
      }

      componentState.internalState.blinkTimer += deltaTime;

      if (componentState.internalState.blinkTimer >= 1000) {
        // Toggle every 1000ms
        componentState.internalState.blinkTimer = 0;
        componentState.internalState.builtInLED = !componentState.internalState.builtInLED;

        const pin13 = componentState.pins.get('D13');
        if (pin13) {
          pin13.value = componentState.internalState.builtInLED ? 'HIGH' : 'LOW';
        }
      }
    }
  }

  getVisualState(componentState: ComponentState): Record<string, any> {
    return {
      builtInLED: componentState.internalState.builtInLED,
      pinStates: Object.fromEntries(
        Array.from(componentState.pins.entries()).map(([name, pin]) => [name, pin.value])
      ),
    };
  }

  /**
   * Helper to set a pin mode (called from user code)
   */
  pinMode(componentState: ComponentState, pin: string, mode: 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP'): void {
    componentState.internalState.pinModes.set(pin, mode);
  }

  /**
   * Helper to write to a digital pin (called from user code)
   */
  digitalWrite(componentState: ComponentState, pin: string, value: DigitalValue): void {
    const pinState = componentState.pins.get(pin);
    if (pinState) {
      pinState.value = value;
    }
  }

  /**
   * Helper to read from a digital pin (called from user code)
   */
  digitalRead(componentState: ComponentState, pin: string): DigitalValue {
    const pinState = componentState.pins.get(pin);
    return (pinState?.value as DigitalValue) || 'LOW';
  }
}
