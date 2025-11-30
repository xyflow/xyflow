import type { Node } from '@xyflow/react';
import type {
    ComponentSimulator,
    ComponentState,
    SimulationState,
    PinState,
} from './types';

/**
 * ESP32 Virtual Machine
 * Executes Arduino code and controls GPIO pins
 */
class ESP32VirtualMachine {
    private pinModes: Map<number, 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP'> = new Map();
    private pinValues: Map<number, number> = new Map(); // 0-1023 for analog, 0-1 for digital
    private serialBuffer: string[] = [];
    private loopInterval: number | null = null;
    private setupExecuted = false;

    // Arduino code to execute
    private code: string = '';

    // Pin name to number mapping (ESP32 specific)
    private pinMapping: Map<string, number> = new Map([
        // Common ESP32 DevKit V1 pins
        ['D2', 2], ['D4', 4], ['D5', 5], ['D12', 12], ['D13', 13],
        ['D14', 14], ['D15', 15], ['D18', 18], ['D19', 19], ['D21', 21],
        ['D22', 22], ['D23', 23], ['D25', 25], ['D26', 26], ['D27', 27],
        ['D32', 32], ['D33', 33], ['D34', 34], ['D35', 35],
        // Legacy pin names
        ['LED_BUILTIN', 2],
    ]);

    constructor(code: string) {
        this.code = code;
        this.initializePins();
    }

    private initializePins() {
        // Initialize all pins as floating (undefined)
        for (let i = 0; i <= 39; i++) {
            this.pinValues.set(i, 0);
        }
    }

    /**
     * Parse and extract pin definitions from code
     */
    private parsePinDefinitions(): Map<string, number> {
        const defines = new Map<string, number>();

        // Parse #define statements
        const defineRegex = /#define\s+(\w+)\s+(\d+)/g;
        let match;

        while ((match = defineRegex.exec(this.code)) !== null) {
            const pinName = match[1];
            const pinNumber = parseInt(match[2]);
            defines.set(pinName, pinNumber);
        }

        // Parse const int statements
        const constIntRegex = /const\s+int\s+(\w+)\s*=\s*(\d+)/g;
        while ((match = constIntRegex.exec(this.code)) !== null) {
            const pinName = match[1];
            const pinNumber = parseInt(match[2]);
            defines.set(pinName, pinNumber);
        }

        return defines;
    }

    /**
     * Execute pinMode() calls from setup()
     */
    private executeSetup() {
        if (this.setupExecuted) return;

        const setupMatch = this.code.match(/void\s+setup\s*\(\s*\)\s*\{([^}]*)\}/s);
        if (!setupMatch) return;

        const setupCode = setupMatch[1];
        const pinDefines = this.parsePinDefinitions();

        // Parse pinMode calls
        const pinModeRegex = /pinMode\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)/g;
        let match;

        while ((match = pinModeRegex.exec(setupCode)) !== null) {
            const pinNameOrNumber = match[1];
            const mode = match[2] as 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP';

            // Resolve pin number
            let pinNumber: number | undefined;
            if (pinDefines.has(pinNameOrNumber)) {
                pinNumber = pinDefines.get(pinNameOrNumber);
            } else if (this.pinMapping.has(pinNameOrNumber)) {
                pinNumber = this.pinMapping.get(pinNameOrNumber);
            } else {
                pinNumber = parseInt(pinNameOrNumber);
            }

            if (pinNumber !== undefined && !isNaN(pinNumber)) {
                this.pinModes.set(pinNumber, mode);
                console.log(`🔧 ESP32: pinMode(${pinNumber}, ${mode})`);
            }
        }

        this.setupExecuted = true;
    }

    /**
     * Execute loop() code once
     */
    executeLoop(inputs: Map<number, number>): Map<number, number> {
        const loopMatch = this.code.match(/void\s+loop\s*\(\s*\)\s*\{([^}]*)\}/s);
        if (!loopMatch) return new Map();

        const loopCode = loopMatch[1];
        const pinDefines = this.parsePinDefinitions();
        const outputs = new Map<number, number>();

        // Update input pin values from circuit
        inputs.forEach((value, pin) => {
            this.pinValues.set(pin, value);
        });

        // Execute digitalRead calls and store in variables
        // Match patterns like: "buttonState = digitalRead(pin)" or "int buttonState = digitalRead(pin)"
        const digitalReadRegex = /(?:int\s+|const\s+int\s+)?(\w+)\s*=\s*digitalRead\s*\(\s*(\w+)\s*\)/g;
        const variables = new Map<string, number>();
        let match;

        while ((match = digitalReadRegex.exec(loopCode)) !== null) {
            const varName = match[1];
            const pinNameOrNumber = match[2];

            const pinNumber = this.resolvePinNumber(pinNameOrNumber, pinDefines);
            if (pinNumber !== undefined) {
                const value = this.pinValues.get(pinNumber) || 0;
                variables.set(varName, value > 0.5 ? 1 : 0); // HIGH or LOW
                console.log(`📖 ESP32: digitalRead(${pinNumber}) = ${value > 0.5 ? 'HIGH' : 'LOW'}`);
            }
        }

        // Execute digitalWrite calls (handle NOT operator too)
        const digitalWriteRegex = /digitalWrite\s*\(\s*(\w+)\s*,\s*(!)?(\w+)\s*\)/g;

        while ((match = digitalWriteRegex.exec(loopCode)) !== null) {
            const pinNameOrNumber = match[1];
            const notOperator = match[2]; // Will be '!' or undefined
            const valueNameOrLiteral = match[3];

            const pinNumber = this.resolvePinNumber(pinNameOrNumber, pinDefines);
            if (pinNumber !== undefined) {
                let value = 0;

                // Check if it's a variable or literal
                if (valueNameOrLiteral === 'HIGH' || valueNameOrLiteral === '1') {
                    value = 1;
                } else if (valueNameOrLiteral === 'LOW' || valueNameOrLiteral === '0') {
                    value = 0;
                } else if (variables.has(valueNameOrLiteral)) {
                    value = variables.get(valueNameOrLiteral) || 0;
                }

                // Apply NOT operator if present
                if (notOperator === '!') {
                    value = value === 0 ? 1 : 0;
                }

                this.pinValues.set(pinNumber, value);
                outputs.set(pinNumber, value);
                console.log(`✍️ ESP32: digitalWrite(${pinNumber}, ${value === 1 ? 'HIGH' : 'LOW'})`);
            }
        }

        // Execute conditional logic (simple if statements)
        this.executeConditionals(loopCode, variables, pinDefines, outputs);

        return outputs;
    }

    /**
     * Execute simple if statements
     */
    private executeConditionals(
        code: string,
        variables: Map<string, number>,
        pinDefines: Map<string, number>,
        outputs: Map<number, number>
    ) {
        // Match: if (var == LOW) { digitalWrite(pin, HIGH); }
        const ifRegex = /if\s*\(\s*(\w+)\s*(==|!=)\s*(\w+)\s*\)\s*\{([^}]*)\}/g;
        let match;

        while ((match = ifRegex.exec(code)) !== null) {
            const varName = match[1];
            const operator = match[2];
            const compareTo = match[3];
            const thenBlock = match[4];

            const varValue = variables.get(varName);
            if (varValue === undefined) continue;

            let compareValue = 0;
            if (compareTo === 'LOW' || compareTo === '0') {
                compareValue = 0;
            } else if (compareTo === 'HIGH' || compareTo === '1') {
                compareValue = 1;
            }

            let condition = false;
            if (operator === '==') {
                condition = varValue === compareValue;
            } else if (operator === '!=') {
                condition = varValue !== compareValue;
            }

            console.log(`🔀 ESP32: Evaluating if (${varName}[${varValue}] ${operator} ${compareTo}[${compareValue}]) = ${condition}`);

            if (condition) {
                // Execute digitalWrite in then block
                const writeRegex = /digitalWrite\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)/g;
                let writeMatch;

                while ((writeMatch = writeRegex.exec(thenBlock)) !== null) {
                    const pinNameOrNumber = writeMatch[1];
                    const valueNameOrLiteral = writeMatch[2];

                    const pinNumber = this.resolvePinNumber(pinNameOrNumber, pinDefines);
                    if (pinNumber !== undefined) {
                        let value = 0;
                        if (valueNameOrLiteral === 'HIGH' || valueNameOrLiteral === '1') {
                            value = 1;
                        }

                        this.pinValues.set(pinNumber, value);
                        outputs.set(pinNumber, value);
                        console.log(`🎯 ESP32 (conditional): digitalWrite(${pinNumber}, ${value === 1 ? 'HIGH' : 'LOW'})`);
                    }
                }
            } else {
                // Execute else block if exists
                const elseMatch = code.match(new RegExp(`if\\s*\\(\\s*${varName}\\s*${operator}\\s*${compareTo}\\s*\\)\\s*\\{[^}]*\\}\\s*else\\s*\\{([^}]*)\\}`));
                if (elseMatch) {
                    const elseBlock = elseMatch[1];
                    const writeRegex = /digitalWrite\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)/g;
                    let writeMatch;

                    while ((writeMatch = writeRegex.exec(elseBlock)) !== null) {
                        const pinNameOrNumber = writeMatch[1];
                        const valueNameOrLiteral = writeMatch[2];

                        const pinNumber = this.resolvePinNumber(pinNameOrNumber, pinDefines);
                        if (pinNumber !== undefined) {
                            let value = 0;
                            if (valueNameOrLiteral === 'LOW' || valueNameOrLiteral === '0') {
                                value = 0;
                            }

                            this.pinValues.set(pinNumber, value);
                            outputs.set(pinNumber, value);
                            console.log(`🎯 ESP32 (else): digitalWrite(${pinNumber}, ${value === 1 ? 'HIGH' : 'LOW'})`);
                        }
                    }
                }
            }
        }
    }

    private resolvePinNumber(nameOrNumber: string, defines: Map<string, number>): number | undefined {
        if (defines.has(nameOrNumber)) {
            return defines.get(nameOrNumber);
        } else if (this.pinMapping.has(nameOrNumber)) {
            return this.pinMapping.get(nameOrNumber);
        } else {
            const num = parseInt(nameOrNumber);
            return isNaN(num) ? undefined : num;
        }
    }

    /**
     * Public API: Run setup and start loop
     */
    start() {
        this.executeSetup();
    }

    /**
     * Public API: Run one iteration of loop
     */
    step(inputs: Map<number, number>): Map<number, number> {
        return this.executeLoop(inputs);
    }

    /**
     * Get current pin mode
     */
    getPinMode(pin: number): 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP' | undefined {
        return this.pinModes.get(pin);
    }
}

/**
 * ESP32 DevKit V1 Simulator
 */
export const ESP32Simulator: ComponentSimulator = {
    nodeType: 'esp32DevkitV1',

    initialize(node: Node, state: SimulationState): ComponentState {
        const pins = new Map<string, PinState>();

        // Initialize all GPIO pins
        const gpioPins = [
            'D2', 'D4', 'D5', 'D12', 'D13', 'D14', 'D15', 'D18', 'D19',
            'D21', 'D22', 'D23', 'D25', 'D26', 'D27', 'D32', 'D33', 'D34', 'D35'
        ];

        gpioPins.forEach(pinName => {
            pins.set(pinName, {
                pinName,
                signalType: 'digital',
                voltage: 0,
                current: 0,
            });
        });

        // Power pins
        pins.set('3V3', { pinName: '3V3', signalType: 'power', voltage: 3.3, current: 0 });
        pins.set('VIN', { pinName: 'VIN', signalType: 'power', voltage: 5, current: 0 });
        pins.set('GND.1', { pinName: 'GND.1', signalType: 'ground', voltage: 0, current: 0 });
        pins.set('GND.2', { pinName: 'GND.2', signalType: 'ground', voltage: 0, current: 0 });

        // Get code from node data or global state
        const code = (node.data as any).code || (state as any).arduinoCode || '';
        const vm = new ESP32VirtualMachine(code);

        if (code) {
            console.log('🚀 ESP32: Initializing VM with code:', code.substring(0, 100) + '...');
            vm.start(); // Execute setup()
        }

        return {
            nodeId: node.id,
            nodeType: 'esp32DevkitV1',
            pins,
            health: 'OK',
            specs: {
                cpuFrequency: 240, // MHz
                flashSize: 4, // MB
            },
            internalState: {
                vm,
                running: false,
                handleToPin: {
                    // Map handle IDs to pin names
                    'D2-source': 'D2', 'D2-target': 'D2',
                    'D4-source': 'D4', 'D4-target': 'D4',
                    'D5-source': 'D5', 'D5-target': 'D5',
                    // ... (add all pins)
                },
            },
        };
    },

    update(component: ComponentState, state: SimulationState): void {
        const vm = component.internalState.vm as ESP32VirtualMachine;
        if (!vm) {
            console.warn('⚠️ ESP32: No VM found');
            return;
        }

        // Start VM if not running
        if (!component.internalState.running) {
            console.log('🚀 ESP32: Starting VM...');
            vm.start();
            component.internalState.running = true;
        }

        // Collect inputs from connected pins
        const inputs = new Map<number, number>();
        console.log('🔍 ESP32: Reading all pin states...');
        component.pins.forEach((pinState, pinName) => {
            if (pinName.startsWith('D')) {
                const pinNumber = parseInt(pinName.substring(1));
                if (!isNaN(pinNumber)) {
                    // Convert voltage to digital value
                    const digitalValue = pinState.voltage > 2.0 ? 1 : 0;
                    inputs.set(pinNumber, digitalValue);
                    console.log(`  📥 D${pinNumber}: ${pinState.voltage.toFixed(2)}V → ${digitalValue === 1 ? 'HIGH' : 'LOW'}`);
                }
            }
        });

        console.log(`🔄 ESP32: Executing loop with ${inputs.size} inputs`);

        // Execute one loop iteration
        const outputs = vm.step(inputs);

        console.log(`📤 ESP32: Got ${outputs.size} outputs`);

        // Apply outputs to pins
        outputs.forEach((value, pinNumber) => {
            const pinName = `D${pinNumber}`;
            const pin = component.pins.get(pinName);
            if (pin) {
                // Convert digital value to voltage
                pin.voltage = value === 1 ? 3.3 : 0;
                console.log(`🔌 ESP32: Pin ${pinName} set to ${value === 1 ? 'HIGH' : 'LOW'} (${pin.voltage}V)`);
            }
        });
    },

    getVisualState(component: ComponentState): Record<string, any> {
        // Check if ESP32 is powered (VIN or 5V pin has voltage)
        const vinPin = component.pins.get('VIN');
        const v5Pin = component.pins.get('5V');
        const isPowered = (vinPin && vinPin.voltage > 3.0) || (v5Pin && v5Pin.voltage > 3.0);

        return {
            running: component.internalState.running || false,
            ledPower: isPowered, // Power LED indicator
        };
    },
};
