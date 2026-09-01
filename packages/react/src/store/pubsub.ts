type Listener = () => void;
type ListenerMap = Map<string, Set<Listener>>;

export class PubSub {
  private nodeListeners: ListenerMap = new Map();
  private edgeListeners: ListenerMap = new Map();
  private connectionListeners: ListenerMap = new Map();

  subscribeToNode(id: string, onStoreChange: Listener) {
    return this.subscribe(this.nodeListeners, id, onStoreChange);
  }

  publishNodes(ids: Set<string>) {
    this.publish(this.nodeListeners, ids);
  }

  subscribeToEdge(id: string, onStoreChange: Listener) {
    return this.subscribe(this.edgeListeners, id, onStoreChange);
  }

  publishEdges(ids: Set<string>) {
    this.publish(this.edgeListeners, ids);
  }

  subscribeToConnection(id: string, onStoreChange: Listener) {
    return this.subscribe(this.connectionListeners, id, onStoreChange);
  }

  publishConnections(ids: Set<string>) {
    this.publish(this.connectionListeners, ids);
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

  private publish(listeners: ListenerMap, ids: Set<string>) {
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
}
