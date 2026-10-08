---
"@xyflow/vue": minor
---

`<Background>`'s `size` prop now defaults per variant instead of always `1`: `1` for `dots`, `1` for `lines` and `6` for `cross`. `dots` and `lines` are unaffected — the default only differs for `cross`, where `size` sets the arm length of each cross rather than a dot radius.
