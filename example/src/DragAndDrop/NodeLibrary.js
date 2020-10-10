import React from 'react'
import LibraryItem from './LibraryItem'

const NodeLibrary = () => {
    return (
        <div className='NodeLibrary'>
            <h1>Node Library</h1>
            <LibraryItem name='Node1'/>
            <LibraryItem name='Node2'/>
        </div>
    )
}

export default NodeLibrary