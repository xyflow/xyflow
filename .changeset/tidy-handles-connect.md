---
"@xyflow/react": minor
"@xyflow/svelte": minor
"@xyflow/system": minor
---

feat(a11y): make handles and pane focusable so connections can be created with the keyboard

Adds a new `handlesFocusable` prop (default `true`). Handles get `tabIndex="0"`, `role="button"`,
an `aria-label` and `aria-describedby` instructions. Pressing `Enter` or `Space` on a focused
handle starts a click connection, pressing it on another handle completes it and `Escape` cancels
a pending connection. Pressing `Enter`/`Space` while the pane is focused ends the connection on
the pane and fires `onClickConnectEnd`, which enables keyboard users to create new nodes like in
the "add node on edge drop" example.

`OnConnectStart` and `OnConnectEnd` now also accept a `KeyboardEvent`.
