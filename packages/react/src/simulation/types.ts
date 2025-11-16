/**
 * Circuit Simulation Types
 *
 * This module defines the types for simulating electronic circuits
 * built with React Flow nodes and edges.
 */

import type { Node, Edge } from '@xyflow/react';

/**
 * Signal types that can flow through wires
 */
export type SignalType = 'digital' | 'analog' | 'power' | 'pwm' | 'i2c' | 'spi' | 'uart';

/**
 * Digital signal values
 */
export type DigitalValue = 'HIGH' | 'LOW' | 'Z'; // Z = high impedance

/**
 * Analog signal (0-5V typically)
 */
export type AnalogValue = number;

/**
 * PWM signal
 */
export type PWMValue = {
  frequency: number; // Hz
  dutyCycle: number; // 0-1
};

/**
 * Generic signal value
 */
export type SignalValue = DigitalValue | AnalogValue | PWMValue;

/**
 * Pin state during simulation
 */
export interface PinState {
  pinName: string;
  signalType: SignalType;
  value: SignalValue;
  voltage?: number;
  current?: number;
}

/**
 * Component state during simulation
 */
export interface ComponentState {
  nodeId: string;
  nodeType: string;
  pins: Map<string, PinState>;
  internalState: Record<string, any>; // Component-specific state (e.g., LED brightness, servo angle)
}

/**
 * Wire/Connection state
 */
export interface WireState {
  edgeId: string;
  sourceNodeId: string;
  sourceHandle: string;
  targetNodeId: string;
  targetHandle: string;
  signalType: SignalType;
  value: SignalValue;
}

/**
 * Overall simulation state
 */
export interface SimulationState {
  running: boolean;
  time: number; // milliseconds since start
  components: Map<string, ComponentState>;
  wires: Map<string, WireState>;
  events: SimulationEvent[];
}

/**
 * Events that occur during simulation
 */
export interface SimulationEvent {
  time: number;
  type: 'signal-change' | 'component-update' | 'error';
  nodeId?: string;
  edgeId?: string;
  data: any;
}

/**
 * Component behavior interface
 * Each component type implements this to define how it behaves during simulation
 */
export interface ComponentSimulator {
  /**
   * Component type this simulator handles
   */
  nodeType: string;

  /**
   * Initialize component state at simulation start
   */
  initialize(node: Node, state: SimulationState): ComponentState;

  /**
   * Update component when input pins change
   * Returns true if output pins changed (triggers propagation)
   */
  update(
    componentState: ComponentState,
    changedPins: string[],
    state: SimulationState
  ): boolean;

  /**
   * Get visual state for rendering (LED brightness, servo angle, etc.)
   */
  getVisualState(componentState: ComponentState): Record<string, any>;

  /**
   * Optional: time-based updates (for animations, timers, etc.)
   */
  tick?(componentState: ComponentState, deltaTime: number, state: SimulationState): void;
}

/**
 * Simulation configuration
 */
export interface SimulationConfig {
  /** Simulation time step in ms (for time-based simulation) */
  timeStep?: number;

  /** Maximum iterations for signal propagation (prevents infinite loops) */
  maxPropagationDepth?: number;

  /** Enable debug logging */
  debug?: boolean;

  /** Custom component simulators */
  componentSimulators?: Map<string, ComponentSimulator>;
}
