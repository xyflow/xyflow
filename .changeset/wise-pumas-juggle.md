---
'@reactflow/core': patch
---

Fix auto-pan moving nodes infinitely into the background when translateExtent is used. 
Avoid updating node pos on auto-pan if the viewport is not transformed (no pan actually happened)
