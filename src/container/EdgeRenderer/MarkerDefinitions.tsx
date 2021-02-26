import React, { ReactNode } from 'react';

interface MarkerProps {
  id: string;
  children: ReactNode;
}

const Marker = ({ id, children }: MarkerProps) => (
  <marker
    className="react-flow__arrowhead"
    id={id}
    markerWidth="12.5"
    markerHeight="12.5"
    viewBox="-10 -10 20 20"
    orient="auto"
    refX="0"
    refY="0"
  >
    {children}
  </marker>
);

interface MarkerDefinitionsProps {
  color: string;
}

const MarkerDefinitions = ({ color }: MarkerDefinitionsProps) => {
  return (
    <defs>
      <Marker id="react-flow__arrowclosed">
        <polyline
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          fill={color}
          points="-5,-4 0,0 -5,4 -5,-4"
        />
      </Marker>
      <Marker id="react-flow__arrow">
        <polyline
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          fill="none"
          points="-5,-4 0,0 -5,4"
        />
      </Marker>
      <marker id="react-flow__one_to_one_start_right"     
        className="react-flow__arrowhead"
        markerWidth="20"
        markerHeight="20"
        viewBox="-20 -20 40 40"
        orient="0"
        refX="0"
        refY="0">
        <polyline  
          points="0,-50 0,100 0,0 -100,0"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          fill="none" 
          stroke={color}  />
      </marker>
      <marker id="react-flow__one_to_one_end_right"     
        className="react-flow__arrowhead"
        markerWidth="20"
        markerHeight="20"
        viewBox="-20 -20 40 40"
        orient="-180"
        refX="0"
        refY="0">
        <polyline  
          points="0,-50 0,100 0,0 100,0"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          fill="none" 
          stroke={color}  />
      </marker>
      <marker id="react-flow__one_to_one_start_left"     
        className="react-flow__arrowhead"
        markerWidth="20"
        markerHeight="20"
        viewBox="-20 -20 40 40"
        orient="-180"
        refX="0"
        refY="0">
        <polyline  
          points="0,-50 0,100  0,0 -100,0"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          fill="none" 
          stroke={color}  />
      </marker>
      <marker id="react-flow__one_to_one_end_left"     
        className="react-flow__arrowhead"
        markerWidth="20"
        markerHeight="20"
        viewBox="-20 -20 40 40"
        orient="-180"
        refX="0"
        refY="0">
        <polyline  
          points="0,-50 0,100  0,0 -100,0"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          fill="none" 
          stroke={color}  />
      </marker>
      <marker id="react-flow__one_to_one_start_top"     
        className="react-flow__arrowhead"
        markerWidth="20"
        markerHeight="20"
        viewBox="-20 -20 40 40"
        orient="-90"
        refX="0"
        refY="0">
        <polyline  
          points="0,-50 0,100  0,0 -100,0"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          fill="none" 
          stroke={color}  />
      </marker>
      <marker id="react-flow__one_to_one_end_top"     
        className="react-flow__arrowhead"
        markerWidth="20"
        markerHeight="20"
        viewBox="-20 -20 40 40"
        orient="-90"
        refX="0"
        refY="0">
        <polyline  
          points="0,-50 0,100  0,0 -100,0"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          fill="none" 
          stroke={color}  />
      </marker>
      
      <marker id="react-flow__one_to_one_start_bottom"     
        className="react-flow__arrowhead"
        markerWidth="20"
        markerHeight="20"
        viewBox="-20 -20 40 40"
        orient="90"
        refX="0"
        refY="0">
        <polyline  
          points="0,-50 0,100  0,0 -100,0"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          fill="none" 
          stroke={color}  />
      </marker>
      <marker id="react-flow__one_to_one_end_bottom"     
        className="react-flow__arrowhead"
        markerWidth="20"
        markerHeight="20"
        viewBox="-20 -20 40 40"
        orient="90"
        refX="0"
        refY="0">
        <polyline  
          points="0,-50 0,100  0,0 -100,0"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          fill="none" 
          stroke={color}  />
      </marker>

      <marker id="react-flow__one_to_many_end_right"     
        className="react-flow__arrowhead"
        markerWidth="20"
        markerHeight="20"
        viewBox="-20 -20 40 40"
        orient="-180"
        refX="0"
        refY="0">
        <polyline  
          points="0,0 150,50 0,0 150,0 0,0 150,-50"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          fill="none" 
          stroke={color}  />

      </marker>
      <marker id="react-flow__one_to_many_start_right"     
        className="react-flow__arrowhead"
        markerWidth="20"
        markerHeight="20"
        viewBox="-20 -20 40 40"
        orient="0"
        refX="0"
        refY="0">
        <polyline  
          points="0,0 -150,50 0,0 -150,0 0,0 -150,-50"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          fill="none" 
          stroke={color}  />

      </marker>
      <marker id="react-flow__one_to_many_end_left"     
        className="react-flow__arrowhead"
        markerWidth="20"
        markerHeight="20"
        viewBox="-20 -20 40 40"
        orient="0"
        refX="0"
        refY="0">
        <polyline  
          points="0,0 150,50 0,0 150,0 0,0 150,-50"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          fill="none" 
          stroke={color}  />

      </marker>
      <marker id="react-flow__one_to_many_start_left"     
        className="react-flow__arrowhead"
        markerWidth="20"
        markerHeight="20"
        viewBox="-20 -20 40 40"
        orient="-180"
        refX="0"
        refY="0">
        <polyline  
          points="0,0 -150,50 0,0 -150,0 0,0 -150,-50"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          fill="none" 
          stroke={color}  />

      </marker>
      <marker id="react-flow__one_to_many_start_top"     
        className="react-flow__arrowhead"
        markerWidth="20"
        markerHeight="20"
        viewBox="-20 -20 40 40"
        orient="-90"
        refX="0"
        refY="0">
        <polyline  
          points="0,0 -150,50 0,0 -150,0 0,0 -150,-50"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          fill="none" 
          stroke={color}  />

      </marker> 

      <marker id="react-flow__one_to_many_end_top"     
        className="react-flow__arrowhead"
        markerWidth="20"
        markerHeight="20"
        viewBox="-20 -20 40 40"
        orient="-90"
        refX="0"
        refY="0">
        <polyline  
          points="0,0 -150,50 0,0 -150,0 0,0 -150,-50"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          fill="none" 
          stroke={color}  />

      </marker> 
      <marker id="react-flow__one_to_many_start_bottom"     
        className="react-flow__arrowhead"
        markerWidth="20"
        markerHeight="20"
        viewBox="-20 -20 40 40"
        orient="90"
        refX="0"
        refY="0">
        <polyline  
          points="0,0 -150,50 0,0 -150,0 0,0 -150,-50"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          fill="none" 
          stroke={color}  />

      </marker> 
      <marker id="react-flow__one_to_many_end_bottom"     
        className="react-flow__arrowhead"
        markerWidth="20"
        markerHeight="20"
        viewBox="-20 -20 40 40"
        orient="90"
        refX="0"
        refY="0">
        <polyline  
          points="0,0 -150,50 0,0 -150,0 0,0 -150,-50"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          fill="none" 
          stroke={color}  />

      </marker> 
    </defs>
  );
};

MarkerDefinitions.displayName = 'MarkerDefinitions';

export default MarkerDefinitions;
