import { pageTitle } from 'ember-page-title';
import type { TOC } from '@ember/component/template-only';
import { Background, Controls, EmberFlow, Panel } from '@xyflow/ember';

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
      @initialViewport={{@model.flowProps.initialViewport}}
      @minZoom={{@model.flowProps.minZoom}}
      @maxZoom={{@model.flowProps.maxZoom}}
      @panOnScroll={{@model.flowProps.panOnScroll}}
      @panOnScrollSpeed={{@model.flowProps.panOnScrollSpeed}}
      @zoomOnScroll={{@model.flowProps.zoomOnScroll}}
      @zoomOnPinch={{@model.flowProps.zoomOnPinch}}
      @panOnDrag={{@model.flowProps.panOnDrag}}
      @preventScrolling={{@model.flowProps.preventScrolling}}
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
      {{#if @model.backgroundProps}}
        <Background
          @color={{@model.backgroundProps.color}}
          @gap={{@model.backgroundProps.gap}}
          @size={{@model.backgroundProps.size}}
        />
      {{/if}}
    </EmberFlow>
  </main>
</template>;

export default GenericTestTemplate;
