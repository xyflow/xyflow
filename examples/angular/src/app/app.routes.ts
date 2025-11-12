import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./examples/basic-example/basic-example.component').then(m => m.BasicExampleComponent),
  },
  {
    path: 'basic',
    loadComponent: () => import('./examples/basic-example/basic-example.component').then(m => m.BasicExampleComponent),
  },
  {
    path: 'custom-nodes',
    loadComponent: () => import('./examples/custom-nodes/custom-nodes.component').then(m => m.CustomNodesComponent),
  },
  {
    path: 'edge-types',
    loadComponent: () => import('./examples/edge-types/edge-types.component').then(m => m.EdgeTypesComponent),
  },
  {
    path: 'interactive',
    loadComponent: () => import('./examples/interactive/interactive.component').then(m => m.InteractiveComponent),
  },
];
