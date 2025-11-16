/**
 * useSimulation Hook
 *
 * React hook to integrate circuit simulation with React Flow
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useNodes, useEdges } from '../hooks/useStore';
import { SimulationEngine } from './SimulationEngine';
import type { SimulationState, SimulationConfig, ComponentSimulator } from './types';

export interface UseSimulationOptions extends SimulationConfig {
  /** Auto-start simulation on mount */
  autoStart?: boolean;

  /** Simulation update interval in ms */
  updateInterval?: number;
}

export interface UseSimulationReturn {
  /** Current simulation state */
  state: SimulationState | null;

  /** Whether simulation is running */
  isRunning: boolean;

  /** Start the simulation */
  start: () => void;

  /** Stop the simulation */
  stop: () => void;

  /** Toggle simulation on/off */
  toggle: () => void;

  /** Single simulation step */
  step: () => void;

  /** Reset simulation */
  reset: () => void;

  /** Update a component's input (e.g., button press) */
  updateComponentInput: (nodeId: string, inputName: string, value: any) => void;

  /** Get visual states for rendering */
  getVisualStates: () => Map<string, Record<string, any>>;

  /** Register a component simulator */
  registerSimulator: (simulator: ComponentSimulator) => void;
}

/**
 * Hook to manage circuit simulation
 */
export function useSimulation(options: UseSimulationOptions = {}): UseSimulationReturn {
  const nodes = useNodes();
  const edges = useEdges();

  const [state, setState] = useState<SimulationState | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const engineRef = useRef<SimulationEngine | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Initialize engine
  useEffect(() => {
    engineRef.current = new SimulationEngine(options);
  }, []);

  // Initialize simulation when nodes/edges change
  const initialize = useCallback(() => {
    if (!engineRef.current) return null;

    const newState = engineRef.current.initialize(nodes, edges);
    setState(newState);
    return newState;
  }, [nodes, edges]);

  // Auto-initialize on mount or when graph changes
  useEffect(() => {
    const newState = initialize();
    if (options.autoStart && newState) {
      start();
    }
  }, [nodes.length, edges.length]);

  const start = useCallback(() => {
    if (!state || !engineRef.current) {
      const newState = initialize();
      if (!newState) return;
    }

    if (state) {
      engineRef.current!.start(state);
      setIsRunning(true);

      // Start update loop
      const interval = options.updateInterval ?? 100; // Default 100ms updates
      intervalRef.current = window.setInterval(() => {
        if (engineRef.current && state) {
          engineRef.current.step(state);
          setState({ ...state }); // Trigger re-render
        }
      }, interval);
    }
  }, [state, initialize, options.updateInterval]);

  const stop = useCallback(() => {
    if (state && engineRef.current) {
      engineRef.current.stop(state);
      setIsRunning(false);

      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [state]);

  const toggle = useCallback(() => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  }, [isRunning, start, stop]);

  const step = useCallback(() => {
    if (state && engineRef.current) {
      engineRef.current.step(state);
      setState({ ...state });
    }
  }, [state]);

  const reset = useCallback(() => {
    stop();
    const newState = initialize();
    if (newState) {
      setState(newState);
    }
  }, [stop, initialize]);

  const updateComponentInput = useCallback(
    (nodeId: string, inputName: string, value: any) => {
      if (state && engineRef.current) {
        engineRef.current.updateComponentInput(state, nodeId, inputName, value);
        setState({ ...state });
      }
    },
    [state]
  );

  const getVisualStates = useCallback(() => {
    if (state && engineRef.current) {
      return engineRef.current.getVisualStates(state);
    }
    return new Map();
  }, [state]);

  const registerSimulator = useCallback((simulator: ComponentSimulator) => {
    if (engineRef.current) {
      engineRef.current.registerSimulator(simulator);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    state,
    isRunning,
    start,
    stop,
    toggle,
    step,
    reset,
    updateComponentInput,
    getVisualStates,
    registerSimulator,
  };
}
