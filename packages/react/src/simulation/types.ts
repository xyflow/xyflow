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
export type SignalType = 'digital' | 'analog' | 'power' | 'ground';

/**
 * Pin state during simulation
 */
export interface PinState {
  pinName: string;
  signalType: SignalType;
  voltage: number; // Volts
  current: number; // Milliamps (mA)
  impedance?: number; // Ohms (for solver)
}

/**
 * Component health status
 */
export type ComponentHealth = 'OK' | 'BLOWN' | 'OVERHEATING' | 'UNSTABLE';

/**
 * Component specifications (static data)
 */
export interface ComponentSpecs {
  // Resistor
  resistance?: number; // Ohms
  powerRating?: number; // Watts

  // Diode / LED
  forwardVoltage?: number; // Volts
  maxCurrent?: number; // mA
  breakdownVoltage?: number; // Volts

  // Source
  voltage?: number; // Volts
}

/**
 * Component state during simulation
 */
export interface ComponentState {
  nodeId: string;
  nodeType: string;
  pins: Map<string, PinState>;
  health: ComponentHealth;
  specs: ComponentSpecs;
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
  voltage: number;
  current: number;
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
  // Solver state
  nets: Map<string, NetState>; // Map netId to NetState
}

/**
 * A "Net" is a group of connected wires and pins that share the same voltage
 */
export interface NetState {
  id: string;
  voltage: number;
  isGround: boolean;
  isSource: boolean;
  connectedPins: { nodeId: string; pinName: string }[];
}

/**
 * Events that occur during simulation
 */
export interface SimulationEvent {
  time: number;
  type: 'signal-change' | 'component-update' | 'error' | 'component-failure';
  nodeId?: string;
  edgeId?: string;
  message?: string;
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
   * Calculate currents/voltages for the solver
   * This is called iteratively by the solver
   */
  solve?(componentState: ComponentState, state: SimulationState): void;

  /**
   * Update component internal state after solver converges
   * (e.g. check for blown components, update brightness)
   */
  update(
    componentState: ComponentState,
    state: SimulationState
  ): void;

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

  /** Maximum iterations for solver */
  maxIterations?: number;

  /** Enable debug logging */
  debug?: boolean;

  /** Custom component simulators */
  componentSimulators?: Map<string, ComponentSimulator>;
}
