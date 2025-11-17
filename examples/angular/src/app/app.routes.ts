import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tests/generic/:topic/:example',
    loadComponent: () => import('./generic-tests/generic-test.component').then(m => m.GenericTestComponent)
  },
  {
    path: 'examples/:example',
    loadComponent: () => import('./examples/example.component').then(m => m.ExampleComponent)
  },
  {
    path: '',
    redirectTo: '/tests/generic/nodes/general',
    pathMatch: 'full'
  }
];