import { Node, Edge } from '@xyflow/react';

interface PinMapping {
  nodeId: string;
  nodeType: string;
  pinName: string;
  arduinoPin: number;
  pinMode: 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP';
}

/**
 * Generate Arduino code from circuit diagram
 */
export function generateArduinoCode(nodes: Node[], edges: Edge[]): string {
  const pinMappings: PinMapping[] = [];
  let pinCounter = 2; // Start from pin 2 (0,1 reserved for Serial)

  // Analyze nodes and assign pins
  nodes.forEach((node) => {
    const nodeType = node.type || 'default';

    switch (nodeType) {
      case 'led':
        pinMappings.push({
          nodeId: node.id,
          nodeType: 'LED',
          pinName: 'anode',
          arduinoPin: pinCounter++,
          pinMode: 'OUTPUT',
        });
        break;

      case 'pushbutton':
        pinMappings.push({
          nodeId: node.id,
          nodeType: 'Button',
          pinName: 'signal',
          arduinoPin: pinCounter++,
          pinMode: 'INPUT_PULLUP',
        });
        break;

      case 'resistor':
        // Resistors don't need pins in code
        break;

      case 'battery':
        // Battery is power supply, not a pin
        break;

      default:
        // Generic component
        break;
    }
  });

  // Generate #define statements
  const defines = pinMappings
    .map((pm) => `#define ${pm.nodeType.toUpperCase()}_PIN_${pm.nodeId.replace(/-/g, '_')} ${pm.arduinoPin}`)
    .join('\n');

  // Generate setup() code
  const setupStatements = pinMappings
    .map((pm) => `  pinMode(${pm.nodeType.toUpperCase()}_PIN_${pm.nodeId.replace(/-/g, '_')}, ${pm.pinMode});`)
    .join('\n');

  // Generate loop() code based on connections
  const loopCode = generateLoopLogic(nodes, edges, pinMappings);

  return `// Auto-generated from circuit diagram
// Nodes: ${nodes.length}, Edges: ${edges.length}

${defines}

void setup() {
  Serial.begin(9600);
${setupStatements}

  Serial.println("Circuit initialized!");
}

void loop() {
${loopCode}

  delay(10);
}`;
}

function generateLoopLogic(nodes: Node[], edges: Edge[], pinMappings: PinMapping[]): string {
  const statements: string[] = [];

  // Find button → LED connections
  const buttons = nodes.filter((n) => n.type === 'pushbutton');
  const leds = nodes.filter((n) => n.type === 'led');

  buttons.forEach((button) => {
    // Find if this button is connected to an LED
    const connectedEdges = edges.filter((e) => e.source === button.id || e.target === button.id);

    connectedEdges.forEach((edge) => {
      const targetNode = nodes.find((n) => n.id === edge.target);

      if (targetNode && targetNode.type === 'led') {
        const buttonPin = pinMappings.find((pm) => pm.nodeId === button.id);
        const ledPin = pinMappings.find((pm) => pm.nodeId === targetNode.id);

        if (buttonPin && ledPin) {
          statements.push(`  // Control ${targetNode.id} with ${button.id}`);
          statements.push(`  int buttonState_${button.id.replace(/-/g, '_')} = digitalRead(${buttonPin.nodeType.toUpperCase()}_PIN_${button.id.replace(/-/g, '_')});`);
          statements.push(`  if (buttonState_${button.id.replace(/-/g, '_')} == LOW) {`);
          statements.push(`    digitalWrite(${ledPin.nodeType.toUpperCase()}_PIN_${targetNode.id.replace(/-/g, '_')}, HIGH);`);
          statements.push(`    Serial.println("${targetNode.id} ON");`);
          statements.push(`  } else {`);
          statements.push(`    digitalWrite(${ledPin.nodeType.toUpperCase()}_PIN_${targetNode.id.replace(/-/g, '_')}, LOW);`);
          statements.push(`  }`);
        }
      }
    });
  });

  if (statements.length === 0) {
    statements.push('  // No connections detected');
    statements.push('  // Add components and wire them together!');
  }

  return statements.join('\n');
}

/**
 * Parse Arduino code to extract pin configurations
 */
export function parseArduinoCode(code: string): {
  pinModes: { pin: string; mode: string }[];
  digitalWrites: { pin: string; value: string }[];
  digitalReads: { pin: string; variable: string }[];
} {
  const pinModes: { pin: string; mode: string }[] = [];
  const digitalWrites: { pin: string; value: string }[] = [];
  const digitalReads: { pin: string; variable: string }[] = [];

  // Parse pinMode calls
  const pinModeRegex = /pinMode\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g;
  let match;
  while ((match = pinModeRegex.exec(code)) !== null) {
    pinModes.push({ pin: match[1].trim(), mode: match[2].trim() });
  }

  // Parse digitalWrite calls
  const digitalWriteRegex = /digitalWrite\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g;
  while ((match = digitalWriteRegex.exec(code)) !== null) {
    digitalWrites.push({ pin: match[1].trim(), value: match[2].trim() });
  }

  // Parse digitalRead calls
  const digitalReadRegex = /(\w+)\s*=\s*digitalRead\s*\(\s*([^)]+)\s*\)/g;
  while ((match = digitalReadRegex.exec(code)) !== null) {
    digitalReads.push({ variable: match[1].trim(), pin: match[2].trim() });
  }

  return { pinModes, digitalWrites, digitalReads };
}
