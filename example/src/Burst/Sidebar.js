import React from 'react';
import { Accordion, AccordionSummary, Button } from '@material-ui/core'
import SidebarFieldSummary from './components/SidebarFieldSummary'
import SidebarFieldDetails from './components/SidebarFieldDetails'
import SidebarRelationshipOptions from './components/SidebarRelationshipOptions'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


export default ({ 
  children, 
  error, 
  selected, 
  elements, 
  setElements,
  onAddField, 
  onRemoveField, 
  onTitleChange, 
  onFieldChange
}) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onRelationshipLabelChange = (event) => {
    const newNode = {
      ...elements[selected],
      label: event.target.value
    }
    setElements((els) => {
      return {
        ...els,
        [newNode.id]: newNode
      }
    })
  }

  
  const handleSwap = (event) => {
    const swappedHandles = {
      sourceHandle: selected.targetHandle,
      targetHandle: selected.sourceHandle,
      source: selected.target,
      target: selected.source,

    }
    const newNode = { ...elements[selected], ...swappedHandles }
    setElements((els) => ({...els, [selected]: newNode }))

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
      ...elements[selected],
      relationType: event.target.value.toLowerCase(),
      ...arrows
    }

    setElements((els) => {
      return {
        ...els,
        [selected]: newSelected
      }
    })
  }

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the left.</div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'entity')} draggable>
        Table Node
      </div>

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
      {elements[selected] && !elements[selected].target && !elements[selected].source &&
        <div>
          <h4>Entity Options</h4>
          <div>
            <label htmlFor="table-name" className="sidebar-label">Table Name</label>
            <input id="table-name" className="sidebar-input" name="title" onChange={onTitleChange} value={elements[selected].data.label}/>
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
              elements[selected].data?.fields?.map((field) => {
                return (
                  <Accordion key={`${selected}-${field.name}`} >
                    <SidebarFieldSummary name={field.name} value={field.value} type={field.type} onRemoveField={onRemoveField} />
                    <SidebarFieldDetails 
                      id={selected}
                      name={field.name}
                      value={field.value}
                      type={field.type}
                      typeOptions={elements[selected]?.data?.options}
                      onFieldChange={onFieldChange}
                    />
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

          {elements[selected] && elements[selected].target && elements[selected].source &&
            <SidebarRelationshipOptions
              id={selected}
              labelValue={elements[selected].label}
              relationType={elements[selected].relationType}
              onSwapClick={handleSwap}
              onRelationshipLabelChange={onRelationshipLabelChange}
              onRelationshipTypeChange={onRelationshipTypeChange}
              targetField={elements[selected].targetField}
            /> }
      {children}
    </aside>
  );
};
