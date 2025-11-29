import { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';

export type BatteryNode = Node<{
    voltage?: number;
    label?: string;
}, 'battery'>;

const BatteryNodeComponent = ({ data, id }: NodeProps<BatteryNode>) => {
    const voltage = (data.voltage as number) || 9;
    const label = (data.label as string) || '';

    const pinInfo = [
        { name: 'pos', x: 10, y: 0, position: Position.Top },
        { name: 'neg', x: 10, y: 60, position: Position.Bottom },
    ];

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            {pinInfo.map((pin) => {
                const handleStyle = {
                    position: 'absolute' as const,
                    left: `${pin.x}px`,
                    top: `${pin.y}px`,
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    border: '1px solid #555',
                    background: pin.name === 'pos' ? '#ff0072' : '#1a192b',
                };

                return (
                    <div key={pin.name}>
                        <Handle
                            type="source"
                            position={pin.position}
                            id={pin.name}
                            style={handleStyle}
                        />
                        <Handle
                            type="target"
                            position={pin.position}
                            id={pin.name}
                            style={handleStyle}
                        />
                    </div>
                );
            })}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30px' }}>
                <svg
                    width="30"
                    height="60"
                    viewBox="0 0 30 60"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ userSelect: 'none' }}
                >
                    {/* Positive terminal (longer line) */}
                    <line x1="5" y1="15" x2="25" y2="15" stroke="#000" strokeWidth="3" />

                    {/* Negative terminal (shorter line) */}
                    <line x1="8" y1="45" x2="22" y2="45" stroke="#000" strokeWidth="3" />

                    {/* Connecting lines */}
                    <line x1="15" y1="15" x2="15" y2="25" stroke="#666" strokeWidth="1.5" />
                    <line x1="15" y1="35" x2="15" y2="45" stroke="#666" strokeWidth="1.5" />

                    {/* Battery body */}
                    <rect x="7" y="25" width="16" height="10" fill="#e0e0e0" stroke="#666" strokeWidth="1" />

                    {/* Plus sign */}
                    <text x="15" y="12" fontSize="10" fill="#ff0000" textAnchor="middle" fontWeight="bold">+</text>

                    {/* Minus sign */}
                    <text x="15" y="54" fontSize="10" fill="#000" textAnchor="middle" fontWeight="bold">−</text>

                    {/* Voltage label */}
                    <text x="15" y="31" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold">{voltage}V</text>
                </svg>
                {label && (
                    <span
                        style={{
                            fontSize: '10px',
                            textAlign: 'center',
                            color: 'gray',
                            marginTop: '4px',
                        }}
                    >
                        {label}
                    </span>
                )}
            </div>
        </div>
    );
};

BatteryNodeComponent.displayName = 'BatteryNode';
export default memo(BatteryNodeComponent);
