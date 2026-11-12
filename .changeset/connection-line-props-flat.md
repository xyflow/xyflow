---
"@xyflow/vue": major
---

`<VueFlow>`'s `connectionLineOptions` object is replaced by individual props.

| before                              | after                       |
|-------------------------------------|-----------------------------|
| `connectionLineOptions.type`        | `connectionLineType`        |
| `connectionLineOptions.style`       | `connectionLineStyle`       |
| `connectionLineOptions.class`       | `connectionLineClass`       |
| `connectionLineOptions.markerStart` | `connectionLineMarkerStart` |
| `connectionLineOptions.markerEnd`   | `connectionLineMarkerEnd`   |

The `ConnectionLineOptions` type is removed.
