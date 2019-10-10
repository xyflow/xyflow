export type ElementId = string;

export type Elements = Array<Node | Edge>;

export type Transform = [number, number, number];

export interface Node {
  id: ElementId,
  type?: string,
  __rg?: any,
  data?: any
};

export interface Edge {
  id: ElementId,
  type?: string,
};

