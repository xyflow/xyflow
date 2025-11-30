/**
 * Circuit Simulation Engine
 *
 * This engine converts a React Flow graph into a circuit simulation,
 * propagates signals between components, and updates component states.
 *
 * It uses a Simplified Nodal Analysis approach:
 * 1. Identifies "Nets" (connected wires and pins).
 * 2. Iteratively solves for voltages and currents.
 * 3. Updates component states based on calculated values.
 */

import type { Node, Edge } from '@xyflow/react';
import type {
  SimulationState,
  ComponentState,
  WireState,
  ComponentSimulator,
  SimulationConfig,
  NetState,
  PinState,
} from './types';
import { MatrixSolver } from './MatrixSolver';

export class SimulationEngine {
  private config: Required<SimulationConfig>;
  private simulators: Map<string, ComponentSimulator>;

  constructor(config: SimulationConfig = {}) {
    this.config = {
      timeStep: config.timeStep ?? 100,
      maxIterations: config.maxIterations ?? 20,
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
      nets: new Map(),
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
        voltage: 0,
        current: 0,
      };
      state.wires.set(edge.id, wireState);
    }

    // Build Nets
    this.buildNets(state);

    return state;
  }

  /**
   * Build Nets (groups of connected pins and wires)
   */
  private buildNets(state: SimulationState): void {
    state.nets.clear();
    const visitedWires = new Set<string>();

    // Helper to extract pin info
    const getPinInfo = (nodeId: string, handleId: string) => {
      // Check if the component has a handleToPin mapping in its data
      const component = state.components.get(nodeId);
      if (component?.internalState?.handleToPin) {
        const pinName = component.internalState.handleToPin[handleId];
        if (pinName) {
          if (this.config.debug) {
            console.log(`📍 Mapped handle '${handleId}' -> pin '${pinName}' for ${nodeId}`);
          }
          return { nodeId, pinName };
        }
      }

      // Fallback: try to extract pin name from handle ID
      // This handles simple cases and provides backward compatibility
      let pinName = handleId;

      // Remove -source or -target suffix if present
      if (pinName.endsWith('-source')) {
        pinName = pinName.slice(0, -7);
      } else if (pinName.endsWith('-target')) {
        pinName = pinName.slice(0, -7);
      }

      // For pins like '1.l' or '2.r', extract just the number
      if (pinName.includes('.')) {
        pinName = pinName.split('.')[0];
      }

      if (this.config.debug) {
        console.log(`📍 Fallback: handle '${handleId}' -> pin '${pinName}' for ${nodeId}`);
      }

      return { nodeId, pinName };
    };

    let netCounter = 0;

    for (const [wireId, wire] of state.wires) {
      if (visitedWires.has(wireId)) continue;

      const netId = `net-${netCounter++}`;
      const net: NetState = {
        id: netId,
        voltage: 0,
        isGround: false,
        isSource: false,
        connectedPins: [],
      };

      // BFS to find all connected wires
      const queue = [wire];
      visitedWires.add(wireId);

      while (queue.length > 0) {
        const currentWire = queue.shift()!;

        // Add pins to net
        net.connectedPins.push(getPinInfo(currentWire.sourceNodeId, currentWire.sourceHandle));
        net.connectedPins.push(getPinInfo(currentWire.targetNodeId, currentWire.targetHandle));

        // Find connected wires (sharing the same pin)
        // This is O(N^2) in worst case, can be optimized with a map
        for (const [otherId, otherWire] of state.wires) {
          if (visitedWires.has(otherId)) continue;

          // Check connectivity
          const isConnected =
            (currentWire.sourceNodeId === otherWire.sourceNodeId && currentWire.sourceHandle === otherWire.sourceHandle) ||
            (currentWire.sourceNodeId === otherWire.targetNodeId && currentWire.sourceHandle === otherWire.targetHandle) ||
            (currentWire.targetNodeId === otherWire.sourceNodeId && currentWire.targetHandle === otherWire.sourceHandle) ||
            (currentWire.targetNodeId === otherWire.targetNodeId && currentWire.targetHandle === otherWire.targetHandle);

          if (isConnected) {
            visitedWires.add(otherId);
            queue.push(otherWire);
          }
        }
      }

      // Check if this net is connected to a GND pin
      for (const pin of net.connectedPins) {
        const pinName = pin.pinName.toUpperCase();
        if (pinName.startsWith('GND') || pinName === 'GROUND' || pinName === 'VSS') {
          net.isGround = true;
          net.voltage = 0; // Ground is always 0V
          if (this.config.debug) {
            console.log(`⏚ Net ${netId} marked as GROUND (connected to ${pin.pinName})`);
          }
          break;
        }
      }

      state.nets.set(netId, net);
    }
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
   * Single simulation step
   */
  step(state: SimulationState): void {
    if (!state.running) return;

    // 1. Time-based updates (e.g. signal generators)
    for (const [_, component] of state.components) {
      const simulator = this.simulators.get(component.nodeType);
      if (simulator?.tick) {
        simulator.tick(component, this.config.timeStep, state);
      }
    }

    // 2. Solve Circuit (Iterative approach)
    this.solveCircuit(state);

    // 3. Update Component States (check limits, etc.)
    for (const [_, component] of state.components) {
      const simulator = this.simulators.get(component.nodeType);
      if (simulator) {
        simulator.update(component, state);
      }
    }

    state.time += this.config.timeStep;
  }

  /**
   * Modified Nodal Analysis Circuit Solver
   */
  private solveCircuit(state: SimulationState): void {
    if (this.config.debug) {
      console.log('🔧 === SOLVING CIRCUIT (MNA) ===');
    }

    // Step 1: Build node-to-index mapping (exclude ground)
    const nodeToIndex = new Map<string, number>();
    let nodeIndex = 0;

    // Collect all unique nodes (nets)
    for (const net of state.nets.values()) {
      if (!net.isGround && !nodeToIndex.has(net.id)) {
        nodeToIndex.set(net.id, nodeIndex++);
      }
    }

    const numNodes = nodeIndex;

    // Step 2: Count voltage sources for matrix sizing
    let numVoltageSources = 0;
    for (const component of state.components.values()) {
      if (component.nodeType === 'battery' || component.nodeType === 'source') {
        numVoltageSources++;
      }
    }

    const matrixSize = numNodes + numVoltageSources;

    if (matrixSize === 0) {
      if (this.config.debug) {
        console.log('⚠️ No nodes to solve');
      }
      return;
    }

    // Step 3: Initialize MNA matrices
    const G = MatrixSolver.zeros(matrixSize, matrixSize); // Conductance matrix
    const b = MatrixSolver.zeroVector(matrixSize); // RHS vector

    let vsIndex = numNodes; // Index for voltage source currents

    if (this.config.debug) {
      console.log(`📐 Matrix size: ${matrixSize}x${matrixSize} (${numNodes} nodes, ${numVoltageSources} voltage sources)`);
    }

    // Step 4: Stamp components into matrices
    for (const component of state.components.values()) {
      const simulator = this.simulators.get(component.nodeType);

      if (component.nodeType === 'battery' || component.nodeType === 'source') {
        // Voltage source stamping
        const posPin = component.pins.get('pos');
        const negPin = component.pins.get('neg');
        const voltage = component.specs.voltage || 0;

        if (posPin && negPin) {
          const posNet = this.findNet(state, component.nodeId, posPin.pinName);
          const negNet = this.findNet(state, component.nodeId, negPin.pinName);

          const posIdx = posNet && !posNet.isGround ? nodeToIndex.get(posNet.id) : -1;
          const negIdx = negNet && !negNet.isGround ? nodeToIndex.get(negNet.id) : -1;

          // Stamp: V_pos - V_neg = voltage
          if (posIdx !== undefined && posIdx >= 0) {
            G[posIdx][vsIndex] = 1;
            G[vsIndex][posIdx] = 1;
          }
          if (negIdx !== undefined && negIdx >= 0) {
            G[negIdx][vsIndex] = -1;
            G[vsIndex][negIdx] = -1;
          }

          b[vsIndex] = voltage;
          vsIndex++;
        }
      } else if (component.nodeType === 'resistor') {
        // Resistor stamping
        const p1 = component.pins.get('1');
        const p2 = component.pins.get('2');
        const resistance = component.specs.resistance || 1000;
        const conductance = 1 / resistance;

        if (p1 && p2) {
          const net1 = this.findNet(state, component.nodeId, p1.pinName);
          const net2 = this.findNet(state, component.nodeId, p2.pinName);

          const idx1 = net1 && !net1.isGround ? nodeToIndex.get(net1.id) : -1;
          const idx2 = net2 && !net2.isGround ? nodeToIndex.get(net2.id) : -1;

          // Stamp conductance
          if (idx1 !== undefined && idx1 >= 0) {
            G[idx1][idx1] += conductance;
            if (idx2 !== undefined && idx2 >= 0) {
              G[idx1][idx2] -= conductance;
            }
          }
          if (idx2 !== undefined && idx2 >= 0) {
            G[idx2][idx2] += conductance;
            if (idx1 !== undefined && idx1 >= 0) {
              G[idx2][idx1] -= conductance;
            }
          }
        }
      } else if (component.nodeType === 'pushbutton') {
        // Pushbutton as variable resistor
        const pressed = component.internalState.pressed || false;
        const resistance = pressed ? 0.1 : 1000000;
        const conductance = 1 / resistance;

        const p1 = component.pins.get('1');
        const p2 = component.pins.get('2');

        if (p1 && p2) {
          const net1 = this.findNet(state, component.nodeId, p1.pinName);
          const net2 = this.findNet(state, component.nodeId, p2.pinName);

          const idx1 = net1 && !net1.isGround ? nodeToIndex.get(net1.id) : -1;
          const idx2 = net2 && !net2.isGround ? nodeToIndex.get(net2.id) : -1;

          if (idx1 !== undefined && idx1 >= 0) {
            G[idx1][idx1] += conductance;
            if (idx2 !== undefined && idx2 >= 0) {
              G[idx1][idx2] -= conductance;
            }
          }
          if (idx2 !== undefined && idx2 >= 0) {
            G[idx2][idx2] += conductance;
            if (idx1 !== undefined && idx1 >= 0) {
              G[idx2][idx1] -= conductance;
            }
          }
        }
      } else if (component.nodeType === 'led') {
        // LED as diode with forward voltage drop
        // Simplified: treat as resistor when forward biased
        const anode = component.pins.get('anode');
        const cathode = component.pins.get('cathode');

        if (anode && cathode) {
          const anodeNet = this.findNet(state, component.nodeId, anode.pinName);
          const cathodeNet = this.findNet(state, component.nodeId, cathode.pinName);

          // For first pass, treat as high resistance (will iterate)
          const resistance = 1000; // Simplified
          const conductance = 1 / resistance;

          const idx1 = anodeNet && !anodeNet.isGround ? nodeToIndex.get(anodeNet.id) : -1;
          const idx2 = cathodeNet && !cathodeNet.isGround ? nodeToIndex.get(cathodeNet.id) : -1;

          if (idx1 !== undefined && idx1 >= 0) {
            G[idx1][idx1] += conductance;
            if (idx2 !== undefined && idx2 >= 0) {
              G[idx1][idx2] -= conductance;
            }
          }
          if (idx2 !== undefined && idx2 >= 0) {
            G[idx2][idx2] += conductance;
            if (idx1 !== undefined && idx1 >= 0) {
              G[idx2][idx1] -= conductance;
            }
          }
        }
      } else if (component.nodeType === 'esp32DevkitV1') {
        // ESP32 microcontroller
        // Power pins act as voltage sources
        const vm = component.internalState.vm;

        // 3V3 pin as 3.3V source
        const v3v3Pin = component.pins.get('3V3');
        if (v3v3Pin) {
          const net = this.findNet(state, component.nodeId, '3V3');
          if (net && !net.isGround) {
            const idx = nodeToIndex.get(net.id);
            if (idx !== undefined && idx >= 0) {
              // Set this node to 3.3V (strong voltage source)
              b[idx] += 3.3 * 1000; // High conductance to enforce voltage
              G[idx][idx] += 1000;
            }
          }
        }

        // OUTPUT pins act as voltage sources (driven by Arduino code)
        if (vm) {
          for (const [pinName, pin] of component.pins) {
            if (pinName.startsWith('D')) {
              const pinNumber = parseInt(pinName.substring(1));
              const pinMode = vm.getPinMode(pinNumber);

              if (pinMode === 'OUTPUT') {
                // This pin is an output - it should drive voltage
                const net = this.findNet(state, component.nodeId, pinName);
                if (net && !net.isGround) {
                  const idx = nodeToIndex.get(net.id);
                  if (idx !== undefined && idx >= 0) {
                    // Use the pin's current voltage as the source
                    const targetVoltage = pin.voltage;
                    b[idx] += targetVoltage * 100; // Medium strength driver
                    G[idx][idx] += 100;
                  }
                }
              } else if (pinMode === 'INPUT_PULLUP') {
                // INPUT_PULLUP pins have a weak pull-up resistor to 3.3V
                const net = this.findNet(state, component.nodeId, pinName);
                if (net && !net.isGround) {
                  const idx = nodeToIndex.get(net.id);
                  if (idx !== undefined && idx >= 0) {
                    // Weak pull-up to 3.3V (low conductance = high resistance ~50k ohm)
                    const pullupConductance = 0.02; // ~50k ohm
                    b[idx] += 3.3 * pullupConductance;
                    G[idx][idx] += pullupConductance;
                  }
                }
              }
              // INPUT pins don't drive - they just read, so no matrix entries needed
            }
          }
        }
      }
    }

    // Step 5: Solve the system
    try {
      const x = MatrixSolver.solve(G, b);

      // Step 6: Extract node voltages
      for (const [netId, idx] of nodeToIndex) {
        const net = state.nets.get(netId);
        if (net) {
          net.voltage = x[idx];
        }
      }

      // Step 7: Update component pin voltages
      for (const component of state.components.values()) {
        for (const [pinName, pin] of component.pins) {
          const net = this.findNet(state, component.nodeId, pinName);
          if (net) {
            pin.voltage = net.voltage;
          } else {
            // Pin is unconnected / floating
            pin.voltage = NaN;
          }
        }
      }

      // Step 8: Calculate currents and update component states
      for (const component of state.components.values()) {
        const simulator = this.simulators.get(component.nodeType);
        if (simulator?.update) {
          simulator.update(component, state);
        }
      }

      if (this.config.debug) {
        console.log('✅ Circuit solved successfully');
        console.log('📊 Node voltages:');
        for (const [netId, idx] of nodeToIndex) {
          console.log(`  ${netId}: ${x[idx].toFixed(3)}V`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to solve circuit:', error);
    }
  }

  /**
   * Helper to find net for a pin
   */
  findNet(state: SimulationState, nodeId: string, pinName: string): NetState | undefined {
    for (const net of state.nets.values()) {
      if (net.connectedPins.some(p => p.nodeId === nodeId && p.pinName === pinName)) {
        return net;
      }
    }
    return undefined;
  }

  /**
   * Helper to set net voltage (used by sources)
   */
  setNetVoltage(state: SimulationState, nodeId: string, pinName: string, voltage: number, isSource: boolean = false): void {
    const net = this.findNet(state, nodeId, pinName);
    if (net) {
      net.voltage = voltage;
      if (isSource) net.isSource = true;

      // Update all pins on this net
      for (const pinRef of net.connectedPins) {
        const comp = state.components.get(pinRef.nodeId);
        const pin = comp?.pins.get(pinRef.pinName);
        if (pin) {
          pin.voltage = voltage;
        }

        // Update wires connected to this net
        // (Optimization: Map wires to nets directly)
        for (const wire of state.wires.values()) {
          if ((wire.sourceNodeId === pinRef.nodeId && this.extractPinName(wire.sourceHandle) === pinRef.pinName) ||
            (wire.targetNodeId === pinRef.nodeId && this.extractPinName(wire.targetHandle) === pinRef.pinName)) {
            wire.voltage = voltage;
          }
        }
      }
    }
  }

  /**
   * Extract pin name from handle ID
   */
  private extractPinName(handleId: string): string {
    const parts = handleId.split('-');
    if (parts.length < 3) return handleId;
    return parts.slice(1, -1).join('-');
  }

  /**
   * Update a component's input
   */
  updateComponentInput(
    state: SimulationState,
    nodeId: string,
    inputName: string,
    value: any
  ): void {
    const component = state.components.get(nodeId);
    if (!component) return;

    component.internalState[inputName] = value;

    // Trigger a step immediately? Or wait for next tick?
    // Let's trigger a solve
    this.solveCircuit(state);
  }

  /**
   * Get visual states for all components
   */
  getVisualStates(state: SimulationState): Map<string, Record<string, any>> {
    const visualStates = new Map<string, Record<string, any>>();

    for (const component of state.components.values()) {
      const simulator = this.simulators.get(component.nodeType);
      if (simulator?.getVisualState) {
        const visualState = simulator.getVisualState(component);
        visualStates.set(component.nodeId, visualState);

        if (this.config.debug && component.nodeType === 'led') {
          console.log(`🎨 getVisualState for ${component.nodeId}:`, visualState);
        }
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
