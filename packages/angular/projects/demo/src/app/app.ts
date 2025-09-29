import { Component, signal } from '@angular/core';
import { DemoComponent } from './simple-demo.component';

@Component({
  selector: 'app-root',
  imports: [DemoComponent],
  template: '<app-demo></app-demo>',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('XYFlow Angular Demo');
}
