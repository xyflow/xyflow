# Circuit Simulation Guide

This guide explains how to add circuit simulation to your React Flow-based hardware designer.

## Architecture

The simulation system has three main parts:

1. **Simulation Engine** - Core logic for propagating signals
2. **Component Simulators** - Define how each component behaves
3. **React Hook** - Integration with React Flow

## Quick Start

### 1. Set up the simulation

```tsx
import { ReactFlow, useSimulation } from '@xyflow/react';
import { LEDSimulator } from '@xyflow/react/simulation';
import { PushbuttonSimulator } from '@xyflow/react/simulation';
import { ArduinoSimulator } from '@xyflow/react/simulation';

function CircuitDesigner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Initialize simulation
  const simulation = useSimulation({
    debug: true,
    updateInterval: 50, // Update every 50ms
  });

  // Register component simulators
  useEffect(() => {
    simulation.registerSimulator(new LEDSimulator());
    simulation.registerSimulator(new PushbuttonSimulator());
    simulation.registerSimulator(new ArduinoSimulator());
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <Panel position="top-left">
        <button onClick={simulation.toggle}>
          {simulation.isRunning ? 'Stop' : 'Start'} Simulation
        </button>
        <button onClick={simulation.step}>Step</button>
        <button onClick={simulation.reset}>Reset</button>
      </Panel>
    </ReactFlow>
  );
}
```

### 2. Update LED component to respond to simulation

```tsx
// LEDNode.tsx
import { memo, useEffect, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useSimulation } from '@xyflow/react/simulation';

const LEDNode = ({ id }: NodeProps) => {
  const simulation = useSimulation();
  const [brightness, setBrightness] = useState(0);
  const [glowing, setGlowing] = useState(false);

  // Update visual state from simulation
  useEffect(() => {
    if (!simulation.state) return;

    const visualStates = simulation.getVisualStates();
    const ledState = visualStates.get(id);

    if (ledState) {
      setBrightness(ledState.brightness || 0);
      setGlowing(ledState.glowing || false);
    }
  }, [simulation.state, id]);

  return (
    <div style={{ position: 'relative' }}>
      <Handle type="target" position={Position.Left} id="anode" />
      <Handle type="target" position={Position.Right} id="cathode" />

      <svg width="60" height="60">
        {/* LED glow effect */}
        {glowing && (
          <circle
            cx="30"
            cy="30"
            r="20"
            fill="#ff0000"
            opacity={brightness * 0.5}
            filter="blur(10px)"
          />
        )}

        {/* LED body */}
        <circle
          cx="30"
          cy="30"
          r="10"
          fill={`rgba(255, 0, 0, ${0.3 + brightness * 0.7})`}
          stroke="#666"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default memo(LEDNode);
```

### 3. Make buttons interactive during simulation

```tsx
// PushbuttonNode.tsx
const PushbuttonNode = ({ id }: NodeProps) => {
  const simulation = useSimulation();
  const [pressed, setPressed] = useState(false);

  const handleMouseDown = () => {
    setPressed(true);
    // Update simulation state
    simulation.updateComponentInput(id, 'pressed', true);
  };

  const handleMouseUp = () => {
    setPressed(false);
    simulation.updateComponentInput(id, 'pressed', false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        cursor: 'pointer',
        transform: pressed ? 'translateY(2px)' : 'none',
      }}
    >
      <svg width="60" height="60">
        <circle cx="30" cy="30" r="15" fill={pressed ? '#999' : '#ccc'} />
      </svg>
      <Handle type="source" position={Position.Left} id="1" />
      <Handle type="source" position={Position.Right} id="2" />
    </div>
  );
};
```

## Example: Blink Circuit

Here's a complete example of a simple LED blink circuit:

```tsx
import { useState, useEffect } from 'react';
import { ReactFlow, useNodesState, useEdgesState, Panel } from '@xyflow/react';
import { useSimulation } from '@xyflow/react/simulation';
import { LEDSimulator, ArduinoSimulator } from '@xyflow/react/simulation';

const initialNodes = [
  {
    id: 'arduino',
    type: 'arduinoUno',
    position: { x: 100, y: 100 },
    data: {
      program: `
        // BLINK
        void setup() {
          pinMode(13, OUTPUT);
        }
        void loop() {
          digitalWrite(13, HIGH);
          delay(1000);
          digitalWrite(13, LOW);
          delay(1000);
        }
      `,
    },
  },
  {
    id: 'led',
    type: 'led',
    position: { x: 400, y: 100 },
    data: { color: '#ff0000' },
  },
  {
    id: 'gnd',
    type: 'gnd',
    position: { x: 400, y: 200 },
  },
];

const initialEdges = [
  {
    id: 'e1',
    source: 'arduino',
    sourceHandle: 'D13',
    target: 'led',
    targetHandle: 'anode',
  },
  {
    id: 'e2',
    source: 'led',
    sourceHandle: 'cathode',
    target: 'gnd',
    targetHandle: 'gnd',
  },
];

export default function BlinkExample() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const simulation = useSimulation({ debug: true });

  useEffect(() => {
    simulation.registerSimulator(new LEDSimulator());
    simulation.registerSimulator(new ArduinoSimulator());
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Panel position="top-right">
          <button onClick={simulation.toggle}>
            {simulation.isRunning ? '⏸ Pause' : '▶ Run'} Simulation
          </button>
          <button onClick={simulation.reset}>🔄 Reset</button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
```

## Creating Custom Component Simulators

To simulate your own components, implement the `ComponentSimulator` interface:

```tsx
import type { ComponentSimulator, ComponentState, SimulationState } from '@xyflow/react/simulation';

export class BuzzerSimulator implements ComponentSimulator {
  nodeType = 'buzzer';

  initialize(node, state) {
    const pins = new Map();
    pins.set('+', { pinName: '+', signalType: 'digital', value: 'LOW' });
    pins.set('-', { pinName: '-', signalType: 'power', value: 'LOW' });

    return {
      nodeId: node.id,
      nodeType: this.nodeType,
      pins,
      internalState: {
        sounding: false,
        frequency: 1000, // Hz
      },
    };
  }

  update(componentState, changedPins, state) {
    const plus = componentState.pins.get('+');
    const minus = componentState.pins.get('-');

    if (!plus || !minus) return false;

    // Buzzer sounds when + is HIGH and - is LOW
    const shouldSound = plus.value === 'HIGH' && minus.value === 'LOW';
    const changed = componentState.internalState.sounding !== shouldSound;

    if (changed) {
      componentState.internalState.sounding = shouldSound;

      // Play sound (using Web Audio API)
      if (shouldSound) {
        this.playTone(componentState.internalState.frequency);
      } else {
        this.stopTone();
      }
    }

    return changed;
  }

  getVisualState(componentState) {
    return {
      sounding: componentState.internalState.sounding,
    };
  }

  private audioContext?: AudioContext;
  private oscillator?: OscillatorNode;

  private playTone(frequency: number) {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.frequency.value = frequency;
    this.oscillator.connect(this.audioContext.destination);
    this.oscillator.start();
  }

  private stopTone() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator = undefined;
    }
  }
}
```

## Advanced: PWM Simulation

For analog components like servos that use PWM:

```tsx
export class ServoSimulator implements ComponentSimulator {
  nodeType = 'servo';

  initialize(node, state) {
    const pins = new Map();
    pins.set('PWM', { pinName: 'PWM', signalType: 'pwm', value: { frequency: 50, dutyCycle: 0.075 } });
    pins.set('VCC', { pinName: 'VCC', signalType: 'power', value: 'HIGH' });
    pins.set('GND', { pinName: 'GND', signalType: 'power', value: 'LOW' });

    return {
      nodeId: node.id,
      nodeType: this.nodeType,
      pins,
      internalState: {
        angle: 90, // degrees (0-180)
      },
    };
  }

  update(componentState, changedPins, state) {
    const pwmPin = componentState.pins.get('PWM');
    if (!pwmPin || typeof pwmPin.value === 'string') return false;

    // Convert PWM duty cycle to servo angle
    // Typical servo: 1ms = 0°, 1.5ms = 90°, 2ms = 180°
    const dutyCycle = pwmPin.value.dutyCycle;
    const pulseWidth = dutyCycle * 20; // 20ms period for 50Hz
    const angle = ((pulseWidth - 1) / 1) * 180; // Map 1-2ms to 0-180°

    const newAngle = Math.max(0, Math.min(180, angle));
    const changed = componentState.internalState.angle !== newAngle;

    componentState.internalState.angle = newAngle;

    return changed;
  }

  getVisualState(componentState) {
    return {
      angle: componentState.internalState.angle,
    };
  }
}
```

## Tips

1. **Start Simple** - Begin with digital-only simulation (HIGH/LOW)
2. **Add Gradually** - Add analog, PWM, I2C as needed
3. **Use requestAnimationFrame** - For smooth visual updates
4. **Debounce Updates** - Don't update too frequently (50-100ms is usually fine)
5. **Debug Mode** - Enable `debug: true` to see signal propagation
6. **Web Audio API** - Use for buzzers and speakers
7. **Canvas/SVG** - Use for displays (OLED, LCD, 7-segment)

## Next Steps

1. Implement more component simulators (resistor, capacitor, transistor)
2. Add Arduino code interpreter (or use existing libraries like AVR8js)
3. Add SPICE integration for analog circuits
4. Add oscilloscope/logic analyzer visualization
5. Add circuit validation (short circuit detection, voltage checks)
6. Export simulation results (waveforms, timing diagrams)
