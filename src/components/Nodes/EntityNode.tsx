import React, {memo } from 'react';

import Handle from '../../components/Handle';
import { NodeProps, Position } from '../../types';
// Make options passable
// disable while over inputs
const EntityNode = ({  data, isConnectable, onAddField, showFieldHandles, targetPosition = Position.Top }: NodeProps & any) => {

  return (<>
    <Handle type="target" position={targetPosition} isConnectable={isConnectable} />
      <div className="title-container" style={{textAlign: 'center'}}>
        <input className="title-input" value={data.title} name={'title'}/>
      </div>
      <table>
        {data?.fields?.map(({ name, value, type }: any) => {
          return (
          <tr>
            <td className="input-row">
              <div style={{position: 'relative'}} key={name}>
         
              { showFieldHandles && <Handle type="target" field position={Position.Left} isConnectable={isConnectable} />  }
                <td className="input-name-container"><div className="resize"><input className="name-input" name={name} value={value} /></div></td>
                <td><select className="type-input"  name={`${name}-type`} value={type}>
                    <option>text</option>
                    <option>number</option>
                    <option>date</option>
                    <option>boolean</option>
                  </select>
                </td>
                <td>
                  <button>-</button>
                </td>
                { showFieldHandles && <Handle type="target" field position={Position.Right} isConnectable={isConnectable} /> }
            
              </div>
              </td>
          </tr>
          )
        })
      }
      </table>
      <div style={{textAlign: 'center', marginTop: '4px', paddingBottom: '4px'}}>
        <button onClick={onAddField}>+</button>
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </>)
};

EntityNode.displayName = 'EntityNode';

export default memo(EntityNode);
