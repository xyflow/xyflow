# Contributing to React Flow and Svelte Flow

Hello there! So glad you want to help out with React Flow and Svelte Flow 🤗 You’re the best. Here’s a guide for how you can contribute to the project.

# The xyflow organization

This is the current structure:

* React Flow `@xyflow/react` can be found under [packages/react](./packages/react)
* Svelte Flow `@xyflow/svelte` can be found under [packages/svelte](./packages/svelte)
* `@xyflow/system` can be found under [packages/system](./packages/system)
* The legacy React Flow package `reactflow` (v11) is on branch "v11"

# Our Contributing Philosophy

The direction of React Flow and Svelte Flow and which new features are added, and which are left out, is decided by the core team (sometimes referred to as a “cathedral” style of development). The core team is paid to do this work ([see how here](https://xyflow.com/blog/asking-for-money-for-open-source/)). With this model we ensure that the people doing the most work on the library are paid for their time and effort, and that we prevent the library from bloating.

That being said, our libraries are only interesting because of the people who make things with it, share their work, and discuss it. Some of the most important and undervalued work in open source is from non-code contributions, and that is where we can use the most help from you.

# How can I help?

The things we need the most help for the library and its community are:

**🐛 Bug reports:** We simply can’t catch them all. Check [existing issues](https://github.com/xyflow/xyflow/issues/) and discussion first, then [create a new issue](https://github.com/xyflow/xyflow/issues/new/choose) to tell us what’s up.

**💬 Answering questions** in our [Discord Server](https://discord.gg/Bqt6xrs) and [Github discussions](https://github.com/xyflow/xyflow/discussions).

🎬 **Create tutorials**. Send them to us and we’ll happily share them!

**✏️ Edit our [Docs](https://reactflow.dev/learn/concepts/introduction/)**: Make changes in our [web repo](https://github.com/xyflow/web), where our docs live.

All interactions should be done with care following our [Code of Conduct](https://github.com/xyflow/xyflow/blob/main/CODE_OF_CONDUCT.md).

## Enhancements

If you have an idea or suggestion for an enhancement to the React Flow or Svelte Flow library, please use the [New Features](https://github.com/xyflow/xyflow/discussions/categories/new-features) discussion section. If you want to build it yourself, **please reach out to us before you dive into a new pull request.** The direction of React Flow/ Svelte Flow and which new features are added are discussed in our Discord Server and in [this Github discussions section](https://github.com/xyflow/xyflow/discussions/categories/new-features), and in the end they are decided by the core team.

Talking to us first about the enhancement you want to build will be the most likely way to get your pull request into the library (see Our Contributing Philosophy above). We would hate to see you write code you’re proud of, just to learn that we’ve already been working on the same thing, or that we feel doesn’t fit into the core library.

### Contact us

To ask about a possible enhancement, email us at info@xyflow.com


## 💫 Pull Requests

If you want to contribute improvements or new features we are happy to review your PR :)
Please use a meaningful commit message and add a little description of your changes.

1. Install dependencies `pnpm install`
2. Build once with `pnpm build`, then start Storybook with `pnpm storybook`
3. Test your changes with the existing Storybook stories or add a new story if needed
4. Run `pnpm test:storybook`, `pnpm test:cypress:react`, and `pnpm test:cypress:components`; add tests for new features

## Changeset Style Guide

*Inspired and taken from [Common Changelogs](https://github.com/vweevers/common-changelog?tab=readme-ov-file) and [Warp by Broad Institute](https://broadinstitute.github.io/warp/docs/contribution/contribute_to_warp/changelog_style/)*

If you are writing a changeset for a PR, here are some helpful tips:

## TLDR

- Changelogs are for humans
- Communicate the impact of changes
- Use active voice *and* presence tense *(”Fix …” instead of “… was fixed”)*
- Omit redundant verbs
    - *“Document” instead of “Add documentation”*
- Omit personal pronouns
- Use backticks for function or component names (`getNodesBounds`, `<ReactFlow />`, etc) for a better syntax highlighting

## Examples

**🛑 Bad:**
“minimap: use latest node dimensions”

**✅ Good:**
“Display minimap nodes even if onNodesChange is not implemented”

**🛑 Bad:**
“fix(handles): reconnect for connectionMode=loose”

**✅ Good:**
“Fix reconnections when connectionMode is set to loose”

**🛑 Bad:**
“use correct index when using setNodes for inserting”

**✅ Good:**
“Fix incorrect order of nodes added with setNodes from useReactFlow”
