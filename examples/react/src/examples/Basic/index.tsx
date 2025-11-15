import { MouseEvent, useCallback, useState, DragEvent, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
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
import WireEdge from './WireEdge';
import WireConnectionLine from './WireConnectionLine';

const onNodeDrag: OnNodeDrag = (_, node: Node, nodes: Node[]) => console.log('drag', node, nodes);
const onNodeDragStart = (_: MouseEvent, node: Node, nodes: Node[]) => console.log('drag start', node, nodes);
const onNodeDragStop = (_: MouseEvent, node: Node, nodes: Node[]) => console.log('drag stop', node, nodes);
const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);

const printSelectionEvent = (name: string) => (_: MouseEvent, nodes: Node[]) => console.log(name, nodes);

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    className: 'light',
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    className: 'light',
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    className: 'light',
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    className: 'light',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

const defaultEdgeOptions = {
  type: 'smoothstep',
};
const fitViewOptions: FitViewOptions = {
  padding: { top: '100px', left: '0%', right: '10%', bottom: 0.1 },
};

const nodeTypes: NodeTypes = {
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
};

const edgeTypes: EdgeTypes = {
  wire: WireEdge,
};

const componentLibrary = [
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
            zIndex: 1000, // Render wires on top of components
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

  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
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
    <>
      <div style={{ display: 'flex', height: '100%', width: '100%' }}>
        {/* Sidebar */}
        <div
          style={{
            width: '200px',
            padding: '20px',
            background: '#f8f9fa',
            borderRight: '1px solid #dee2e6',
            overflowY: 'auto',
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: '14px', fontWeight: 'bold', color: '#495057' }}>
            Components
          </h3>
          {componentLibrary.map((component) => (
            <div
              key={component.type}
              draggable
              onDragStart={(event) => onDragStart(event, component.type)}
              style={{
                padding: '10px',
                margin: '10px 0',
                background: component.color,
                color: 'white',
                borderRadius: '4px',
                cursor: 'grab',
                fontSize: '12px',
                fontWeight: '500',
                textAlign: 'center',
                userSelect: 'none',
              }}
            >
              {component.label}
            </div>
          ))}
          <div style={{ marginTop: '20px', fontSize: '11px', color: '#6c757d' }}>
            Drag components onto the canvas to add them
          </div>

          {/* Wire Color Picker */}
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #dee2e6' }}>
            <h3 style={{ marginTop: 0, fontSize: '14px', fontWeight: 'bold', color: '#495057' }}>
              Wire Color
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {wireColors.map((wire) => (
                <div
                  key={wire.value}
                  onClick={() => setSelectedWireColor(wire.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    background: wire.value,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border:
                      selectedWireColor === wire.value
                        ? '3px solid #0066cc'
                        : '2px solid #dee2e6',
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
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#6c757d' }}>
              Click a color to select wire color for new connections
            </div>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div ref={reactFlowWrapper} style={{ flexGrow: 1, height: '100%' }}>
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
      </div>
    </>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <BasicFlow />
    </ReactFlowProvider>
  );
}
