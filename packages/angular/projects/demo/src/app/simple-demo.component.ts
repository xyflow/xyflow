import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowDemoComponent } from './workflow-demo.component';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, WorkflowDemoComponent],
  template: `
    <app-workflow-demo></app-workflow-demo>
  `,
  styles: []
})
export class DemoComponent {
  constructor() {
    console.log('✅ @xyflow/angular demo component loaded successfully!');
  }
}
