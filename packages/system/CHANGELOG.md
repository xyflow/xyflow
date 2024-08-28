# @xyflow/system

## 0.0.40

### Patch Changes

- [#4594](https://github.com/xyflow/xyflow/pull/4594) [`5138d90b`](https://github.com/xyflow/xyflow/commit/5138d90bdb91ff5d8dbeb8c8d29bdfd31c5b59d6) Thanks [@peterkogo](https://github.com/peterkogo)! - Fixed reconnecting edges with loose connectionMode

- [#4603](https://github.com/xyflow/xyflow/pull/4603) [`12dbe125`](https://github.com/xyflow/xyflow/commit/12dbe125755fad7d2f6dff19100872dd823d1012) Thanks [@moklick](https://github.com/moklick)! - use correct index when using setNodes for inserting

## 0.0.39

### Patch Changes

- [#4568](https://github.com/xyflow/xyflow/pull/4568) [`c3e62782`](https://github.com/xyflow/xyflow/commit/c3e6278222dc13333f75ecdbe634201ddabab87a) Thanks [@peterkogo](https://github.com/peterkogo)! - Only display grab cursor when panOnDrag is on left mouse button

## 0.0.38

### Patch Changes

- [#4544](https://github.com/xyflow/xyflow/pull/4544) [`b63a3734`](https://github.com/xyflow/xyflow/commit/b63a3734b84b6817603c8e6e48e2836f048acc3b) Thanks [@moklick](https://github.com/moklick)! - strengthen css selector for edges for overflow visible

- [#4555](https://github.com/xyflow/xyflow/pull/4555) [`24e87e39`](https://github.com/xyflow/xyflow/commit/24e87e398419646f671af1085fbfec3e197bc56b) Thanks [@peterkogo](https://github.com/peterkogo)! - Added final connection state as a function parameter to onReconnectEnd

- [#4548](https://github.com/xyflow/xyflow/pull/4548) [`692e6440`](https://github.com/xyflow/xyflow/commit/692e6440b10e75cb31f3f3172aede9ed4d7f05d2) Thanks [@peterkogo](https://github.com/peterkogo)! - Replaced algorithm used for searching close handles while connecting

- [#4519](https://github.com/xyflow/xyflow/pull/4519) [`559d4926`](https://github.com/xyflow/xyflow/commit/559d49264b940f93c5e205bf984aa76230b10806) Thanks [@peterkogo](https://github.com/peterkogo)! - fix(connection) snapped position not updated correctly

- [#4538](https://github.com/xyflow/xyflow/pull/4538) [`4ecfd7e1`](https://github.com/xyflow/xyflow/commit/4ecfd7e19720b70024d0b5dff27d4537dd46b49a) Thanks [@bcakmakoglu](https://github.com/bcakmakoglu)! - Use the handle id of the matching handle type when warning about an edge that can't be created due to missing handle ids.

- [#4536](https://github.com/xyflow/xyflow/pull/4536) [`e7ef328f`](https://github.com/xyflow/xyflow/commit/e7ef328f8f9286a817b19457d38c491e6c0bcffd) Thanks [@peterkogo](https://github.com/peterkogo)! - fix(onlyRenderVisible) edges to offscreen nodes with fixed width & height displayed correctly

- [#4549](https://github.com/xyflow/xyflow/pull/4549) [`99733c01`](https://github.com/xyflow/xyflow/commit/99733c01bc70f9463e7dba0046c5f8d839a1d2ba) Thanks [@moklick](https://github.com/moklick)! - feat(onConnectEnd): pass connectionState param

## 0.0.37

### Patch Changes

- [#4465](https://github.com/xyflow/xyflow/pull/4465) [`543c0939`](https://github.com/xyflow/xyflow/commit/543c09392d53fdd56a8876e65f4ce2d8ab250098) Thanks [@moklick](https://github.com/moklick)! - fix(nodes): re-measure when measured is not set

- [#4464](https://github.com/xyflow/xyflow/pull/4464) [`89cd677b`](https://github.com/xyflow/xyflow/commit/89cd677b5668b78434e02e7b025c6ac58db91e58) Thanks [@moklick](https://github.com/moklick)! - fix(handles): reconnect for connectionMode=loose

- [#4467](https://github.com/xyflow/xyflow/pull/4467) [`c253c7c5`](https://github.com/xyflow/xyflow/commit/c253c7c59a2ccd2cb91ad44ce4acbe481d9d7fe1) Thanks [@moklick](https://github.com/moklick)! - chore(subflows): log warning instead of throwing an error when parent node cant be found

## 0.0.36

### Patch Changes

- [#4446](https://github.com/xyflow/xyflow/pull/4446) [`80baf53b`](https://github.com/xyflow/xyflow/commit/80baf53bdc7d4fb0715e5eed85efdea77191935a) Thanks [@moklick](https://github.com/moklick)! - fix(resizer): export types

- [#4451](https://github.com/xyflow/xyflow/pull/4451) [`4cccd06a`](https://github.com/xyflow/xyflow/commit/4cccd06a671e9ef1c6f16ab0d788081f8d894d0e) Thanks [@moklick](https://github.com/moklick)! - add nodeClickDistance

## 0.0.35

### Patch Changes

- [#4432](https://github.com/xyflow/xyflow/pull/4432) [`d2da5765`](https://github.com/xyflow/xyflow/commit/d2da576591305873f8d6514091ee8db1ad4f79e2) Thanks [@moklick](https://github.com/moklick)! - refactor(ConnectionState): use internal node, add node generic
