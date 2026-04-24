import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { pageTitle } from 'ember-page-title';
import { EmberFlow } from '@xyflow/ember';

export default class ColorModeExample extends Component {
  @tracked colorMode: 'light' | 'dark' = 'light';

  nodes = [
    {
      id: '1',
      data: { label: 'Color mode' },
      position: { x: 0, y: 0 },
      type: 'input',
    },
    {
      id: '2',
      data: { label: 'Preview' },
      position: { x: 0, y: 120 },
    },
  ];

  edges = [
    {
      id: '1-2',
      source: '1',
      target: '2',
    },
  ];

  updateColorMode = (event: Event) => {
    this.colorMode = (event.target as HTMLSelectElement).value as 'light' | 'dark';
  };

  <template>
    {{pageTitle "EmberFlow Color Mode"}}
    <main class='generic-flow-page'>
      <label class='color-mode-control'>
        Color mode
        <select
          data-testid='colormode-select'
          value={{this.colorMode}}
          {{on 'change' this.updateColorMode}}
        >
          <option value='light'>light</option>
          <option value='dark'>dark</option>
        </select>
      </label>
      <EmberFlow
        @nodes={{this.nodes}}
        @edges={{this.edges}}
        @fitView={{true}}
        @colorMode={{this.colorMode}}
      />
    </main>
  </template>
}
