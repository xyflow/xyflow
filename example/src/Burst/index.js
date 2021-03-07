import React, { createElement, useState } from 'react';
import ReactFlow, { ReactFlowProvider, addEdge, removeElements, Controls, MiniMap,} from 'react-flow-renderer';
import Sidebar from './Sidebar';
import { options } from './constants/fieldTypes'
import makeId from './utils/makeId'

import './dnd.css';


/* TODO 
  on subconnection doubleclick
*/



function assignSelected (node, selected, elements) {
  if(!node && elements[selected] && !elements[selected].target && !elements[selected].source) {
    return elements[selected]
  }
  return node
}


function createElementsFromArray(els) {
  return els.reduce((acc, n) => {
    return {
      ...acc,
      [n.id]: n
    }
  }, {})
}

function reReduceElements(els, cb) {
  return Object.values(els).reduce((acc, el) => {
    const newAcc = cb(acc, el)
    if(newAcc) {
      return newAcc
    }
    return {
      ...acc,
      [el.id]: el
    }
  }, {})
}

const initialElements = { 1: { 
  id: '1', 
  type: 'entity', 
  data: { label: 'Table', 
  options, 
  fields: [{name: 'Test', value: 'test', type: 'text'}] }, 
  position: { x: 250, y: 5 } } 
};


let nodeId = 0;
const getId = () => `dndnode_${nodeId++}`;

const DnDFlow = () => {
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  // the id of a selected node or connection
  const [selected, setSelected] = useState(null);
  const [elements, setElements] = useState(initialElements);
  const [error, setError] = useState(null);


  const onConnect = (params) => {
    let newConnection = params
    // swap target and source if sourceField
    if(params.sourceField) {
      newConnection = {
        ...newConnection,
        source: params.target,
        target: params.source,
        sourceHandle: params.targetHandle,
        targetHandle: params.sourceHandle,
        sourceField: false,
        targetField: true
      }
    }
    setElements((els) => 
    {
      return createElementsFromArray(addEdge(
        { 
          ...newConnection, 
          startArrowHeadType: 'one_to_one_start', 
          relationType: 'one-to-one', 
          type: 'smoothstep' }, 
          Object.values(els)
        )
      )
    });
  };
  console.log(elements)

  const onElementsRemove = (elementsToRemove) => 
  {
    if(elementsToRemove.find(({id}) => selected === id)) {
      setSelected(() => null)
    }
    setElements((els) => {
      return createElementsFromArray(removeElements(elementsToRemove, Object.values(els)))
    });
  }

  const onLoad = (_reactFlowInstance) => setReactFlowInstance(_reactFlowInstance);

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    const position = reactFlowInstance.project({ x: event.clientX, y: event.clientY - 40 });
    const id = getId()
    const label = type === 'entity' ? `Table${nodeId}`: `${type} node`
    const newNode = {
      id,
      type,
      position,
      data: { label, options },
    };
    setElements((es) => {
      return { ...es, [id]: newNode}
    });
  };
  
  const onAddField = (event, node) => {
    node = assignSelected(node, selected, elements);
    setElements((elements) => {
      const randomName = makeId(8)
      return {
        ...elements,
        [node.id]: {
          ...elements[node.id],
          data: {
            ...elements[node.id].data,
            fields: elements[node.id]?.data?.fields ? 
            [
              ...elements[node.id]?.data?.fields, 
              { name: `field-${randomName}`, value: '', type: 'text'}
            ] : 
            [{ name: `field-${randomName}`, value: '', type: 'text'}]
          }
        }
      }
    })
  }


  const onRemoveField = (event, node) => {
    const id = event.target.id.replace('remove-', '')
    node = assignSelected(node, selected, elements);
    const newNode ={
      ...node,
      data: {
        ...node.data,
        fields: node.data.fields.map((field) => {
          if(id === field.name) {
            return undefined
          }
          return field
        }).filter((field) => field)
      }
    }

    setElements((els) => {
      const newEls = reReduceElements(els, (acc, el) => {
        if(el.targetHandle?.includes(id)) {
          return acc
        }
      })
      return {
        ...newEls,
        [node.id]: newNode
      }
    })
  }

  const onTitleChange = (event, node) => {
    node = assignSelected(node, selected, elements);
    setElements((els) => {
      return {
        ...els,
        [node.id]: {
          ...node,
          data: {
            ...node.data,
            label: event.target.value
          }

        }
      }
    })
  }

  const onFieldChange = (event, node) => {
    node = assignSelected(node, selected, elements);
    const name = event.target.name
    const slicedName = name.slice(name.length - 5, name.length)
    const isType = slicedName === '-type'
    let removeConections = false
    const newNode = {
      ...node,
      data: {
        ...node.data,
        fields: node.data.fields.map((field) => {
          if((isType && field.name === name.replace('-type', '')) || name === field.name) {
            if(isType && field.type === 'relation' && event.target.value !== 'relation') {
              removeConections = field.name
            }
            return {
              ...field,
              ...(isType && { type: event.target.value }),
              ...(!isType && { value: event.target.value })
            }
          }
          return field
        })
      }
    }
    setElements((els) => {
      let newEls = els
      if(removeConections) {
        newEls = reReduceElements(els, (acc, el) => {
          if(el.targetHandle?.includes(removeConections)) {
            return acc
          }
        })
      }
      return {
        ...newEls,
        [node.id]: newNode
      }
    })
  }

  const onSelectionChange = (els) => {

    if(els === null) {
      setSelected(() => null)
    }
    else {
      setSelected(() => els[0].id)
    }
  }



  // fields can only connect to nodes for now
  // additionally the field connection end can only the source
  // the connection and can only be 1 - 1
  // in the future they can reference indexes
  const isValidConnection = (c) => {

    if(!c.sourceField && !c.targetField){
      // check for existing node to node
      const existing = Object.values(elements).find(({ source, target, sourceField, targetField }) => {
        if(((source === c.source && target === c.target) && !(sourceField || targetField)) || 
        ((source === c.target && target === c.source) && !(sourceField || targetField)) ) {
          return true
        }
      })
      if(existing) {
        setError(() => 'Relationship between tables already exists.')
        return false
      }
      return true
    }

    if((!c.sourceField && c.targetField) || (c.sourceField && !c.targetField)){
      // check for existing field to node
            // check for existing node to node
      const existing = Object.values(elements).find(({ source, targetHandle }) => {
        const leftTarget = targetHandle?.replace('right', 'left')
        const rightTarget = targetHandle?.replace('left','right')
        if((leftTarget === c.targetHandle || 
          leftTarget === c.sourceHandle || 
          rightTarget === c.targetHandle || 
          rightTarget === c.sourceHandle) && (source === c.source || source === c.target)) {
          setError(() => 'Relationship between field and table already exists.')
          return true
        }
      })
      if(existing) {
        return false
      }
      return true
    }
    if(c.sourceField && c.targetField) {
      setError(() => "Fields cannot connect to fields.")
    }
    return false
  }

  return (
    <div className="dndflow">
        <ReactFlowProvider>
        <div className="reactflow-wrapper">
          <ReactFlow
            elements={Object.values(elements)}
            onConnect={onConnect}
            onElementsRemove={onElementsRemove}
            onSelectionChange={onSelectionChange}
            onElementClick={() => setError(null)}
            onLoad={onLoad}
            onDrop={onDrop}
            connectionLineType="smoothstep"
            onDragOver={onDragOver}
            onAddField={onAddField}
            onRemoveField={onRemoveField}
            onFieldChange={onFieldChange}
            onTitleChange={onTitleChange}
            isValidConnection={isValidConnection}
          >
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar 
          onAddField={onAddField}
          onRemoveField={onRemoveField}
          onFieldChange={onFieldChange}
          error={error}
          setError={setError}
          onTitleChange={onTitleChange}
          selected={selected}
          elements={elements}
          setSelected={setSelected}
          setElements={setElements}
        />

      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
