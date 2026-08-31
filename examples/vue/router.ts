import type { RouterOptions } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

export const routes: RouterOptions['routes'] = [
  {
    path: '/',
    redirect: '/overview',
  },
  {
    path: '/basic',
    component: () => import('./src/Basic/Basic.vue'),
  },
  {
    path: '/basic-options-api',
    component: () => import('./src/Basic/BasicOptionsAPI.vue'),
  },
  {
    path: '/snap-handle',
    component: () => import('./src/SnapHandle/SnapHandleExample.vue'),
  },
  {
    path: '/math',
    component: () => import('./src/Math/MathExample.vue'),
  },
  {
    path: '/node-resizer',
    component: () => import('./src/NodeResizer/NodeResizerExample.vue'),
  },
  {
    path: '/node-toolbar',
    component: () => import('./src/NodeToolbar/NodeToolbarExample.vue'),
  },
  {
    path: '/custom-connectionline',
    component: () => import('./src/CustomConnectionLine/CustomConnectionLine.vue'),
  },
  {
    path: '/custom-node',
    component: () => import('./src/CustomNode/CustomNode.vue'),
  },
  {
    path: '/drag-n-drop',
    component: () => import('./src/DragNDrop/DnD.vue'),
  },
  {
    path: '/edges',
    component: () => import('./src/Edges/EdgesExample.vue'),
  },
  {
    path: '/edge-types',
    component: () => import('./src/EdgeTypes/EdgeTypesExample.vue'),
  },
  {
    path: '/empty',
    component: () => import('./src/Empty/EmptyExample.vue'),
  },
  {
    path: '/hidden',
    component: () => import('./src/Hidden/HiddenExample.vue'),
  },
  {
    path: '/interaction',
    component: () => import('./src/Interaction/InteractionExample.vue'),
  },
  {
    path: '/layouting',
    component: () => import('./src/Layouting/LayoutingExample.vue'),
  },
  {
    path: '/multi-flows',
    component: () => import('./src/MultiFlows/MultiFlowsExample.vue'),
  },
  {
    path: '/node-type-change',
    component: () => import('./src/NodeTypeChange/NodeTypeChangeExample.vue'),
  },
  {
    path: '/floating-edges',
    component: () => import('./src/FloatingEdges/FloatingEdges.vue'),
  },
  {
    path: '/overview',
    component: () => import('./src/Overview/Overview.vue'),
  },
  {
    path: '/provider',
    component: () => import('./src/Provider/ProviderExample.vue'),
  },
  {
    path: '/save-restore',
    component: () => import('./src/SaveRestore/SaveRestoreExample.vue'),
  },
  {
    path: '/stress',
    component: () => import('./src/Stress/StressExample.vue'),
  },
  {
    path: '/switch',
    component: () => import('./src/Switch/SwitchExample.vue'),
  },
  {
    path: '/unidirectional',
    component: () => import('./src/Unidirectional/UnidirectionalExample.vue'),
  },
  {
    path: '/updateable-edge',
    component: () => import('./src/UpdatableEdge/UpdatableEdgeExample.vue'),
  },
  {
    path: '/update-node',
    component: () => import('./src/UpdateNode/UpdateNodeExample.vue'),
  },
  {
    path: '/validation',
    component: () => import('./src/Validation/ValidationExample.vue'),
  },
  {
    path: '/nesting',
    component: () => import('./src/Nesting/Nesting.vue'),
  },
  {
    path: '/rgb',
    component: () => import('./src/RGBFlow/RGBFlow.vue'),
  },
  {
    path: '/easy-connect',
    component: () => import('./src/EasyConnect/EasyConnect.vue'),
  },
  {
    path: '/pinia',
    component: () => import('./src/Pinia/PiniaExample.vue'),
  },
  {
    path: '/screenshot',
    component: () => import('./src/Screenshot/ScreenshotExample.vue'),
  },
  {
    path: '/confirm-delete',
    component: () => import('./src/ConfirmDelete/ConfirmDeleteExample.vue'),
  },
];

// routes exercised by the Playwright suite (tests/playwright) — kept out of `routes` so they don't
// clutter the Header's example picker. `/tests/generic/*` renders the generic-tests harness.
const testRoutes: RouterOptions['routes'] = [
  {
    path: '/examples/color-mode',
    component: () => import('./src/ColorMode/ColorModeExample.vue'),
    meta: { blank: true },
  },
  {
    path: '/tests/generic/:pathMatch(.*)*',
    component: () => import('./src/generic-tests/GenericTests.vue'),
    meta: { blank: true },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: [...routes, ...testRoutes],
});

declare module 'vue-router' {
  interface RouteMeta {
    // hide the example Header chrome so the flow fills the viewport (used by the e2e routes)
    blank?: boolean;
  }
}
