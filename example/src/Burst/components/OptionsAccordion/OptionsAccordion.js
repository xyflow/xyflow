import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button } from '@material-ui/core'


const OptionsAccordion = () => {
    return (
        <Accordion className="sidebar-options-panel">
            <AccordionSummary expandIcon={<ExpandMoreIcon />} className="sidebar-options-panel-summary">
                Database Options
            </AccordionSummary>
            <AccordionDetails>
                Fish
            </AccordionDetails>
        </Accordion>
    )
}