import { createContext, useEffect } from 'react';
import { Handle, Position, useStore, useNodeId } from 'reactflow';

export type ConnectorStoreItem = {
  value: any;
  type: string;
};

export class ConnectorStore {
  private store: Map<string, ConnectorStoreItem>;
  private listeners: Map<string, ((value: any) => void)[]>;

  constructor() {
    this.store = new Map();
    this.listeners = new Map();
  }

  public set(key: string, item: ConnectorStoreItem) {
    this.store.set(key, item);
    this.listeners.get(key)?.forEach((cb) => cb(item));
  }

  public get(key: string): ConnectorStoreItem {
    return this.store.get(key) ?? { value: undefined, type: 'undefined' };
  }

  public subscribe(key: string, callback: (value: ConnectorStoreItem) => void) {
    this.listeners.set(key, [...(this.listeners.get(key) ?? []), callback]);
  }

  public unsubscribe(key: string, callback: (value: any) => void) {
    this.listeners.set(key, this.listeners.get(key)?.filter((cb) => cb !== callback) ?? []);
  }
}

export const ConnectorContext = createContext<ConnectorStore>(new ConnectorStore());

const testStore = new ConnectorStore();

type ConnectorProps = {
  id: string;
};

type InputConnectorProps = {
  onChange: (value: any) => void;
} & ConnectorProps;

export const InputConnector = ({ id, onChange = (val) => console.log('input changed:', val) }: InputConnectorProps) => {
  const input = useStore((store) => store.edges.find((edge) => edge.targetHandle === id));

  useEffect(() => {
    const storeItemId = `${input?.source}+${input?.sourceHandle}`;

    if (input?.sourceHandle) {
      onChange(testStore.get(storeItemId));
    } else {
      onChange({ value: undefined, type: 'undefined' });
    }

    testStore.subscribe(storeItemId || '', onChange);

    return () => {
      testStore.unsubscribe(storeItemId || '', onChange);
    };
  }, [input]);

  return <Handle id={id} type="target" position={Position.Top} />;
};

type OutputConnectorProps = {
  value: any;
  valueType?: string;
} & ConnectorProps;

export const OutputConnector = ({ id, value, valueType = 'unknown' }: OutputConnectorProps) => {
  const nodeId = useNodeId();

  useEffect(() => {
    testStore.set(`${nodeId}+${id}`, { value, type: valueType });
  }, [id, nodeId, value]);

  return <Handle id={id} type="source" position={Position.Bottom} />;
};
