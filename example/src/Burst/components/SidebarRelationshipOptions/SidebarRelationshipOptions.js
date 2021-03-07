import React from 'react';
import Button from '@material-ui/core/Button';

const SidebarRelationshipOptions = ({
    id,
    label = 'Relationship Options',
    relationNameLabel = "Relation Name",
    relationTypeLabel = "Relation Type",
    labelValue,
    relationType,
    onSwapClick,
    onRelationshipLabelChange,
    onRelationshipTypeChange,
    SwapButtonLabel = 'Swap Relationship',
    targetField,
    options = [
        { value: 'one-to-one', label: 'One-to-One' },
        { value: 'one-to-many', label: 'One-to-Many' },
        { value: 'many-to-many', label: 'Many-to-Many' }
    ]
}) => {
    return (
        <div>
            <div>
                <h4>{label}</h4>
                <div>
                    <label htmlFor="relation-name" className="sidebar-label">{relationNameLabel}</label>
                    <input id="relation-name" className="sidebar-input" value={labelValue || ''} onChange={onRelationshipLabelChange}/>
                </div>
                {!targetField && <div>
                    <label htmlFor="relation-type" className="sidebar-label">{relationTypeLabel}</label>
                    <select id="relation-type" className="sidebar-selection" value={relationType} onChange={onRelationshipTypeChange}>
                        {
                            options.map(({ value, label: optionLabel }) => (<option key={`${id}-${value}`} value={value}>{optionLabel}</option>))
                        }
                    </select>
                </div>}
                {relationType !== 'many-to-many' && !targetField && <div>
                    <Button variant="contained" fullWidth onClick={onSwapClick}>{SwapButtonLabel}</Button>
                </div>
                }
            </div> 
        </div> 
    )
}

export default SidebarRelationshipOptions;