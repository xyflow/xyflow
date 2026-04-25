import { pageTitle } from 'ember-page-title';

const samples = [
  {
    title: 'Viewport + Controls',
    href: '/examples/parity/viewport-controls',
    summary: 'Pan, zoom, fitView, interactivity lock, layered background variants.',
  },
  {
    title: 'Custom Controls',
    href: '/examples/parity/custom-controls',
    summary: 'Default controls with injected buttons plus a fully app-owned toolbar that calls the store API.',
  },
  {
    title: 'Editing + Toolbar',
    href: '/examples/parity/editing',
    summary: 'Provider-owned store, node selection, drag, marquee selection, connection creation, delete, NodeToolbar.',
  },
  {
    title: 'Edges + Markers',
    href: '/examples/parity/edges',
    summary: 'SVG edge rendering, animated edges, marker start/end, edge selection, interaction width.',
  },
  {
    title: 'MiniMap',
    href: '/examples/parity/minimap',
    summary: 'Overview map, viewport mask, styled node rectangles, and live pan/zoom tracking.',
  },
  {
    title: 'Custom Handles',
    href: '/examples/parity/custom-handles',
    summary: 'Public Handle component inside custom Ember nodes, with handle ids preserved on new edges.',
  },
  {
    title: 'Node Resizing',
    href: '/examples/parity/resizing',
    summary: 'NodeResizer and NodeResizeControl parity: resize lines, handles, min size, and live edge updates.',
  },
  {
    title: 'Placement + Events',
    href: '/examples/parity/placement-events',
    summary: 'Snap grid, per-node origin, node extents, pane/node/edge callbacks, and selection change events.',
  },
];

<template>
  {{pageTitle "EmberFlow Parity Samples"}}
  <main class='parity-index'>
    <section class='parity-index__intro'>
      <p class='parity-index__eyebrow'>@xyflow/ember</p>
      <h1>Parity samples</h1>
      <p>
        These examples are human-facing demos for the current EmberFlow parity layer.
        Each sample includes an in-diagram note panel with concrete test steps.
      </p>
    </section>

    <section class='parity-index__grid' aria-label='EmberFlow parity samples'>
      {{#each samples as |sample|}}
        <a class='parity-index__card' href={{sample.href}}>
          <span>{{sample.title}}</span>
          <small>{{sample.summary}}</small>
        </a>
      {{/each}}
    </section>
  </main>
</template>
