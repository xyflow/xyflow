import React from 'react';
import { AccordionDetails } from '@material-ui/core'
const SidebarFieldDetails = ({
    id,
    name,
    value,
    type,
    typeOptions,
    onFieldChange,
    keyLabel = 'Column Name',
    typeLabel = 'Data Type'
}) => {
    return (
      <AccordionDetails className="accordion-details">
        <label htmlFor={`${id}-${name}`} className="accordion-details-label">{keyLabel}</label>
        <input id={`${id}-${name}`} name={name} className="accordion-input" value={value} onChange={onFieldChange}/>
        <br/>
        <label htmlFor={`${id}-${name}-type`} className="accordion-details-label">{typeLabel}</label>
        <select id={`${id}-${name}-type`} name={`${name}-type`} className="accordion-select" value={type} onChange={onFieldChange}>
          {
            typeOptions?.map((option) => {
              return <option key={`sidebar-${option}`}>{option}</option>
            })
          }
        </select>
      </AccordionDetails>
    )
}

export default SidebarFieldDetails