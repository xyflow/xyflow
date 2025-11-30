// Electrical Components for Circuit Simulation
// Export all component nodes

// Power Components
export { BatteryNode } from './nodes/power';

// Passive Components
export { ResistorNode, PotentiometerNode } from './nodes/passive';

// Output Components
export {
    LEDNode,
    RGBLedNode,
    LEDRingNode,
    LedBarGraphNode,
    NeoPixelNode,
    NeoPixelMatrixNode,
    ServoNode,
    BuzzerNode,
    StepperMotorNode,
    BiaxialStepperNode,
    KS2EMDC5Node,
} from './nodes/output';

// Display Components
export {
    LCD1602Node,
    SSD1306Node,
    ILI9341Node,
    SevenSegmentNode,
} from './nodes/output/displays';

// Input Components
export {
    PushbuttonNode,
    Pushbutton6mmNode,
    AnalogJoystickNode,
    KY040Node,
    MembraneKeypadNode,
    DipSwitch8Node,
    SlideSwitchNode,
    SlidePotentiometerNode,
    RotaryDialerNode,
    IRRemoteNode,
    IRReceiverNode,
} from './nodes/input';

// Sensor Components
export {
    DHT22Node,
    HCSR04Node,
    PIRMotionSensorNode,
    PhotoresistorSensorNode,
    NTCTemperatureSensorNode,
    FlameSensorNode,
    GasSensorNode,
    HeartBeatSensorNode,
    BigSoundSensorNode,
    SmallSoundSensorNode,
    MPU6050Node,
    HX711Node,
    TiltSwitchNode,
} from './nodes/input/sensors';

// Microcontrollers
export {
    ArduinoUnoNode,
    ArduinoMegaNode,
    ArduinoNanoNode,
    ESP32DevkitV1Node,
    FranzininhoNode,
    NanoRP2040ConnectNode,
} from './nodes/microcontrollers';

// Modules (RTC, SD Card, etc.)
export {
    DS1307Node,
    MicroSDCardNode,
} from './nodes/modules';

// Re-export simulation utilities
export { useSimulation } from '../simulation/useSimulation';
export type {
    ComponentSimulator,
    ComponentState,
    SimulationState,
    SimulationConfig,
    PinState,
    ComponentHealth,
} from '../simulation/types';

// Re-export simulators
export {
    BatterySimulator,
    ResistorSimulator,
    LEDSimulator,
    PushbuttonSimulator,
    ESP32Simulator,
} from '../simulation/simulators';
