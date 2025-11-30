import type { Node } from '@xyflow/react';
import type {
    ComponentSimulator,
    ComponentState,
    SimulationState,
    PinState,
} from './types';

export { ESP32Simulator } from './ESP32Simulator';

/**
 * Battery Simulator
 * Provides a constant voltage source.
 */
export const BatterySimulator: ComponentSimulator = {
    nodeType: 'battery',

    initialize(node: Node, state: SimulationState): ComponentState {
        const pins = new Map<string, PinState>();
        pins.set('pos', {
            pinName: 'pos',
            signalType: 'power',
            voltage: node.data.voltage ? Number(node.data.voltage) : 9,
            current: 0,
        });
        pins.set('neg', {
            pinName: 'neg',
            signalType: 'ground',
            voltage: 0,
            current: 0,
        });

        return {
            nodeId: node.id,
            nodeType: 'battery',
            pins,
            health: 'OK',
            specs: {
                voltage: node.data.voltage ? Number(node.data.voltage) : 9,
            },
            internalState: {
                handleToPin: {
                    'pos': 'pos',
                    'neg': 'neg',
                },
            },
        };
    },

    update(component: ComponentState, state: SimulationState): void {
        // Battery doesn't change state based on inputs, it drives them.
        // However, we could check for short circuits here (high current).
    },

    getVisualState(component: ComponentState): Record<string, any> {
        return {};
    },
};

/**
 * Resistor Simulator
 * Passive component that limits current.
 */
export const ResistorSimulator: ComponentSimulator = {
    nodeType: 'resistor',

    initialize(node: Node, state: SimulationState): ComponentState {
        const pins = new Map<string, PinState>();
        pins.set('1', { pinName: '1', signalType: 'analog', voltage: 0, current: 0 });
        pins.set('2', { pinName: '2', signalType: 'analog', voltage: 0, current: 0 });

        return {
            nodeId: node.id,
            nodeType: 'resistor',
            pins,
            health: 'OK',
            specs: {
                resistance: node.data.resistance ? Number(node.data.resistance) : 1000, // 1k default
                powerRating: 0.25, // 1/4 Watt
            },
            internalState: {
                handleToPin: {
                    '1-source': '1',
                    '1-target': '1',
                    '2-source': '2',
                    '2-target': '2',
                },
            },
        };
    },

    solve(component: ComponentState, state: SimulationState): void {
        const resistance = component.specs.resistance || 1000;
        const p1 = component.pins.get('1');
        const p2 = component.pins.get('2');

        if (p1 && p2) {
            // Simple voltage propagation for series circuit
            // If one side is 0 and other is >0, we assume it's a load
            // But for now, let's just calculate current
            const vDiff = p1.voltage - p2.voltage;
            const current = (vDiff / resistance) * 1000; // mA

            p1.current = current;
            p2.current = -current;

            // If we have current, we can update voltage? 
            // In a real solver, we don't update voltage here for a resistor
            // unless we are doing a forward pass.
            // But for the "event loop" style, if p1 has voltage and p2 is 0 (and not ground),
            // maybe we should pass something?
            // Let's leave it for now, the switch propagation might be enough for the LED
            // if the LED is connected to ground.
            // Check power
            const power = (vDiff * vDiff) / resistance; // Watts
            if (power > (component.specs.powerRating || 0.25)) {
                component.health = 'BLOWN';
            }
        }
    },

    update(component: ComponentState, state: SimulationState): void {
        // Check health
        if (component.health === 'BLOWN') {
            // Maybe disconnect pins?
        }
    },

    getVisualState(component: ComponentState): Record<string, any> {
        return {
            blown: component.health === 'BLOWN',
        };
    },
};

/**
 * LED Simulator
 * Light Emitting Diode. Light up if forward biased. Blow up if too much current/voltage.
 */
export const LEDSimulator: ComponentSimulator = {
    nodeType: 'led',
    initialize(node: Node, state: SimulationState): ComponentState {
        const pins = new Map<string, PinState>();
        pins.set('anode', { pinName: 'anode', signalType: 'analog', voltage: 0, current: 0 });
        pins.set('cathode', { pinName: 'cathode', signalType: 'analog', voltage: 0, current: 0 });

        return {
            nodeId: node.id,
            nodeType: 'led',
            pins,
            health: 'OK',
            specs: {
                forwardVoltage: 2.0, // Red LED approx
                maxCurrent: 20, // 20mA
                breakdownVoltage: 5.0, // Reverse breakdown
            },
            internalState: {
                brightness: 0,
                handleToPin: {
                    'A-source': 'anode',
                    'A-target': 'anode',
                    'C-source': 'cathode',
                    'C-target': 'cathode',
                },
            },
        };
    },

    solve(component: ComponentState, state: SimulationState): void {
        // MNA solver handles voltage calculation
        // This method is not used in MNA approach
    },

    update(component: ComponentState, state: SimulationState): void {
        const anode = component.pins.get('anode');
        const cathode = component.pins.get('cathode');
        const forwardVoltage = component.specs.forwardVoltage || 2.0;
        const maxCurrent = component.specs.maxCurrent || 20; // mA

        if (anode && cathode) {
            // Check if pins are connected (not NaN)
            if (isNaN(anode.voltage) || isNaN(cathode.voltage)) {
                component.internalState.brightness = 0;
                return;
            }

            const vDiff = anode.voltage - cathode.voltage;

            console.log(`💡 LED Update: anode=${anode.voltage.toFixed(3)}V, cathode=${cathode.voltage.toFixed(3)}V, vDiff=${vDiff.toFixed(3)}V`);

            // Check polarity and forward bias
            if (vDiff > forwardVoltage) {
                // LED is forward biased and conducting
                const resistance = 100; // Internal resistance when conducting
                const current = ((vDiff - forwardVoltage) / resistance) * 1000; // mA

                anode.current = current;
                cathode.current = -current;

                // Calculate brightness (0-1)
                const brightness = Math.min(current / maxCurrent, 1.0);
                component.internalState.brightness = brightness;

                console.log(`💡 LED ON: current=${current.toFixed(2)}mA, brightness=${brightness.toFixed(2)}`);

                // Check if overcurrent
                if (current > maxCurrent * 2) {
                    component.health = 'BLOWN';
                    component.internalState.brightness = 0;
                }
            } else {
                // LED is reverse biased or not conducting
                anode.current = 0;
                cathode.current = 0;
                component.internalState.brightness = 0;

                console.log(`💡 LED OFF: vDiff=${vDiff.toFixed(3)}V < forwardVoltage=${forwardVoltage}V`);

                // Check reverse breakdown
                if (vDiff < -(component.specs.breakdownVoltage || 5.0)) {
                    component.health = 'BLOWN';
                }
            }
        }

        // If already blown, ensure no current and no brightness
        if (component.health === 'BLOWN') {
            if (anode) anode.current = 0;
            if (cathode) cathode.current = 0;
            component.internalState.brightness = 0;
        }
    },

    getVisualState(component: ComponentState): Record<string, any> {
        return {
            brightness: component.internalState.brightness,
            blown: component.health === 'BLOWN',
        };
    },
};

/**
 * Pushbutton Simulator
 * Acts as a variable resistor: Low resistance when pressed, High when released.
 */
export const PushbuttonSimulator: ComponentSimulator = {
    nodeType: 'pushbutton',

    initialize(node: Node, state: SimulationState): ComponentState {
        const pins = new Map<string, PinState>();
        // Pair 1
        pins.set('1', { pinName: '1', signalType: 'analog', voltage: 0, current: 0 });
        pins.set('2', { pinName: '2', signalType: 'analog', voltage: 0, current: 0 });
        // Pair 2
        pins.set('3', { pinName: '3', signalType: 'analog', voltage: 0, current: 0 });
        pins.set('4', { pinName: '4', signalType: 'analog', voltage: 0, current: 0 });

        return {
            nodeId: node.id,
            nodeType: 'pushbutton',
            pins,
            health: 'OK',
            specs: {},
            internalState: {
                pressed: false,
                handleToPin: {
                    '1.l-source': '1',
                    '1.l-target': '1',
                    '1.r-source': '1',
                    '1.r-target': '1',
                    '2.l-source': '2',
                    '2.l-target': '2',
                    '2.r-source': '2',
                    '2.r-target': '2',
                },
            },
        };
    },

    solve(component: ComponentState, state: SimulationState): void {
        const pressed = component.internalState.pressed;
        const resistance = pressed ? 0.1 : 1000000; // 0.1 Ohm vs 1 MOhm

        // Pair 1: 1-2
        const p1 = component.pins.get('1');
        const p2 = component.pins.get('2');
        if (p1 && p2) {
            if (pressed) {
                // Short circuit: equalize voltages
                const maxV = Math.max(p1.voltage, p2.voltage);
                p1.voltage = maxV;
                p2.voltage = maxV;
            }

            const vDiff = p1.voltage - p2.voltage;
            const current = (vDiff / resistance) * 1000; // mA
            p1.current = current;
            p2.current = -current;
        }

        // Pair 2: 3-4
        const p3 = component.pins.get('3');
        const p4 = component.pins.get('4');
        if (p3 && p4) {
            if (pressed) {
                // Short circuit: equalize voltages
                const maxV = Math.max(p3.voltage, p4.voltage);
                p3.voltage = maxV;
                p4.voltage = maxV;
            }

            const vDiff = p3.voltage - p4.voltage;
            const current = (vDiff / resistance) * 1000; // mA
            p3.current = current;
            p4.current = -current;
        }
    },

    update(component: ComponentState, state: SimulationState): void {
        const pressed = component.internalState.pressed || false;
        const resistance = pressed ? 0.1 : 1000000;

        // Calculate currents from solved voltages
        const p1 = component.pins.get('1');
        const p2 = component.pins.get('2');
        if (p1 && p2) {
            const vDiff = p1.voltage - p2.voltage;
            const current = (vDiff / resistance) * 1000; // mA
            p1.current = current;
            p2.current = -current;
        }

        const p3 = component.pins.get('3');
        const p4 = component.pins.get('4');
        if (p3 && p4) {
            const vDiff = p3.voltage - p4.voltage;
            const current = (vDiff / resistance) * 1000; // mA
            p3.current = current;
            p4.current = -current;
        }
    },

    getVisualState(component: ComponentState): Record<string, any> {
        return {
            pressed: component.internalState.pressed,
        };
    },
};
