import type { Node } from '@xyflow/vue';

export enum ProcessStatus {
  ERROR = 'error',
  SKIPPED = 'skipped',
  CANCELLED = 'cancelled',
  FINISHED = 'finished',
  RUNNING = 'running',
}

export interface ProcessData extends Record<string, unknown> {
  status: ProcessStatus | null;
}

export type ProcessNode = Node<ProcessData, 'process'>;
