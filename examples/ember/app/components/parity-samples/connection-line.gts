import Component from '@glimmer/component';

interface Signature {
  Args: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    isValid: boolean | null;
  };
}

export default class ConnectionLine extends Component<Signature> {
  get path() {
    let midX = (this.args.fromX + this.args.toX) / 2;

    return `M ${this.args.fromX},${this.args.fromY} C ${midX},${this.args.fromY} ${midX},${this.args.toY} ${this.args.toX},${this.args.toY}`;
  }

  get className() {
    return ['parity-custom-connection-line', this.args.isValid === false ? 'is-invalid' : undefined]
      .filter(Boolean)
      .join(' ');
  }

  <template>
    <path data-testid='custom-connection-line' class={{this.className}} d={{this.path}} fill='none' />
  </template>
}
