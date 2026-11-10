import { createContext, type MouseEvent } from 'react';
import type { HandleType } from '@xyflow/system';

export type EdgeReconnectHandler = (event: MouseEvent, type: HandleType, dragThreshold?: number) => void;

export const EdgeReconnectContext = createContext<{
  isReconnectable: boolean | HandleType;
  noPanClassName: string;
  startReconnect: EdgeReconnectHandler;
} | null>(null);
