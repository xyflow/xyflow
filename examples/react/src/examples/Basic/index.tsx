import { MouseEvent, useCallback, useState, DragEvent, useRef, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  ComponentPanel,
  ReactFlowProvider,
  Node,
  Edge,
  useReactFlow,
  Panel,
  OnNodeDrag,
  FitViewOptions,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  NodeTypes,
  EdgeTypes,
} from '@xyflow/react';
import { useSimulation } from '@xyflow/react';

import SevenSegmentNode from './SevenSegmentNode';
import AnalogJoystickNode from './AnalogJoystickNode';
import ArduinoMegaNode from './ArduinoMegaNode';
import ArduinoNanoNode from './ArduinoNanoNode';
import ArduinoUnoNode from './ArduinoUnoNode';
import BiaxialStepperNode from './BiaxialStepperNode';
import BigSoundSensorNode from './BigSoundSensorNode';
import ESP32DevkitV1Node from './ESP32DevkitV1Node';
import BuzzerNode from './BuzzerNode';
import DHT22Node from './DHT22Node';
import DipSwitch8Node from './DipSwitch8Node';
import DS1307Node from './DS1307Node';
import FlameSensorNode from './FlameSensorNode';
import FranzininhoNode from './FranzininhoNode';
import GasSensorNode from './GasSensorNode';
import HCSR04Node from './HCSR04Node';
import HeartBeatSensorNode from './HeartBeatSensorNode';
import HX711Node from './HX711Node';
import ILI9341Node from './ILI9341Node';
import IRReceiverNode from './IRReceiverNode';
import IRRemoteNode from './IRRemoteNode';
import KS2EMDC5Node from './KS2EMDC5Node';
import KY040Node from './KY040Node';
import LCD1602Node from './LCD1602Node';
import LedBarGraphNode from './LedBarGraphNode';
import LEDNode from './LEDNode';
import LEDRingNode from './LEDRingNode';
import MembraneKeypadNode from './MembraneKeypadNode';
import MicroSDCardNode from './MicroSDCardNode';
import MPU6050Node from './MPU6050Node';
import NanoRP2040ConnectNode from './NanoRP2040ConnectNode';
import NeoPixelNode from './NeoPixelNode';
import NeoPixelMatrixNode from './NeoPixelMatrixNode';
import NTCTemperatureSensorNode from './NTCTemperatureSensorNode';
import PhotoresistorSensorNode from './PhotoresistorSensorNode';
import PIRMotionSensorNode from './PIRMotionSensorNode';
import PotentiometerNode from './PotentiometerNode';
import Pushbutton6mmNode from './Pushbutton6mmNode';
import PushbuttonNode from './PushbuttonNode';
import ResistorNode from './ResistorNode';
import RGBLedNode from './RGBLedNode';
import RotaryDialerNode from './RotaryDialerNode';
import ServoNode from './ServoNode';
import SlidePotentiometerNode from './SlidePotentiometerNode';
import SlideSwitchNode from './SlideSwitchNode';
import SmallSoundSensorNode from './SmallSoundSensorNode';
import SSD1306Node from './SSD1306Node';
import StepperMotorNode from './StepperMotorNode';
import TiltSwitchNode from './TiltSwitchNode';
import WireEdge from './WireEdge';
import WireConnectionLine from './WireConnectionLine';
import BatteryNode from './BatteryNode';

const onNodeDrag: OnNodeDrag = (_, node: Node, nodes: Node[]) => console.log('drag', node, nodes);
const onNodeDragStart = (_: MouseEvent, node: Node, nodes: Node[]) => console.log('drag start', node, nodes);
const onNodeDragStop = (_: MouseEvent, node: Node, nodes: Node[]) => console.log('drag stop', node, nodes);
const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);

const printSelectionEvent = (name: string) => (_: MouseEvent, nodes: Node[]) => console.log(name, nodes);

const initialNodes: Node[] = [
  {
    id: 'battery-1',
    type: 'battery',
    position: { x: 100, y: 200 },
    data: { label: 'Battery', voltage: 9 },
  },
  {
    id: 'pushbutton-1',
    type: 'pushbutton',
    position: { x: 300, y: 200 },
    data: { label: 'Pushbutton' },
  },
  {
    id: 'resistor-1',
    type: 'resistor',
    position: { x: 500, y: 200 },
    data: { label: 'Resistor', resistance: 1000 },
  },
  {
    id: 'led-1',
    type: 'led',
    position: { x: 700, y: 200 },
    data: { label: 'LED', color: 'red' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1',
    source: 'battery-1',
    sourceHandle: 'pos',
    target: 'pushbutton-1',
    targetHandle: '1.l-target',
    type: 'wire',
    data: { color: '#ef4444', animated: false },
  },
  {
    id: 'e2',
    source: 'pushbutton-1',
    sourceHandle: '2.l-source',
    target: 'resistor-1',
    targetHandle: '1-target',
    type: 'wire',
    data: { color: '#ef4444', animated: false },
  },
  {
    id: 'e3',
    source: 'resistor-1',
    sourceHandle: '2-source',
    target: 'led-1',
    targetHandle: 'A-target',
    type: 'wire',
    data: { color: '#ef4444', animated: false },
  },
  {
    id: 'e4',
    source: 'led-1',
    sourceHandle: 'C-source',
    target: 'battery-1',
    targetHandle: 'neg',
    type: 'wire',
    data: { color: '#1f2937', animated: false },
  },
];

const defaultEdgeOptions = {
  type: 'smoothstep',
};
const fitViewOptions: FitViewOptions = {
  padding: { top: '100px', left: '0%', right: '10%', bottom: 0.1 },
};

const nodeTypes: NodeTypes = {
  battery: BatteryNode,
  sevenSegment: SevenSegmentNode,
  analogJoystick: AnalogJoystickNode,
  arduinoMega: ArduinoMegaNode,
  arduinoNano: ArduinoNanoNode,
  arduinoUno: ArduinoUnoNode,
  biaxialStepper: BiaxialStepperNode,
  bigSoundSensor: BigSoundSensorNode,
  esp32DevkitV1: ESP32DevkitV1Node,
  buzzer: BuzzerNode,
  dht22: DHT22Node,
  dipSwitch8: DipSwitch8Node,
  ds1307: DS1307Node,
  flameSensor: FlameSensorNode,
  franzininho: FranzininhoNode,
  gasSensor: GasSensorNode,
  hcsr04: HCSR04Node,
  heartBeatSensor: HeartBeatSensorNode,
  hx711: HX711Node,
  ili9341: ILI9341Node,
  irReceiver: IRReceiverNode,
  irRemote: IRRemoteNode,
  ks2emdc5: KS2EMDC5Node,
  ky040: KY040Node,
  lcd1602: LCD1602Node,
  ledBarGraph: LedBarGraphNode,
  led: LEDNode,
  ledRing: LEDRingNode,
  membraneKeypad: MembraneKeypadNode,
  microSDCard: MicroSDCardNode,
  mpu6050: MPU6050Node,
  nanoRP2040Connect: NanoRP2040ConnectNode,
  neoPixel: NeoPixelNode,
  neoPixelMatrix: NeoPixelMatrixNode,
  ntcTemperatureSensor: NTCTemperatureSensorNode,
  photoresistorSensor: PhotoresistorSensorNode,
  pirMotionSensor: PIRMotionSensorNode,
  potentiometer: PotentiometerNode,
  pushbutton6mm: Pushbutton6mmNode,
  pushbutton: PushbuttonNode,
  resistor: ResistorNode,
  rgbLed: RGBLedNode,
  rotaryDialer: RotaryDialerNode,
  servo: ServoNode,
  slidePotentiometer: SlidePotentiometerNode,
  slideSwitch: SlideSwitchNode,
  smallSoundSensor: SmallSoundSensorNode,
  ssd1306: SSD1306Node,
  stepperMotor: StepperMotorNode,
  tiltSwitch: TiltSwitchNode,
};

const edgeTypes: EdgeTypes = {
  wire: WireEdge as any,
};

const componentLibrary = [
  { type: 'battery', label: 'Battery', color: '#4CAF50' },
  { type: 'sevenSegment', label: '7-Segment Display', color: '#ff6b6b' },
  { type: 'analogJoystick', label: 'Analog Joystick', color: '#4ecdc4' },
  { type: 'arduinoMega', label: 'Arduino Mega', color: '#45b7d1' },
  { type: 'arduinoNano', label: 'Arduino Nano', color: '#96ceb4' },
  { type: 'arduinoUno', label: 'Arduino Uno', color: '#5a9fd4' },
  { type: 'biaxialStepper', label: 'Biaxial Stepper', color: '#9b59b6' },
  { type: 'bigSoundSensor', label: 'Big Sound Sensor', color: '#e74c3c' },
  { type: 'esp32DevkitV1', label: 'ESP32 DevKit V1', color: '#f39c12' },
  { type: 'buzzer', label: 'Buzzer', color: '#3498db' },
  { type: 'dht22', label: 'DHT22', color: '#1abc9c' },
  { type: 'dipSwitch8', label: 'DIP Switch 8', color: '#e74c3c' },
  { type: 'ds1307', label: 'DS1307 RTC', color: '#2980b9' },
  { type: 'flameSensor', label: 'Flame Sensor', color: '#e67e22' },
  { type: 'franzininho', label: 'Franzininho DIY', color: '#27ae60' },
  { type: 'gasSensor', label: 'Gas Sensor', color: '#16a085' },
  { type: 'hcsr04', label: 'HC-SR04 Ultrasonic', color: '#34495e' },
  { type: 'heartBeatSensor', label: 'Heart Beat Sensor', color: '#c0392b' },
  { type: 'hx711', label: 'HX711 Load Cell Amp', color: '#1c8944' },
  { type: 'ili9341', label: 'ILI9341 TFT Display', color: '#931917' },
  { type: 'irReceiver', label: 'IR Receiver', color: '#171514' },
  { type: 'irRemote', label: 'IR Remote', color: '#272726' },
  { type: 'ks2emdc5', label: 'KS2E-M-DC5 Relay', color: '#f7b93c' },
  { type: 'ky040', label: 'KY-040 Rotary Encoder', color: '#666666' },
  { type: 'lcd1602', label: 'LCD1602 Display', color: '#6cb201' },
  { type: 'ledBarGraph', label: 'LED Bar Graph', color: '#dc012d' },
  { type: 'led', label: 'LED', color: '#ff8080' },
  { type: 'ledRing', label: 'LED Ring', color: '#ff3366' },
  { type: 'membraneKeypad', label: 'Membrane Keypad', color: '#454449' },
  { type: 'microSDCard', label: 'MicroSD Card', color: '#a1111b' },
  { type: 'mpu6050', label: 'MPU6050 Gyro/Accel', color: '#16619d' },
  { type: 'nanoRP2040Connect', label: 'Nano RP2040 Connect', color: '#1a466b' },
  { type: 'neoPixel', label: 'NeoPixel', color: '#e6e6e6' },
  { type: 'neoPixelMatrix', label: 'NeoPixel Matrix', color: '#ffffff' },
  { type: 'ntcTemperatureSensor', label: 'NTC Temperature Sensor', color: '#0f3661' },
  { type: 'photoresistorSensor', label: 'Photoresistor Sensor', color: '#1c2546' },
  { type: 'pirMotionSensor', label: 'PIR Motion Sensor', color: '#253674' },
  { type: 'potentiometer', label: 'Potentiometer', color: '#045881' },
  { type: 'pushbutton6mm', label: 'Pushbutton 6mm', color: '#ff0000' },
  { type: 'pushbutton', label: 'Pushbutton', color: '#ff0000' },
  { type: 'resistor', label: 'Resistor', color: '#d5b597' },
  { type: 'rgbLed', label: 'RGB LED', color: '#e6e6e6' },
  { type: 'rotaryDialer', label: 'Rotary Dialer', color: '#1F1F1F' },
  { type: 'servo', label: 'Servo Motor', color: '#666666' },
  { type: 'slidePotentiometer', label: 'Slide Potentiometer', color: '#7a7a7a' },
  { type: 'slideSwitch', label: 'Slide Switch', color: '#808080' },
  { type: 'smallSoundSensor', label: 'Small Sound Sensor', color: '#931917' },
  { type: 'ssd1306', label: 'SSD1306 OLED Display', color: '#025CAF' },
  { type: 'stepperMotor', label: 'Stepper Motor', color: '#666666' },
  { type: 'tiltSwitch', label: 'Tilt Switch', color: '#19365e' },
];

const wireColors = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Black', value: '#1f2937' },
  { name: 'White', value: '#f3f4f6' },
  { name: 'Gray', value: '#6b7280' },
];

const BasicFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [selectedWireColor, setSelectedWireColor] = useState(wireColors[0].value);

  // Use the real simulation engine
  const {
    start,
    stop,
    toggle,
    isRunning,
    updateComponentInput,
    getVisualStates,
  } = useSimulation({
    autoStart: false,
    debug: true,
    timeStep: 50,
  });

  // Sync simulation visuals to nodes
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const visualStates = getVisualStates();

      setNodes((nds) =>
        nds.map((node) => {
          const state = visualStates.get(node.id);
          if (state) {
            // Get voltage info for debugging
            const component = state as any;
            const voltageInfo: Record<string, number> = {};

            // Extract pin voltages if available
            if (component.pins) {
              for (const [pinName, pinState] of Object.entries(component.pins)) {
                voltageInfo[pinName] = (pinState as any).voltage || 0;
              }
            }

            // Only update if changed to avoid unnecessary re-renders
            if (JSON.stringify(node.data.simulation) !== JSON.stringify(state)) {
              return {
                ...node,
                data: {
                  ...node.data,
                  ...state, // Spread visual state (brightness, blown, etc) directly into data
                  simulation: state, // Keep a copy for diffing
                  voltages: voltageInfo, // Add voltage info for debugging
                },
              };
            }
          }
          return node;
        })
      );
    }, 50); // 20fps update for UI

    return () => clearInterval(interval);
  }, [isRunning, getVisualStates, setNodes]);

  // Handle button events (update simulation input)
  const handleButtonPress = useCallback(() => {
    console.log('🔴 Button pressed!');
    updateComponentInput('pushbutton-1', 'pressed', true);
  }, [updateComponentInput]);

  const handleButtonRelease = useCallback(() => {
    console.log('🔵 Button released!');
    updateComponentInput('pushbutton-1', 'pressed', false);
  }, [updateComponentInput]);

  // Listen to button events
  useEffect(() => {
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.nodeId === 'pushbutton-1') {
        if (customEvent.type === 'button-press') {
          handleButtonPress();
        } else if (customEvent.type === 'button-release') {
          handleButtonRelease();
        }
      }
    };

    window.addEventListener('button-press', handleCustomEvent);
    window.addEventListener('button-release', handleCustomEvent);

    return () => {
      window.removeEventListener('button-press', handleCustomEvent);
      window.removeEventListener('button-release', handleCustomEvent);
    };
  }, [handleButtonPress, handleButtonRelease]);

  const {
    addNodes,
    getNodes,
    getEdges,
    deleteElements,
    updateNodeData,
    toObject,
    setViewport,
    fitView,
    screenToFlowPosition,
  } = useReactFlow();

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'wire',
            data: { color: selectedWireColor, animated: false },
          },
          eds
        )
      ),
    [setEdges, selectedWireColor]
  );

  const updatePos = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        return {
          ...node,
          position: {
            x: Math.random() * 400,
            y: Math.random() * 400,
          },
        };
      })
    );
  };

  const logToObject = () => console.log(toObject());
  const resetTransform = () => setViewport({ x: 0, y: 0, zoom: 1 });

  const toggleClassnames = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        return {
          ...node,
          className: node.className === 'light' ? 'dark' : 'light',
        };
      })
    );
  };

  const deleteSelectedElements = useCallback(() => {
    const selectedNodes = getNodes().filter((node) => node.selected);
    const selectedEdges = getEdges().filter((edge) => edge.selected);
    deleteElements({ nodes: selectedNodes, edges: selectedEdges });
  }, [deleteElements]);

  const deleteSomeElements = useCallback(() => {
    deleteElements({ nodes: [{ id: '2' }], edges: [{ id: 'e1-3' }] });
  }, []);

  const onSetNodes = () => {
    setNodes([
      { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node a' } },
      { id: 'b', position: { x: 0, y: 150 }, data: { label: 'Node b' } },
    ]);

    setEdges([{ id: 'a-b', source: 'a', target: 'b' }]);
    fitView();
  };

  const onUpdateNode = () => {
    updateNodeData('1', { label: 'update' });
    updateNodeData('2', { label: 'update' });
  };
  const addNode = () => {
    addNodes({
      id: `${Math.random()}`,
      data: { label: 'Node' },
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      className: 'light',
    });
    fitView();
  };
  const [isHidden, setIsHidden] = useState(false);

  const toggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      addNodes(newNode);
    },
    [screenToFlowPosition, addNodes]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onSelectionDragStart={printSelectionEvent('selection drag start')}
        onSelectionDrag={printSelectionEvent('selection drag')}
        onSelectionDragStop={printSelectionEvent('selection drag stop')}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="react-flow-basic-example"
        style={{ display: isHidden ? 'none' : 'block' }}
        minZoom={0.2}
        maxZoom={4}
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        selectNodesOnDrag={false}
        elevateEdgesOnSelect
        elevateNodesOnSelect={false}
        nodeDragThreshold={0}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={WireConnectionLine}
      >
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap />
        <Controls />
        <ComponentPanel components={componentLibrary} position="top-left" />

        <Panel position="bottom-left" style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: 'white', padding: '12px', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold' }}>Simulation</h4>
            <button
              onClick={toggle}
              style={{
                padding: '8px 16px',
                background: isRunning ? '#ef4444' : '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              {isRunning ? '⏸ Stop' : '▶ Simulate'}
            </button>
          </div>

          {isRunning && (
            <div style={{ background: 'white', padding: '12px', borderRadius: '4px', maxWidth: '300px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold' }}>Voltages</h4>
              <div style={{ fontSize: '10px', fontFamily: 'monospace' }}>
                {nodes.map((node) => {
                  const voltages = (node.data as any).voltages;
                  if (!voltages || Object.keys(voltages).length === 0) return null;
                  return (
                    <div key={node.id} style={{ marginBottom: '4px' }}>
                      <strong>{node.id}:</strong>
                      {Object.entries(voltages).map(([pin, voltage]) => (
                        <div key={pin} style={{ marginLeft: '8px' }}>
                          {pin}: {(voltage as number).toFixed(2)}V
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ background: 'white', padding: '12px', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold' }}>Wire Color</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {wireColors.map((wire) => (
                <div
                  key={wire.value}
                  onClick={() => setSelectedWireColor(wire.value)}
                  style={{
                    width: '30px',
                    height: '30px',
                    background: wire.value,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border:
                      selectedWireColor === wire.value ? '3px solid #0066cc' : '2px solid #dee2e6',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: wire.value === '#f3f4f6' ? '#000' : '#fff',
                    fontWeight: selectedWireColor === wire.value ? 'bold' : 'normal',
                  }}
                  title={wire.name}
                >
                  {selectedWireColor === wire.value && '✓'}
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel position="top-right">
          <button onClick={resetTransform}>reset transform</button>
          <button onClick={updatePos}>change pos</button>
          <button onClick={toggleClassnames}>toggle classnames</button>
          <button onClick={logToObject}>toObject</button>

          <button onClick={deleteSelectedElements}>deleteSelectedElements</button>
          <button onClick={deleteSomeElements}>deleteSomeElements</button>
          <button onClick={onSetNodes}>setNodes</button>
          <button onClick={onUpdateNode}>updateNode</button>
          <button onClick={addNode}>addNode</button>
        </Panel>
      </ReactFlow>
      <button
        onClick={toggleVisibility}
        style={{ position: 'absolute', zIndex: 10, right: 10, top: 100 }}
      >
        {isHidden ? 'Show' : 'Hide'} Flow
      </button>
    </div>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <BasicFlow />
    </ReactFlowProvider>
  );
}
