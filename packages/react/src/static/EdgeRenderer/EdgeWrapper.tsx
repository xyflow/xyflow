import { useMemo } from 'react';
import cc from 'classcat';
import { ConnectionMode, NodeLookup, getEdgePosition, getElevatedEdgeZIndex, getMarkerId } from '@xyflow/system';

import { builtinEdgeTypes, nullPosition } from '../../components/EdgeWrapper/utils';
import { Edge, Node, InternalNode } from '../../types';
import { ReactFlowStaticProps } from '..';

export function EdgeWrapper<NodeType extends Node = Node, EdgeType extends Edge = Edge>({
  edge,
  nodeLookup,
  edgeTypes,
}: {
  edge: Edge;
  nodeLookup: NodeLookup<InternalNode>;
  edgeTypes: ReactFlowStaticProps<NodeType, EdgeType>['edgeTypes'];
}) {
  const edgeType = edge.type || 'default';
  const EdgeComponent = edgeTypes?.[edgeType] || builtinEdgeTypes[edgeType];

  const { zIndex, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = useMemo(() => {
    const sourceNode = nodeLookup.get(edge.source);
    const targetNode = nodeLookup.get(edge.target);

    if (!sourceNode || !targetNode) {
      return {
        zIndex: edge.zIndex,
        ...nullPosition,
      };
    }

    const edgePosition = getEdgePosition({
      id: edge.id,
      sourceNode,
      targetNode,
      sourceHandle: edge.sourceHandle || null,
      targetHandle: edge.targetHandle || null,
      connectionMode: ConnectionMode.Loose,
    });

    const zIndex = getElevatedEdgeZIndex({
      selected: edge.selected,
      zIndex: edge.zIndex,
      sourceNode,
      targetNode,
      elevateOnSelect: true,
    });

    return {
      zIndex,
      ...(edgePosition || nullPosition),
    };
  }, [edge.source, edge.target, edge.sourceHandle, edge.targetHandle, edge.selected, edge.zIndex, nodeLookup]);

  const rfId = '1';

  const markerStartUrl = useMemo(
    () => (edge.markerStart ? `url('#${getMarkerId(edge.markerStart, rfId)}')` : undefined),
    [edge.markerStart, rfId]
  );

  const markerEndUrl = useMemo(
    () => (edge.markerEnd ? `url('#${getMarkerId(edge.markerEnd, rfId)}')` : undefined),
    [edge.markerEnd, rfId]
  );

  if (EdgeComponent === undefined) {
    console.error(`Node type "${edgeType}" not found.`);
    return null;
  }

  if (edge.hidden || sourceX === null || sourceY === null || targetX === null || targetY === null) {
    return null;
  }

  return (
    <svg style={{ zIndex }}>
      <g
        className={cc([
          'react-flow__edge',
          `react-flow__edge-${edgeType}`,
          edge.className,
          {
            selected: edge.selected,
            animated: edge.animated,
          },
        ])}
        role={edge.ariaRole ?? 'group'}
        aria-roledescription="edge"
        data-id={edge.id}
        data-testid={`rf__edge-${edge.id}`}
        aria-label={
          edge.ariaLabel === null ? undefined : edge.ariaLabel || `Edge from ${edge.source} to ${edge.target}`
        }
        {...edge.domAttributes}
      >
        <EdgeComponent
          id={edge.id}
          source={edge.source}
          target={edge.target}
          type={edge.type}
          selected={edge.selected}
          animated={edge.animated}
          selectable={true}
          deletable={edge.deletable ?? true}
          label={edge.label}
          labelStyle={edge.labelStyle}
          labelShowBg={edge.labelShowBg}
          labelBgStyle={edge.labelBgStyle}
          labelBgPadding={edge.labelBgPadding}
          labelBgBorderRadius={edge.labelBgBorderRadius}
          sourceX={sourceX}
          sourceY={sourceY}
          targetX={targetX}
          targetY={targetY}
          sourcePosition={sourcePosition}
          targetPosition={targetPosition}
          data={edge.data}
          style={edge.style}
          sourceHandleId={edge.sourceHandle}
          targetHandleId={edge.targetHandle}
          markerStart={markerStartUrl}
          markerEnd={markerEndUrl}
          pathOptions={'pathOptions' in edge ? edge.pathOptions : undefined}
          interactionWidth={edge.interactionWidth}
        />
      </g>
    </svg>
  );
}
