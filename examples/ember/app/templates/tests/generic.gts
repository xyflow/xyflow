import { pageTitle } from 'ember-page-title';
import type { TOC } from '@ember/component/template-only';
import { Background, Controls, EdgeToolbar, EmberFlow, MiniMap, Panel } from '@xyflow/ember';

import type { FlowConfig } from '../../generic-tests/types';

interface Signature {
  Args: {
    model: FlowConfig;
  };
}

const GenericTestTemplate: TOC<Signature> = <template>
  {{pageTitle "EmberFlow Generic Test"}}
  <main class='generic-flow-page'>
    <EmberFlow
      @nodes={{@model.flowProps.nodes}}
      @edges={{@model.flowProps.edges}}
      @nodeTypes={{@model.flowProps.nodeTypes}}
      @fitView={{@model.flowProps.fitView}}
      @fitViewOptions={{@model.flowProps.fitViewOptions}}
      @initialViewport={{@model.flowProps.initialViewport}}
      @minZoom={{@model.flowProps.minZoom}}
      @maxZoom={{@model.flowProps.maxZoom}}
      @panOnScroll={{@model.flowProps.panOnScroll}}
      @panOnScrollSpeed={{@model.flowProps.panOnScrollSpeed}}
      @zoomOnScroll={{@model.flowProps.zoomOnScroll}}
      @zoomOnPinch={{@model.flowProps.zoomOnPinch}}
      @panOnDrag={{@model.flowProps.panOnDrag}}
      @preventScrolling={{@model.flowProps.preventScrolling}}
      @snapToGrid={{@model.flowProps.snapToGrid}}
      @snapGrid={{@model.flowProps.snapGrid}}
      @nodeOrigin={{@model.flowProps.nodeOrigin}}
      @nodeExtent={{@model.flowProps.nodeExtent}}
      @translateExtent={{@model.flowProps.translateExtent}}
      @nodesDraggable={{@model.flowProps.nodesDraggable}}
      @nodesConnectable={{@model.flowProps.nodesConnectable}}
      @nodesDeletable={{@model.flowProps.nodesDeletable}}
      @elementsSelectable={{@model.flowProps.elementsSelectable}}
      @selectNodesOnDrag={{@model.flowProps.selectNodesOnDrag}}
      @nodeDragThreshold={{@model.flowProps.nodeDragThreshold}}
      @autoPanOnNodeDrag={{@model.flowProps.autoPanOnNodeDrag}}
      @autoPanOnConnect={{@model.flowProps.autoPanOnConnect}}
      @autoPanSpeed={{@model.flowProps.autoPanSpeed}}
      @deleteKey={{@model.flowProps.deleteKey}}
      @multiSelectionKey={{@model.flowProps.multiSelectionKey}}
      @onNodeClick={{@model.flowProps.onNodeClick}}
      @onEdgeClick={{@model.flowProps.onEdgeClick}}
      @onPaneClick={{@model.flowProps.onPaneClick}}
      @onConnectStart={{@model.flowProps.onConnectStart}}
      @onConnect={{@model.flowProps.onConnect}}
      @onConnectEnd={{@model.flowProps.onConnectEnd}}
      @isValidConnection={{@model.flowProps.isValidConnection}}
      @onNodeDragStart={{@model.flowProps.onNodeDragStart}}
      @onNodeDrag={{@model.flowProps.onNodeDrag}}
      @onNodeDragStop={{@model.flowProps.onNodeDragStop}}
      @onSelectionChange={{@model.flowProps.onSelectionChange}}
    >
      {{#if @model.panelProps}}
        <Panel @position={{@model.panelProps.position}} />
      {{/if}}
      {{#if @model.controlsProps}}
        <Controls
          @position={{@model.controlsProps.position}}
          @orientation={{@model.controlsProps.orientation}}
          @showZoom={{@model.controlsProps.showZoom}}
          @showFitView={{@model.controlsProps.showFitView}}
          @showInteractive={{@model.controlsProps.showInteractive}}
          @showLock={{@model.controlsProps.showLock}}
          @fitViewOptions={{@model.controlsProps.fitViewOptions}}
        />
      {{/if}}
      {{#if @model.minimapProps}}
        <MiniMap
          @position={{@model.minimapProps.position}}
          @width={{@model.minimapProps.width}}
          @height={{@model.minimapProps.height}}
          @nodeColor={{@model.minimapProps.nodeColor}}
          @nodeStrokeColor={{@model.minimapProps.nodeStrokeColor}}
          @nodeClass={{@model.minimapProps.nodeClass}}
          @nodeClassName={{@model.minimapProps.nodeClassName}}
          @nodeBorderRadius={{@model.minimapProps.nodeBorderRadius}}
          @nodeStrokeWidth={{@model.minimapProps.nodeStrokeWidth}}
          @bgColor={{@model.minimapProps.bgColor}}
          @maskColor={{@model.minimapProps.maskColor}}
          @maskStrokeColor={{@model.minimapProps.maskStrokeColor}}
          @maskStrokeWidth={{@model.minimapProps.maskStrokeWidth}}
          @ariaLabel={{@model.minimapProps.ariaLabel}}
          @offsetScale={{@model.minimapProps.offsetScale}}
        />
      {{/if}}
      {{#if @model.edgeToolbarProps}}
        <EdgeToolbar
          @edgeId={{@model.edgeToolbarProps.edgeId}}
          @x={{@model.edgeToolbarProps.x}}
          @y={{@model.edgeToolbarProps.y}}
          @position={{@model.edgeToolbarProps.position}}
          @offset={{@model.edgeToolbarProps.offset}}
          @alignX={{@model.edgeToolbarProps.alignX}}
          @alignY={{@model.edgeToolbarProps.alignY}}
          @isVisible={{@model.edgeToolbarProps.isVisible}}
        >
          <button type='button'>edge toolbar</button>
        </EdgeToolbar>
      {{/if}}
      {{#if @model.backgroundProps}}
        <Background
          @id={{@model.backgroundProps.id}}
          @color={{@model.backgroundProps.color}}
          @bgColor={{@model.backgroundProps.bgColor}}
          @patternColor={{@model.backgroundProps.patternColor}}
          @patternClass={{@model.backgroundProps.patternClass}}
          @patternClassName={{@model.backgroundProps.patternClassName}}
          @gap={{@model.backgroundProps.gap}}
          @offset={{@model.backgroundProps.offset}}
          @lineWidth={{@model.backgroundProps.lineWidth}}
          @size={{@model.backgroundProps.size}}
          @variant={{@model.backgroundProps.variant}}
        />
      {{/if}}
    </EmberFlow>
  </main>
</template>;

export default GenericTestTemplate;
