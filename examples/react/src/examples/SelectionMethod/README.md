# Selection Method Example

This example demonstrates the new `selectionMethod` field in `NodeSelectionChange` that tracks how node selection occurred.

## Features

- **Real-time Selection Tracking**: Shows a live log of all node selections with their method
- **Visual Indicators**: Color-coded selection methods for easy identification
- **Interactive Testing**: Buttons to test programmatic selection
- **Multiple Selection Methods**: Demonstrates all supported selection methods

## Selection Methods Demonstrated

1. **Click** (Blue) - Direct click on a node
2. **Drag** (Green) - Selection when dragging a node (selectNodesOnDrag enabled)
3. **Rectangle** (Yellow) - Selection using selection rectangle (Shift + drag)
4. **Keyboard** (Purple) - Selection using keyboard (Space/Enter when focused)
5. **Multi-Select** (Red) - Selection while holding modifier keys (Ctrl/Cmd + click)
6. **Programmatic** (Gray) - Selection via API calls or programmatic changes

## How to Test

1. **Click Selection**: Click on any node
2. **Drag Selection**: Drag a node (it will be selected automatically)
3. **Rectangle Selection**: Hold Shift and drag to create a selection rectangle
4. **Keyboard Selection**: Click on a node to focus it, then press Space or Enter
5. **Multi-Select**: Hold Ctrl (or Cmd on Mac) and click multiple nodes
6. **Programmatic Selection**: Use the "Select All" or "Deselect All" buttons

## Code Example

```typescript
const onNodesChange = useCallback((changes: NodeChange[]) => {
  changes.forEach((change) => {
    if (change.type === 'select') {
      console.log(`Node ${change.id} was selected via ${change.selectionMethod}`);

      // Handle different selection methods
      switch (change.selectionMethod) {
        case 'click':
          // Handle click selection
          break;
        case 'drag':
          // Handle drag selection
          break;
        case 'rectangle':
          // Handle rectangle selection
          break;
        // ... etc
      }
    }
  });

  setNodes((nds) => applyNodeChanges(changes, nds));
}, []);
```

## Implementation Details

The `selectionMethod` field is automatically populated by React Flow based on how the selection occurred:

- **Click**: When `selectNodesOnDrag` is false or node has `nodeDragThreshold > 0`
- **Drag**: When `selectNodesOnDrag` is true and node is dragged
- **Rectangle**: When using selection rectangle (Shift + drag)
- **Keyboard**: When using keyboard navigation (Space/Enter)
- **Multi-Select**: When holding modifier keys during selection
- **Programmatic**: When using API methods like `addSelectedNodes()`

This feature is fully backward compatible - existing code will continue to work without any changes, and the `selectionMethod` field is optional.
