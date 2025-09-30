import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFlowComponent } from '@xyflow/angular';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [AngularFlowComponent],
  template: `
    <div class="angular-flow">
      <h1>Angular Flow Example: {{ exampleName }}</h1>
      <p>This is a placeholder for Angular Flow examples.</p>
      <xyflow-angular>
      </xyflow-angular>
    </div>
  `,
  styles: [`
    .angular-flow {
      width: 100vw;
      height: 100vh;
      padding: 20px;
      box-sizing: border-box;
    }
  `]
})
export class ExampleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  exampleName = '';

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.exampleName = params['example'] || 'Unknown';
    });
  }
}