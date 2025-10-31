import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  signal,
  computed,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EdgeTextProps } from './types';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Component({
  selector: 'xy-edge-text',
  standalone: true,
  imports: [CommonModule],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    @if (label) {
      <g
        [attr.transform]="transform()"
        [class]="'xyflow__edge-textwrapper ' + (className || '')"
        [attr.visibility]="textBbox().width ? 'visible' : 'hidden'"
        [style]="style || {}"
      >
        @if (labelShowBg) {
          <rect
            [attr.width]="textBbox().width + 2 * labelBgPadding[0]"
            [attr.x]="-labelBgPadding[0]"
            [attr.y]="-labelBgPadding[1]"
            [attr.height]="textBbox().height + 2 * labelBgPadding[1]"
            class="xyflow__edge-textbg"
            [attr.rx]="labelBgBorderRadius"
            [attr.ry]="labelBgBorderRadius"
            [ngStyle]="labelBgStyle || {}"
          />
        }
        <text
          #textElement
          class="xyflow__edge-text"
          [attr.y]="textBbox().height / 2"
          dy="0.3em"
          [ngStyle]="labelStyle || {}"
        >
          {{ label }}
        </text>
        <ng-content></ng-content>
      </g>
    }
  `,
  styles: [`
    .xyflow__edge-textwrapper {
      pointer-events: all;
    }

    .xyflow__edge-text {
      text-anchor: middle;
      pointer-events: none;
      user-select: none;
      fill: #222;
      font-size: 10px;
    }

    .xyflow__edge-textbg {
      fill: #fff;
      stroke: #222;
      stroke-width: 1px;
    }
  `]
})
export class EdgeTextComponent implements AfterViewInit, EdgeTextProps {
  @Input() x!: number;
  @Input() y!: number;
  @Input() label?: string;
  @Input() labelStyle?: { [key: string]: any };
  @Input() labelShowBg: boolean = true;
  @Input() labelBgStyle?: { [key: string]: any };
  @Input() labelBgPadding: [number, number] = [2, 4];
  @Input() labelBgBorderRadius: number = 2;
  @Input() className?: string;
  @Input() style?: { [key: string]: any };

  @ViewChild('textElement') textElement?: ElementRef<SVGTextElement>;

  protected textBbox = signal<Rect>({ x: 1, y: 0, width: 0, height: 0 });

  protected transform = computed(() => {
    const bbox = this.textBbox();
    return `translate(${this.x - bbox.width / 2} ${this.y - bbox.height / 2})`;
  });

  ngAfterViewInit(): void {
    this.updateBbox();
  }

  private updateBbox(): void {
    if (this.textElement?.nativeElement && this.label) {
      try {
        const textBbox = this.textElement.nativeElement.getBBox();
        this.textBbox.set({
          x: textBbox.x,
          y: textBbox.y,
          width: textBbox.width,
          height: textBbox.height,
        });
      } catch (error) {
        // Handle getBBox errors gracefully (e.g., when element is not rendered)
        this.textBbox.set({ x: 1, y: 0, width: 0, height: 0 });
      }
    }
  }
}
