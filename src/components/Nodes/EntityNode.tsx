import React, {memo } from 'react';

import Handle from '../../components/Handle';
import { NodeProps, Position } from '../../types';

// disable while over inputs
const EntityNode = ({  data, isConnectable, onAddField, onRemoveField, onTitleChange, onFieldChange, showFieldHandles, horizontalHandles = true, targetPosition = Position.Top, id }: NodeProps & any) => {
  return (<>
    <Handle type="target/source" id={`${id}-top`} position={targetPosition} isConnectable={isConnectable} />
    {horizontalHandles && <Handle type="target/source" id={`${id}-left`} position={Position.Left} isConnectable={isConnectable} />}
      <div className="title-container" style={{textAlign: 'center'}}>
        <input className="title-input" value={data.label} onChange={onTitleChange} name={'title'}/>
      </div>
      <table>
          <tbody>
          {data?.fields?.map(({ name, value, type }: any) => {
            return (
            <tr  key={`${id}-${name}`}>
              <td className="input-row">
                <div style={{position: 'relative'}}>
                { showFieldHandles && <Handle type="target" field position={Position.Left} isConnectable={isConnectable} />  }
                <table>
                  <tbody>
                    <tr>
 
                  <td className="input-name-container">
                    <div className="resize">
                      <input className="name-input" name={name} value={value} onChange={data.onFieldChange || onFieldChange}/>
                    </div>
                  </td>
                  <td>
                    <select className="type-input"  name={`${name}-type`} value={type} onChange={data.onFieldChange || onFieldChange}>
                      {(data?.field?.options || data.options)?.map((option: string) => {
                        return <option key={`${id}-${option}`}>{option}</option>
                      })}
                    </select>
                  </td>
                  <td>
                    <button id={`remove-${name}`} onClick={data.onRemoveField || onRemoveField}>-</button>
                  </td>
                  </tr>

                  </tbody>
                    </table>
                    { showFieldHandles && <Handle type="target/source" field position={Position.Right} isConnectable={isConnectable} /> }
                </div>
                </td>
            </tr>
            )
          })
        }
        </tbody>
      </table>
      <div style={{textAlign: 'center', marginTop: '4px', paddingBottom: '4px'}}>
        <button onClick={onAddField}>+</button>
      </div>
      { horizontalHandles &&  <Handle type="target/source" id={`${id}-right`} position={Position.Right} isConnectable={isConnectable} /> }

      <Handle type="target/source"position={Position.Bottom} id={`${id}-bottom`} isConnectable={isConnectable} />
    </>)
};

EntityNode.displayName = 'EntityNode';

export default memo(EntityNode);
