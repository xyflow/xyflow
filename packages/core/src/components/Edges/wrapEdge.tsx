import { memo, useState, useMemo, useRef } from 'react';
import type { ComponentType, KeyboardEvent } from 'react';
import cc from 'classcat';

import { useStoreApi } from '../../hooks/useStore';
import { ARIA_EDGE_DESC_KEY } from '../A11yDescriptions';
import { handleMouseDown } from '../Handle/handler';
import { EdgeAnchor } from './EdgeAnchor';
import { getMarkerId } from '../../utils/graph';
import { getMouseHandler } from './utils';
import { elementSelectionKeys } from '../../utils';
import type { EdgeProps, WrapEdgeProps, Connection } from '../../types';

export default (EdgeComponent: ComponentType<EdgeProps>) => {
  const EdgeWrapper = ({
    id,
    className,
    type,
    data,
    onClick,
    onEdgeDoubleClick,
    selected,
    animated,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius,
    style,
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    elementsSelectable,
    hidden,
    sourceHandleId,
    targetHandleId,
    onContextMenu,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    edgeUpdaterRadius,
    onEdgeUpdate,
    onEdgeUpdateStart,
    onEdgeUpdateEnd,
    markerEnd,
    markerStart,
    rfId,
    ariaLabel,
    isFocusable,
    pathOptions,
    interactionWidth,
  }: WrapEdgeProps): JSX.Element | null => {
    const edgeRef = useRef<SVGGElement>(null);
    const [updateHover, setUpdateHover] = useState<boolean>(false);
    const [updating, setUpdating] = useState<boolean>(false);
    const store = useStoreApi();

    const markerStartUrl = useMemo(() => `url(#${getMarkerId(markerStart, rfId)})`, [markerStart, rfId]);
    const markerEndUrl = useMemo(() => `url(#${getMarkerId(markerEnd, rfId)})`, [markerEnd, rfId]);

    if (hidden) {
      return null;
    }

    const onEdgeClick = (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
      const { edges, addSelectedEdges } = store.getState();

      if (elementsSelectable) {
        store.setState({ nodesSelectionActive: false });
        addSelectedEdges([id]);
      }

      if (onClick) {
        const edge = edges.find((e) => e.id === id)!;
        onClick(event, edge);
      }
    };

    const onEdgeDoubleClickHandler = getMouseHandler(id, store.getState, onEdgeDoubleClick);
    const onEdgeContextMenu = getMouseHandler(id, store.getState, onContextMenu);
    const onEdgeMouseEnter = getMouseHandler(id, store.getState, onMouseEnter);
    const onEdgeMouseMove = getMouseHandler(id, store.getState, onMouseMove);
    const onEdgeMouseLeave = getMouseHandler(id, store.getState, onMouseLeave);

    const handleEdgeUpdater = (event: React.MouseEvent<SVGGElement, MouseEvent>, isSourceHandle: boolean) => {
      const nodeId = isSourceHandle ? target : source;
      const handleId = (isSourceHandle ? targetHandleId : sourceHandleId) || null;
      const handleType = isSourceHandle ? 'target' : 'source';
      const isValidConnection = () => true;
      const isTarget = isSourceHandle;
      const edge = store.getState().edges.find((e) => e.id === id)!;

      setUpdating(true);
      onEdgeUpdateStart?.(event, edge, handleType);

      const _onEdgeUpdateEnd = (evt: MouseEvent) => {
        setUpdating(false);
        onEdgeUpdateEnd?.(evt, edge, handleType);
      };

      const onConnectEdge = (connection: Connection) => onEdgeUpdate?.(edge, connection);

      handleMouseDown({
        event,
        handleId,
        nodeId,
        onConnect: onConnectEdge,
        isTarget,
        getState: store.getState,
        setState: store.setState,
        isValidConnection,
        elementEdgeUpdaterType: handleType,
        onEdgeUpdateEnd: _onEdgeUpdateEnd,
      });
    };

    const onEdgeUpdaterSourceMouseDown = (event: React.MouseEvent<SVGGElement, MouseEvent>): void =>
      handleEdgeUpdater(event, true);
    const onEdgeUpdaterTargetMouseDown = (event: React.MouseEvent<SVGGElement, MouseEvent>): void =>
      handleEdgeUpdater(event, false);

    const onEdgeUpdaterMouseEnter = () => setUpdateHover(true);
    const onEdgeUpdaterMouseOut = () => setUpdateHover(false);

    const inactive = !elementsSelectable && !onClick;
    const handleEdgeUpdate = typeof onEdgeUpdate !== 'undefined';

    const onKeyDown = (event: KeyboardEvent) => {
      if (elementSelectionKeys.includes(event.key) && elementsSelectable) {
        const { unselectNodesAndEdges, addSelectedEdges, edges } = store.getState();
        const unselect = event.key === 'Escape';

        if (unselect) {
          edgeRef.current?.blur();
          unselectNodesAndEdges({ edges: [edges.find((e) => e.id === id)!] });
        } else {
          addSelectedEdges([id]);
        }
      }
    };

    return (
      <g
        className={cc([
          'react-flow__edge',
          `react-flow__edge-${type}`,
          className,
          { selected, animated, inactive, updating: updateHover },
        ])}
        onClick={onEdgeClick}
        onDoubleClick={onEdgeDoubleClickHandler}
        onContextMenu={onEdgeContextMenu}
        onMouseEnter={onEdgeMouseEnter}
        onMouseMove={onEdgeMouseMove}
        onMouseLeave={onEdgeMouseLeave}
        onKeyDown={isFocusable ? onKeyDown : undefined}
        tabIndex={isFocusable ? 0 : undefined}
        role={isFocusable ? 'button' : undefined}
        data-testid={`rf__edge-${id}`}
        aria-label={ariaLabel === null ? undefined : ariaLabel ? ariaLabel : `Edge from ${source} to ${target}`}
        aria-describedby={isFocusable ? `${ARIA_EDGE_DESC_KEY}-${rfId}` : undefined}
        ref={edgeRef}
      >
        {!updating && (
          <EdgeComponent
            id={id}
            source={source}
            target={target}
            selected={selected}
            animated={animated}
            label={label}
            labelStyle={labelStyle}
            labelShowBg={labelShowBg}
            labelBgStyle={labelBgStyle}
            labelBgPadding={labelBgPadding}
            labelBgBorderRadius={labelBgBorderRadius}
            data={data}
            style={style}
            sourceX={sourceX}
            sourceY={sourceY}
            targetX={targetX}
            targetY={targetY}
            sourcePosition={sourcePosition}
            targetPosition={targetPosition}
            sourceHandleId={sourceHandleId}
            targetHandleId={targetHandleId}
            markerStart={markerStartUrl}
            markerEnd={markerEndUrl}
            pathOptions={pathOptions}
            interactionWidth={interactionWidth}
          />
        )}
        {handleEdgeUpdate && (
          <>
            <EdgeAnchor
              position={sourcePosition}
              centerX={sourceX}
              centerY={sourceY}
              radius={edgeUpdaterRadius}
              onMouseDown={onEdgeUpdaterSourceMouseDown}
              onMouseEnter={onEdgeUpdaterMouseEnter}
              onMouseOut={onEdgeUpdaterMouseOut}
              type="source"
            />
            <EdgeAnchor
              position={targetPosition}
              centerX={targetX}
              centerY={targetY}
              radius={edgeUpdaterRadius}
              onMouseDown={onEdgeUpdaterTargetMouseDown}
              onMouseEnter={onEdgeUpdaterMouseEnter}
              onMouseOut={onEdgeUpdaterMouseOut}
              type="target"
            />
          </>
        )}
      </g>
    );
  };

  EdgeWrapper.displayName = 'EdgeWrapper';

  return memo(EdgeWrapper);
};
