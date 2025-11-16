/**
 * Circuit Simulation Engine
 *
 * This engine converts a React Flow graph into a circuit simulation,
 * propagates signals between components, and updates component states.
 */

import type { Node, Edge } from '@xyflow/react';
import type {
  SimulationState,
  ComponentState,
  WireState,
  ComponentSimulator,
  SimulationConfig,
  SimulationEvent,
  PinState,
} from './types';

export class SimulationEngine {
  private config: Required<SimulationConfig>;
  private simulators: Map<string, ComponentSimulator>;

  constructor(config: SimulationConfig = {}) {
    this.config = {
      timeStep: config.timeStep ?? 10,
      maxPropagationDepth: config.maxPropagationDepth ?? 100,
      debug: config.debug ?? false,
      componentSimulators: config.componentSimulators ?? new Map(),
    };
    this.simulators = this.config.componentSimulators;
  }

  /**
   * Register a component simulator
   */
  registerSimulator(simulator: ComponentSimulator): void {
    this.simulators.set(simulator.nodeType, simulator);
  }

  /**
   * Initialize simulation from React Flow graph
   */
  initialize(nodes: Node[], edges: Edge[]): SimulationState {
    const state: SimulationState = {
      running: false,
      time: 0,
      components: new Map(),
      wires: new Map(),
      events: [],
    };

    // Initialize all components
    for (const node of nodes) {
      const simulator = this.simulators.get(node.type || 'default');
      if (simulator) {
        const componentState = simulator.initialize(node, state);
        state.components.set(node.id, componentState);
      } else if (this.config.debug) {
        console.warn(`No simulator for node type: ${node.type}`);
      }
    }

    // Initialize all wires
    for (const edge of edges) {
      const wireState: WireState = {
        edgeId: edge.id,
        sourceNodeId: edge.source,
        sourceHandle: edge.sourceHandle || '',
        targetNodeId: edge.target,
        targetHandle: edge.targetHandle || '',
        signalType: 'digital',
        value: 'LOW',
      };
      state.wires.set(edge.id, wireState);
    }

    return state;
  }

  /**
   * Start the simulation
   */
  start(state: SimulationState): void {
    state.running = true;
    state.time = 0;
    this.log('Simulation started');
  }

  /**
   * Stop the simulation
   */
  stop(state: SimulationState): void {
    state.running = false;
    this.log('Simulation stopped');
  }

  /**
   * Single simulation step (propagate all signals once)
   */
  step(state: SimulationState): void {
    if (!state.running) return;

    // Time-based updates for components that need it
    for (const [nodeId, componentState] of state.components) {
      const simulator = this.simulators.get(componentState.nodeType);
      if (simulator?.tick) {
        simulator.tick(componentState, this.config.timeStep, state);
      }
    }

    // Propagate signals through the circuit
    this.propagateSignals(state);

    state.time += this.config.timeStep;
  }

  /**
   * Propagate signals from outputs to inputs
   */
  private propagateSignals(state: SimulationState): void {
    const changedComponents = new Set<string>();
    let depth = 0;

    // Initial pass: find all components with changed outputs
    for (const [nodeId, componentState] of state.components) {
      changedComponents.add(nodeId);
    }

    // Propagate changes until no more changes occur
    while (changedComponents.size > 0 && depth < this.config.maxPropagationDepth) {
      const currentBatch = Array.from(changedComponents);
      changedComponents.clear();

      for (const sourceNodeId of currentBatch) {
        // Find all wires connected to this component's outputs
        const outputWires = Array.from(state.wires.values()).filter(
          (wire) => wire.sourceNodeId === sourceNodeId
        );

        for (const wire of outputWires) {
          // Get the source pin value
          const sourceComponent = state.components.get(wire.sourceNodeId);
          if (!sourceComponent) continue;

          const sourcePinName = this.extractPinName(wire.sourceHandle);
          const sourcePin = sourceComponent.pins.get(sourcePinName);
          if (!sourcePin) continue;

          // Update wire value
          wire.value = sourcePin.value;
          wire.signalType = sourcePin.signalType;

          // Update target component's input pin
          const targetComponent = state.components.get(wire.targetNodeId);
          if (!targetComponent) continue;

          const targetPinName = this.extractPinName(wire.targetHandle);
          const targetPin = targetComponent.pins.get(targetPinName);
          if (!targetPin) continue;

          // Only update if value changed
          if (targetPin.value !== wire.value) {
            targetPin.value = wire.value;
            targetPin.signalType = wire.signalType;

            // Update the component with the new input
            const simulator = this.simulators.get(targetComponent.nodeType);
            if (simulator) {
              const hasChanges = simulator.update(
                targetComponent,
                [targetPinName],
                state
              );

              if (hasChanges) {
                changedComponents.add(wire.targetNodeId);
              }
            }
          }
        }
      }

      depth++;
    }

    if (depth >= this.config.maxPropagationDepth) {
      console.error('Maximum propagation depth reached - possible infinite loop');
    }
  }

  /**
   * Extract pin name from handle ID
   * Handle format: "nodeId-pinName-source" or "nodeId-pinName-target"
   */
  private extractPinName(handleId: string): string {
    const parts = handleId.split('-');
    // Remove nodeId from start and source/target from end
    return parts.slice(1, -1).join('-');
  }

  /**
   * Update a component's input (e.g., button pressed, potentiometer rotated)
   */
  updateComponentInput(
    state: SimulationState,
    nodeId: string,
    inputName: string,
    value: any
  ): void {
    const component = state.components.get(nodeId);
    if (!component) return;

    // Update internal state
    component.internalState[inputName] = value;

    // Update the component
    const simulator = this.simulators.get(component.nodeType);
    if (simulator) {
      simulator.update(component, [], state);
    }

    // Trigger propagation
    this.propagateSignals(state);
  }

  /**
   * Get visual states for all components
   */
  getVisualStates(state: SimulationState): Map<string, Record<string, any>> {
    const visualStates = new Map<string, Record<string, any>>();

    for (const [nodeId, componentState] of state.components) {
      const simulator = this.simulators.get(componentState.nodeType);
      if (simulator) {
        visualStates.set(nodeId, simulator.getVisualState(componentState));
      }
    }

    return visualStates;
  }

  private log(message: string): void {
    if (this.config.debug) {
      console.log(`[Simulation] ${message}`);
    }
  }
}
