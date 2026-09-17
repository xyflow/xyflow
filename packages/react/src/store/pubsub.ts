import { ConnectionState, HandleType } from '@xyflow/system';

type Listener = () => void;
type ListenerMap = Map<string, Set<Listener>>;

type HandleArgs = {
  nodeId: string;
  id?: string | null;
  type: HandleType;
};

function getHandleKey(handle: HandleArgs | null) {
  if (!handle) {
    return '';
  }
  return `${handle.nodeId}-${handle.id}-${handle.type}`;
}

function sameHandle(a: HandleArgs | null, b: HandleArgs | null) {
  return a === b || (a && b && a.nodeId === b.nodeId && a.id === b.id && a.type === b.type);
}

export class PubSub {
  private nodeListeners: ListenerMap = new Map();
  private edgeListeners: ListenerMap = new Map();
  private handleListeners: ListenerMap = new Map();

  subscribeToNode(id: string, onStoreChange: Listener) {
    return this.subscribe(this.nodeListeners, id, onStoreChange);
  }

  subscribeToNodes(ids: readonly string[] | ReadonlySet<string>, onStoreChange: Listener) {
    const unsubscribes = Array.from(new Set(ids), (id) => this.subscribeToNode(id, onStoreChange));
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }

  publishNodes(ids: Set<string>) {
    this.notify(this.nodeListeners, ids);
  }

  subscribeToEdge(id: string, onStoreChange: Listener) {
    return this.subscribe(this.edgeListeners, id, onStoreChange);
  }

  subscribeToEdges(ids: readonly string[] | ReadonlySet<string>, onStoreChange: Listener) {
    const unsubscribes = Array.from(new Set(ids), (id) => this.subscribeToEdge(id, onStoreChange));
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }

  publishEdges(ids: Set<string>) {
    this.notify(this.edgeListeners, ids);
  }

  subscribeToConnectionForHandle(handle: HandleArgs, onStoreChange: Listener) {
    return this.subscribe(this.handleListeners, getHandleKey(handle), onStoreChange);
  }

  publishConnectionClickStart() {
    this.notifyAll(this.handleListeners);
  }

  publishConnection(previous: ConnectionState, connection: ConnectionState) {
    const notifyHandles = new Set<string>();

    if (!sameHandle(previous.fromHandle, connection.fromHandle)) {
      this.notifyAll(this.handleListeners);
      return;
    }

    // We notify all handles that have matched or will match directly
    notifyHandles.add(getHandleKey(previous.fromHandle));
    notifyHandles.add(getHandleKey(previous.toHandle));
    notifyHandles.add(getHandleKey(connection.fromHandle));
    notifyHandles.add(getHandleKey(connection.toHandle));

    // We remove the null handle that might have been added
    notifyHandles.delete(getHandleKey(null));
    this.notify(this.handleListeners, notifyHandles);
  }

  reset() {
    this.notifyAll(this.nodeListeners);
    this.notifyAll(this.edgeListeners);
    this.notifyAll(this.handleListeners);
  }

  private subscribe(listeners: ListenerMap, id: string, onStoreChange: Listener): () => void {
    let idListeners = listeners.get(id);

    if (!idListeners) {
      idListeners = new Set();
      listeners.set(id, idListeners);
    }

    idListeners.add(onStoreChange);

    return () => {
      idListeners.delete(onStoreChange);

      if (idListeners.size === 0) {
        listeners.delete(id);
      }
    };
  }

  private notify(listeners: ListenerMap, ids: Set<string>) {
    for (const id of ids) {
      const idListeners = listeners.get(id);

      if (!idListeners) {
        continue;
      }

      for (const listener of idListeners) {
        listener();
      }
    }
  }

  private notifyAll(listeners: ListenerMap) {
    for (const idListeners of listeners.values()) {
      for (const listener of idListeners) {
        listener();
      }
    }
  }
}
