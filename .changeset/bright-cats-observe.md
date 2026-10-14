---
'@xyflow/react': patch
'@xyflow/system': patch
---
Disconnect resize observers when a flow unmounts to avoid lingering observations and browser resize-loop warnings.
