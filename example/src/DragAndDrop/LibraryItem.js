import React from 'react'

const LibraryItem = ({name}) => {

    const handleDrag = (event) => {
        event.dataTransfer.setData('dragItem', JSON.stringify({name: name}))
    }

    return (
        <div className='LibraryItem' draggable onDragStart={handleDrag}>
            {name}
        </div>
    )
}

export default LibraryItem
