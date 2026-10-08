---
"@xyflow/vue": major
---

`<VueFlow>`'s `connectionLineOptions` object is replaced by individual props, so the connection line is configured the same way as everything else on the component.

| before | after |
| --- | --- |
| `connectionLineOptions.type` | `connectionLineType` |
| `connectionLineOptions.style` | `connectionLineStyle` |
| `connectionLineOptions.class` | `connectionLineClass` |
| `connectionLineOptions.markerStart` | `connectionLineMarkerStart` |
| `connectionLineOptions.markerEnd` | `connectionLineMarkerEnd` |

```diff
- <VueFlow :connection-line-options="{ type: 'straight', style: { stroke: '#f6ab6c' } }" />
+ <VueFlow connection-line-type="straight" :connection-line-style="{ stroke: '#f6ab6c' }" />
```

The `ConnectionLineOptions` type is removed.
