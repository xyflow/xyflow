import React, { useState } from 'react';
import ReactFlow, { ReactFlowProvider, addEdge, removeElements, Controls, MiniMap,} from 'react-flow-renderer';
import { Accordion, AccordionSummary, AccordionDetails, Button } from '@material-ui/core'
import Sidebar from './Sidebar';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './dnd.css';

const options = ['text', 'number', 'date', 'boolean', 'relation']
const initialElements = { 1: { 
  id: '1', 
  type: 'entity', 
  data: { label: 'Table', 
  options, 
  fields: [{name: 'Test', value: 'test', type: 'text'}] }, 
  position: { x: 250, y: 5 } } 
};

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

let nodeId = 0;
const getId = () => `dndnode_${nodeId++}`;

const DnDFlow = () => {
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
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
      return addEdge({ ...newConnection, startArrowHeadType: 'one_to_one_start', relationType: 'one-to-one' }, Object.values(els)).reduce((acc, n) => {
        return {
          ...acc,
          [n.id]: n
        }
      }, {})
    });
  };
  const onElementsRemove = (elementsToRemove) => 
  {
    if(elementsToRemove.find(({id}) => selected.id === id)) {
      setSelected(() => null)
    }
    setElements((els) => {
      return removeElements(elementsToRemove, Object.values(els)).reduce((acc, n) => {
        return {
          ...acc,
          [n.id]: n
        }
      }, {})
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
    if(!node && selected && !selected.target && !selected.source) {
      node = selected
    }
    setElements((elements) => {
      const randomName = makeid(8)
      return {
        ...elements,
        [node.id]: {
          ...elements[node.id],
          data: {
            ...elements[node.id].data,
            fields: elements[node.id]?.data?.fields ? 
            [...elements[node.id]?.data?.fields, { name: `field-${randomName}`, value: '', type: 'text'}] : 
            [{ name: `field-${randomName}`, value: '', type: 'text'}]
          }
        }
      }
    })
  }

  const onRemoveField = (event, node) => {
    const id = event.target.id.replace('remove-', '')

     if(!node && selected && !selected.target && !selected.source) {
      node = elements[selected.id]
    }
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
    setSelected(() => newNode)
    setElements((els) => {
  
      const newEls = Object.values(els).reduce((acc, el) => {
        if(el.targetHandle?.includes(id)) {
          return acc
        }
        return {
          ...acc,
          [el.id]: el
        }
      }, {})
      return {
        ...newEls,
        [node.id]: newNode
      }
    })
  }

  const onTitleChange = (event, node) => {
    if(!node && selected && !selected.target && !selected.source) {
      node = selected
    }
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

  const onRelationshipLabelChange = (event) => {
    const newNode = {
      ...elements[selected.id],
      label: event.target.value
    }
    setSelected(() => newNode)
    setElements((els) => {
      return {
        ...els,
        [newNode.id]: newNode
      }
    })
  }


  const onFieldChange = (event, node) => {

    if(!node && selected && !selected.target && !selected.source) {
      node = selected
    }
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
        newEls = Object.values(els).reduce((acc, el) => {
          if(el.targetHandle?.includes(removeConections)) {
            return acc
          }
          return {
            ...acc,
            [el.id]: el
          }
        }, {})
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
      setSelected(() => elements[els[0].id])
    }
  }

  const handleSwap = (event) => {
    const swappedHandles = {
      sourceHandle: selected.targetHandle,
      targetHandle: selected.sourceHandle,
      source: selected.target,
      target: selected.source,

    }
    const newNode = { ...elements[selected.id], ...swappedHandles }
    setSelected(() => newNode)
    setElements((els) => ({...els, [selected.id]: newNode }))

  }

  const onRelationshipTypeChange = (event) => {
    let arrows;
    const r = event.target.value.toLowerCase()
    switch(r){
      case 'one-to-one': {
        arrows = {
          startArrowHeadType: 'one_to_one_start',
          arrowHeadType: null
        }
        break;
      }
      case 'many-to-one': {
        arrows = {
          arrowHeadType: 'one_to_many_end',
          startArrowHeadType: null
        }
        break;
      }
      case 'one-to-many': {
        arrows = {
          arrowHeadType: null,
          startArrowHeadType: 'one_to_many_start'
        }
        break;
      }
      case 'many-to-many': {
        arrows = {
          startArrowHeadType: 'one_to_many_end',
          arrowHeadType: 'one_to_many_start',
        }
        break;
      }
      default: 
        arrows = null
    }
    const newSelected = {
      ...selected,
      relationType: event.target.value.toLowerCase(),
      ...arrows
    }
    setSelected(() => newSelected)
    setElements((els) => {
      return {
        ...els,
        [selected.id]: newSelected
      }
    })
    
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
        <Sidebar>
        {error && error}
        {!selected && (
        <>
          <Accordion className="sidebar-options-panel">
              <AccordionSummary expandIcon={<ExpandMoreIcon />} className="sidebar-options-panel-summary">
                  Database Options
              </AccordionSummary>
          </Accordion>
          <Accordion className="sidebar-options-panel">
            <AccordionSummary expandIcon={<ExpandMoreIcon />} className="sidebar-options-panel-summary">
              API Options
            </AccordionSummary>
          </Accordion>
        </>)}
        {selected && !selected.target && !selected.source &&
          <div>
            <h4>Entity Options</h4>
            <div>
              <label htmlFor="table-name" className="sidebar-label">Table Name</label>
              <input id="table-name" className="sidebar-input" name="title" onChange={onTitleChange} value={elements[selected.id].data.label}/>
            </div>
            <div>
            <Accordion className="sidebar-options-panel">
              <AccordionSummary expandIcon={<ExpandMoreIcon />} className="sidebar-options-panel-summary">
                  Database Options
              </AccordionSummary>
            </Accordion>
            <Accordion className="sidebar-options-panel">
              <AccordionSummary expandIcon={<ExpandMoreIcon />} className="sidebar-options-panel-summary">
                  API Options
              </AccordionSummary>
            </Accordion>
            <label htmlFor="fields" className="sidebar-label">Fields</label>
              {
                elements[selected.id].data?.fields?.map((field) => {
                  return (
                    <Accordion key={`${selected.id}-${field.name}`} >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <button onClick={onRemoveField} id={`remove-${field.name}`}>-</button>
                        <span className="accordion-summary-text">
                          <b>{`${field.value}`}</b>
                          <i>:{` ${field.type}`}</i>
                        </span>
                      </AccordionSummary>
                      <AccordionDetails className="accordion-details">
                        <label htmlFor={`${selected.id}-${field.name}`} className="accordion-details-label">Column Name</label>
                        <input id={`${selected.id}-${field.name}`} name={field.name} className="accordion-input" value={field.value} onChange={onFieldChange}/>
                        <br/>
                        <label htmlFor={`${selected.id}-${field.name}-type`} className="accordion-details-label">Data Type</label>
                        <select id={`${selected.id}-${field.name}-type`} name={`${field.name}-type`} className="accordion-select" value={field.type} onChange={onFieldChange}>
                          {
                            elements[selected.id]?.data?.options?.map((option) => {
                              return <option key={`sidebar-${option}`}>{option}</option>
                            })
                          }
                        </select>
                      </AccordionDetails>
                    </Accordion>
                  )
                })
              }
              <div>
                <Button variant="contained" className="sidebar-addfield-button" disableElevation fullWidth onClick={onAddField}>Add Field</Button>
              </div>
        
            </div>
          </div> 
          }

      {selected && selected.target && selected.source &&
      <div>
          <div>
            <h4>Relationship Options</h4>
            <div>
              <label htmlFor="relation-name" className="sidebar-label">Relation Name</label>
              <input id="relation-name" className="sidebar-input" value={selected.label || ''} onChange={onRelationshipLabelChange}/>
            </div>
            {!selected.targetField && <div>
              <label htmlFor="relation-type" className="sidebar-label">Relationship Type</label>
              <select id="relation-type" className="sidebar-selection" value={selected.relationType} onChange={onRelationshipTypeChange}>
                <option value="one-to-one">One-to-One</option>
                <option value="one-to-many">One-to-Many</option>
                <option value="many-to-many">Many-to-Many</option>
              </select>
            </div>}
            {selected.relationType !== 'many-to-many' && !selected.targetField && <div>
              <Button variant="contained" fullWidth onClick={handleSwap}>Swap Relationship</Button>
            </div>
            }
          </div> 
      </div> }
          </Sidebar>
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
