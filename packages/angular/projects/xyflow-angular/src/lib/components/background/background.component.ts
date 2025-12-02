import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { FlowStateService } from '../../services/flow-state.service';
import { DotPatternComponent } from './dot-pattern.component';
import { LinePatternComponent } from './line-pattern.component';
import { BackgroundVariant, type BackgroundProps } from './types';
import type { Viewport } from '@xyflow/system';

const defaultSize = {
  [BackgroundVariant.Dots]: 1,
  [BackgroundVariant.Lines]: 1,
  [BackgroundVariant.Cross]: 6,
};

/**
 * Background component that renders visual patterns to improve spatial awareness.
 * Supports dots, lines, and cross patterns with full customization.
 */
@Component({
  selector: 'angular-flow-background',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DotPatternComponent, LinePatternComponent],
  template: `
    <svg
      [class]="getContainerClasses()"
      [attr.data-testid]="'angular-flow__background'"
      [style]="getContainerStyle()"
    >
      <pattern
        [attr.id]="patternId"
        [attr.x]="patternX"
        [attr.y]="patternY"
        [attr.width]="scaledGap[0]"
        [attr.height]="scaledGap[1]"
        patternUnits="userSpaceOnUse"
        [attr.patternTransform]="getPatternTransform()"
      >
        <g 
          *ngIf="isDots"
          dot-pattern
          [radius]="scaledSize / 2"
          [patternClass]="patternClass"
        />
        <g 
          *ngIf="!isDots"
          line-pattern
          [dimensions]="patternDimensions"
          [variant]="variant"
          [lineWidth]="lineWidth"
          [patternClass]="patternClass"
        />
      </pattern>
      <rect 
        x="0" 
        y="0" 
        width="100%" 
        height="100%" 
        [attr.fill]="getRectFill()" 
      />
    </svg>
  `,
  styleUrls: ['./background.component.css'],
})
export class BackgroundComponent implements OnInit, OnDestroy, BackgroundProps {
  private destroy$ = new Subject<void>();

  @Input() id?: string;
  @Input() bgColor?: string;
  @Input() patternColor?: string;
  @Input() patternClass?: string;
  @Input() className?: string;
  @Input() gap: number | [number, number] = 20;
  @Input() size?: number;
  @Input() offset: number | [number, number] = 0;
  @Input() lineWidth: number = 1;
  @Input() variant: BackgroundVariant = BackgroundVariant.Dots;
  @Input() style?: { [key: string]: string | number };

  // Computed properties
  viewport: Viewport = { x: 0, y: 0, zoom: 1 };
  patternId: string = '';
  
  isDots: boolean = true;
  isCross: boolean = false;
  gapXY: [number, number] = [20, 20];
  scaledGap: [number, number] = [20, 20];
  scaledSize: number = 1;
  offsetXY: [number, number] = [0, 0];
  scaledOffset: [number, number] = [0, 0];
  patternDimensions: [number, number] = [20, 20];
  patternX: number = 0;
  patternY: number = 0;

  constructor(
    private flowStateService: FlowStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupSubscriptions();
    this.updateComputedProperties();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSubscriptions(): void {
    // Subscribe to viewport changes for pattern positioning
    this.flowStateService.viewport$
      .pipe(takeUntil(this.destroy$))
      .subscribe((viewport: Viewport) => {
        this.viewport = viewport;
        this.updateComputedProperties();
        this.cdr.markForCheck();
      });
  }

  private updateComputedProperties(): void {
    // Pattern ID
    this.patternId = `background-pattern-${this.flowStateService.flowId}-${this.id || ''}`;
    
    // Variant flags
    this.isDots = this.variant === BackgroundVariant.Dots;
    this.isCross = this.variant === BackgroundVariant.Cross;
    
    // Gap calculations
    this.gapXY = Array.isArray(this.gap) ? this.gap : [this.gap, this.gap];
    this.scaledGap = [
      this.gapXY[0] * this.viewport.zoom || 1,
      this.gapXY[1] * this.viewport.zoom || 1
    ];
    
    // Size calculations
    const patternSize = this.size || defaultSize[this.variant];
    this.scaledSize = patternSize * this.viewport.zoom;
    
    // Offset calculations
    this.offsetXY = Array.isArray(this.offset) ? this.offset : [this.offset, this.offset];
    
    // Pattern dimensions
    this.patternDimensions = this.isCross 
      ? [this.scaledSize, this.scaledSize] 
      : this.scaledGap;
    
    this.scaledOffset = this.isDots 
      ? [this.scaledSize / 2, this.scaledSize / 2]
      : [this.patternDimensions[0] / 2, this.patternDimensions[1] / 2];
    
    // Pattern positioning
    this.patternX = this.viewport.x % this.scaledGap[0];
    this.patternY = this.viewport.y % this.scaledGap[1];
  }

  getContainerClasses(): string {
    const baseClasses = ['angular-flow__background', 'angular-flow__container'];
    if (this.className) {
      baseClasses.push(this.className);
    }
    return baseClasses.join(' ');
  }

  getContainerStyle(): { [key: string]: string } {
    const containerStyle: { [key: string]: string } = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: '0',
      left: '0',
      'z-index': '-1',
    };

    if (this.bgColor) {
      containerStyle['--xy-background-color-props'] = this.bgColor;
    }
    if (this.patternColor) {
      containerStyle['--xy-background-pattern-color-props'] = this.patternColor;
    }

    // Merge with custom styles
    if (this.style) {
      Object.assign(containerStyle, this.style);
    }

    return containerStyle;
  }

  getPatternTransform(): string {
    return `translate(-${this.scaledOffset[0]},-${this.scaledOffset[1]})`;
  }

  getRectFill(): string {
    return `url(#${this.patternId})`;
  }
}