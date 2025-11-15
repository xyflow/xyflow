# Discovery: Using xyflow for Hardware Prototyping

## Overview
This document summarizes our exploration of using xyflow (React Flow) for hardware prototyping and circuit design applications.

## Approach Followed

### 1. Custom Node Component with Hardware Representation
We modified the `DefaultNode` component ([packages/react/src/components/Nodes/DefaultNode.tsx](./packages/react/src/components/Nodes/DefaultNode.tsx)) to represent an ESP32 development board:

- **Visual SVG representation**: Created a detailed SVG of the ESP32 board with all physical components (chip, LEDs, buttons, USB connector, etc.)
- **Pin mapping**: Defined a `pinInfo` array with 30 pins, each containing:
  - Pin name (VIN, GND, D13, etc.)
  - Physical coordinates (x, y) matching the SVG layout
  - Signal types (power, SPI, I2C, USART, PWM, analog)
  - Voltage information where applicable

### 2. Bidirectional Handle System
For each pin in the hardware component, we created **bidirectional handles**:

```tsx
{pinInfo.map((pin) => {
  const handleStyle = {
    position: 'absolute',
    left: `${pin.x - 7}px`,
    top: `${pin.y}px`,
    width: '4px',
    height: '4px',
    background: pin.signals.some(s => s.type === 'power') ? '#ff0072' : '#1a192b',
    border: '1px solid white',
    cursor: 'crosshair',
  };

  return (
    <div key={pin.name}>
      <Handle type="source" position={Position.Right} id={pin.name} ... />
      <Handle type="target" position={Position.Right} id={pin.name} ... />
    </div>
  );
})}
```

**Key features**:
- Each pin has both `source` and `target` handles overlapping at the same position
- Handle IDs match pin names for precise connection tracking
- Visual differentiation: Power pins (VCC/GND) are colored pink, signal pins are dark
- Each handle is positioned exactly at the physical pin location on the SVG

### 3. Connection Configuration
Modified the Basic example ([examples/react/src/examples/Basic/index.tsx](./examples/react/src/examples/Basic/index.tsx)):

- Added `useNodesState` and `useEdgesState` for proper state management
- Implemented `onConnect` handler to enable interactive connections
- Set `defaultEdgeOptions` to use `smoothstep` edge type for clean, right-angled connections (ideal for circuit diagrams)
- Edges store `sourceHandle` and `targetHandle` properties containing pin names

## Is xyflow a Good Approach for Hardware Prototyping?

### ✅ Strengths

1. **Pin-Level Precision**
   - Unique handle IDs allow tracking exactly which pins are connected
   - Example: Connect ESP32 D13 (SPI MOSI) to another device's D5 (SPI SS)
   - Full connection metadata available in edges: `{source: 'esp32', sourceHandle: 'D13', target: 'sensor', targetHandle: 'SCL'}`

2. **Visual Clarity**
   - SVG support allows accurate hardware representations
   - Interactive canvas with pan/zoom for complex circuits
   - MiniMap for navigation in large designs

3. **Signal Type Validation (Potential)**
   - Pin metadata includes signal types (SPI, I2C, PWM, power, etc.)
   - Could implement validation: prevent connecting incompatible signals
   - Could warn about voltage mismatches (3.3V to 5V connections)

4. **Built-in Features**
   - Node dragging and positioning
   - Connection validation
   - Edge routing (smoothstep works well for circuit diagrams)
   - Selection, deletion, undo/redo capabilities
   - Export/import via `toObject()` for saving designs

5. **Extensibility**
   - Custom node types for different components (microcontrollers, sensors, displays, etc.)
   - Custom edge types for different wire types (power, ground, signal, bus)
   - Custom connection validation logic
   - Integration with component libraries and datasheets

### ⚠️ Limitations & Considerations

1. **Handle Positioning Complexity**
   - Absolute positioning requires manual calculation for each pin
   - SVG viewBox coordinates need careful mapping to DOM positioning
   - May need adjustment when node is resized or scaled

2. **Edge Routing**
   - Smoothstep edges are good but may not match EDA (Electronic Design Automation) tools
   - No automatic bus routing or differential pair support
   - Manual intervention needed for complex multi-wire connections

3. **Missing EDA Features**
   - No netlists, schematic capture, or PCB layout capabilities
   - No electrical rule checking (ERC) or design rule checking (DRC)
   - No automatic wire numbering or labeling
   - No bill of materials (BOM) generation

4. **Scale Challenges**
   - Large circuits (100+ components) may become unwieldy
   - No hierarchical design support (subcircuits/modules)
   - Performance may degrade with thousands of connections

5. **Component Libraries**
   - Would need to create SVG representations for every component
   - Maintaining pin data for thousands of components is significant overhead
   - No standard import format for component libraries

### 🎯 Recommended Use Cases

**xyflow is EXCELLENT for:**

1. **Hardware Prototyping & Planning**
   - Visualizing board-to-board connections
   - Planning wire harnesses and cable assemblies
   - Documenting breadboard layouts
   - Creating system-level architecture diagrams

2. **Educational Tools**
   - Teaching microcontroller connections
   - Demonstrating communication protocols (SPI, I2C, UART)
   - Interactive circuit exploration
   - Virtual breadboard simulations

3. **IoT System Design**
   - Mapping sensor networks
   - Planning microcontroller interconnections
   - Documenting hardware architecture
   - Connection testing and validation

4. **Firmware Development Support**
   - Visual pin mapping reference
   - Documenting hardware configurations
   - Testing different wiring scenarios
   - Generating initialization code from connections

**xyflow is NOT IDEAL for:**

1. **Schematic Capture** - Use KiCad, Altium, or Eagle
2. **PCB Design** - Use professional EDA tools
3. **Circuit Simulation** - Use SPICE-based simulators
4. **High-density designs** - Traditional EDA tools are better

## Recommendations

### For a Hardware Prototyping Tool

If building a hardware prototyping tool with xyflow:

1. **Create a Component Library System**
   - Build a JSON-based component library with pin definitions
   - Auto-generate handles from pin metadata
   - Include signal type information for validation

2. **Implement Connection Validation**
   ```tsx
   const validateConnection = (connection) => {
     const sourcePin = getPinInfo(connection.source, connection.sourceHandle);
     const targetPin = getPinInfo(connection.target, connection.targetHandle);

     // Prevent power-to-signal connections
     if (sourcePin.type === 'power' && targetPin.type !== 'power') {
       return false;
     }

     // Warn about voltage mismatches
     if (sourcePin.voltage !== targetPin.voltage) {
       showWarning('Voltage mismatch');
     }

     return true;
   };
   ```

3. **Add Export Capabilities**
   - Export to JSON for saving designs
   - Generate code for pin initialization
   - Create connection tables/documentation
   - Export to common formats (CSV, Markdown)

4. **Enhance Edge Styling**
   - Color code by signal type (power = red, ground = black, I2C = blue, SPI = green)
   - Add labels for wire numbers or signal names
   - Support bus connections (multiple signals in one visual edge)

5. **Build Component Templates**
   - Common microcontrollers (ESP32, Arduino, Raspberry Pi)
   - Sensors (temperature, pressure, IMU)
   - Displays (LCD, OLED, LED matrices)
   - Power components (regulators, batteries)

## Conclusion

**xyflow is a GOOD approach for hardware prototyping** when the goal is:
- High-level system design and planning
- Interactive connection visualization
- Educational or documentation purposes
- Rapid prototyping and experimentation

The combination of precise pin-level control, visual customization, and built-in interaction features makes it well-suited for these use cases. However, it should **complement** rather than **replace** traditional EDA tools for professional electronic design work.

The key advantage is the ability to create **domain-specific** hardware design tools that are more accessible and interactive than traditional EDA software, while still maintaining the precision needed for accurate hardware connections.
