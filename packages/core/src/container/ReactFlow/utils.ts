import { useMemo, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { errorMessages } from '@reactflow/system';
import { devWarn } from '@reactflow/utils';

import { CreateEdgeTypes } from '../EdgeRenderer/utils';
import { CreateNodeTypes } from '../NodeRenderer/utils';
import type { EdgeTypes, EdgeTypesWrapped, NodeTypes, NodeTypesWrapped } from '../../types';

export function useNodeOrEdgeTypes(nodeOrEdgeTypes: NodeTypes, createTypes: CreateNodeTypes): NodeTypesWrapped;
export function useNodeOrEdgeTypes(nodeOrEdgeTypes: EdgeTypes, createTypes: CreateEdgeTypes): EdgeTypesWrapped;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useNodeOrEdgeTypes(nodeOrEdgeTypes: any, createTypes: any): any {
  const typesKeysRef = useRef<string[] | null>(null);

  const typesParsed = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      const typeKeys = Object.keys(nodeOrEdgeTypes);
      if (shallow(typesKeysRef.current, typeKeys)) {
        devWarn('002', errorMessages['error002']());
      }

      typesKeysRef.current = typeKeys;
    }
    return createTypes(nodeOrEdgeTypes);
  }, [nodeOrEdgeTypes]);

  return typesParsed;
}
