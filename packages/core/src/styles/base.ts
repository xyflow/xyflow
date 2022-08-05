const style = `
.react-flow__container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.react-flow__pane {
  z-index: 1;
}

.react-flow__viewport {
  transform-origin: 0 0;
  z-index: 2;
  pointer-events: none;
}

.react-flow__renderer {
  z-index: 4;
}

.react-flow__selectionpane {
  z-index: 5;
}

.react-flow__nodesselection-rect,
.react-flow__selection {
  background: rgba(150, 150, 180, 0.1);
  border: 1px dotted rgba(155, 155, 155, 0.8);
}

.react-flow__nodesselection-rect:focus,
.react-flow__nodesselection-rect:focus-visible {
  outline: none;
}

.react-flow .react-flow__edges {
  pointer-events: none;
  overflow: visible;
}

.react-flow__connection {
  pointer-events: none;
}

.react-flow__connection.animated {
  stroke-dasharray: 5;
  animation: dashdraw 0.5s linear infinite;
}

.react-flow .react-flow__connectionline {
  z-index: 1001;
}

.react-flow__connectionline path, .react-flow__edge path {
  fill: none;
}

.react-flow__edge-path, .react-flow__connection-path {
  stroke: #b1b1b7;
  stroke-width: 1;
}

.react-flow__edge {
  pointer-events: visibleStroke;
}

.react-flow__edge.animated path {
  stroke-dasharray: 5;
  animation: dashdraw 0.5s linear infinite;
}

.react-flow__edge.inactive {
  pointer-events: none;
}

.react-flow__edge.selected, .react-flow__edge:focus, .react-flow__edge:focus-visible {
  outline: none;
}

.react-flow__edge.selected .react-flow__edge-path,
.react-flow__edge:focus .react-flow__edge-path,
.react-flow__edge:focus-visible .react-flow__edge-path {
  stroke: #555;
}

@keyframes dashdraw {
  from {
    stroke-dashoffset: 10;
  }
}

.react-flow__edge-textwrapper {
  pointer-events: all;
}

.react-flow__edge-text {
  pointer-events: none;
  user-select: none;
}

.react-flow__edge-textbg {
  fill: white;
}

.react-flow__nodes {
  pointer-events: none;
  transform-origin: 0 0;
}

.react-flow__node {
  position: absolute;
  user-select: none;
  pointer-events: all;
  transform-origin: 0 0;
  box-sizing: border-box;
  background-color: white;
  cursor: grab;
  border: 1px solid #bbb;
}

.react-flow__node.selected,
.react-flow__node:focus,
.react-flow__node:focus-visible  {
  outline: none;
  border: 1px solid #555;
}

.react-flow__nodesselection {
  z-index: 3;
  transform-origin: left top;
  pointer-events: none;
}

.react-flow__nodesselection-rect {
  position: absolute;
  pointer-events: all;
  cursor: grab;
}

.react-flow__handle {
  position: absolute;
  pointer-events: none;
  min-width: 5px;
  min-height: 5px;
  background-color: #333;
}

.react-flow__handle.connectable {
  pointer-events: all;
}

.react-flow__handle-bottom {
  top: auto;
  left: 50%;
  bottom: -4px;
  transform: translate(-50%, 0);
}

.react-flow__handle-top {
  left: 50%;
  top: -4px;
  transform: translate(-50%, 0);
}

.react-flow__handle-left {
  top: 50%;
  left: -4px;
  transform: translate(0, -50%);
}

.react-flow__handle-right {
  right: -4px;
  top: 50%;
  transform: translate(0, -50%);
}

.react-flow__edgeupdater {
  cursor: move;
  pointer-events: all;
}

.react-flow__panel {
  position: absolute;
  z-index: 1000;
  margin: 15px;
}

.react-flow__panel.top {
  top: 0;
}

.react-flow__panel.bottom {
  bottom: 0;
}

.react-flow__panel.left {
  left: 0;
}

.react-flow__panel.right {
  right: 0;
}

.react-flow__panel.center {
  left: 50%;
  transform: translateX(-50%);
}

.react-flow__attribution {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.5);
  padding: 2px 3px;
  color: #999;
  margin: 0;
}

.react-flow__attribution a {
  color: #555;
  text-decoration: none;
}
`;

export default style;
