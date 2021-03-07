import React from 'react';
import {  AccordionSummary } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
const SidebarFieldSummary = ({
    name,
    value,
    type,
    onRemoveField
}) => {
    return (
        <AccordionSummary  expandIcon={<ExpandMoreIcon />}>
            <button onClick={onRemoveField} id={`remove-${name}`}>-</button>
            <span className="accordion-summary-text">
            <b>{value}</b>
            <i>: {type}</i>
            </span>
        </AccordionSummary>
    )
}

export default SidebarFieldSummary;