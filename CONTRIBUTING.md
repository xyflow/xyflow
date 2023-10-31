# Contributing to React Flow

Hello there! So glad you want to help out with React Flow and Svelte Flow 🤗 You’re the best. Here’s a guide for how you can contribute to the project.

# The new xyflow organization

Just recently we renamed our organization and repository of React Flow to "xyflow". Now you can not only find the source code of React Flow but also of Svelte Flow in this repository. We are in a state of transition. This is the current structure:

* React Flow `reactflow` version v11 is on branch v11
* Svelte Flow `@xyflow/svelte` can be found under [packages/svelte](./packages/svelte)
* React Flow v12 (not published yet) can be found under [packages/react](./packages/react)

# Our Contributing Philosophy

The direction of React Flow and Svelte Flow and which new features are added, and which are left out, is decided by the core team (sometimes referred to as a “cathedral” style of development). The core team is paid to do this work ([see how here](https://xyflow.com/blog/asking-for-money-for-open-source/)). With this model we ensure that the people doing the most work on the library are paid for their time and effort, and that we prevent the library from bloating.

That being said, our libraries are only interesting because of the people who make things with it, share their work, and discuss it. Some of the most important and undervalued work in open source is from non-code contributions, and that is where we can use the most help from you.

# How can I help?

The things we need the most help for the library and its community are:

**🐛 Bug reports:** We simply can’t catch them all. Check [existing issues](https://github.com/wbkd/react-flow/issues/new/choose) and discussion first, then [create a new issue](https://github.com/wbkd/react-flow/issues/new/choose) to tell us what’s up.

**💬 Answering questions** in our [Discord Server](https://discord.gg/Bqt6xrs) and [Github discussions](https://github.com/wbkd/react-flow/discussions).

🎬 **Create tutorials**. Send them to us and we’ll happily share them!

**✏️ Edit our [Docs](https://reactflow.dev/docs/introduction/)**: Make changes in the [react-flow-docs repo](https://github.com/wbkd/react-flow-docs), or click the "edit this page” button that lives on every doc site.

All interactions should be done with care following our [Code of Conduct](https://github.com/wbkd/react-flow/blob/main/CODE_OF_CONDUCT.md).

## Enhancements

If you have an idea or suggestion for an enhancement to the React Flow or Svelte Flow library, please use the [New Features](https://github.com/wbkd/react-flow/discussions/categories/new-features) discussion section. If you want to build it yourself, **please reach out to us before you dive into a new pull request.** The direction of React Flow/ Svelte Flow and which new features are added are discussed in our Discord Server and in [this Github discussions section](https://github.com/wbkd/react-flow/discussions/categories/new-features), and in the end they are decided by the core team.

Talking to us first about the enhancement you want to build will be the most likely way to get your pull request into the library (see Our Contributing Philosophy above). We would hate to see you write code you’re proud of, just to learn that we’ve already been working on the same thing, or that we feel doesn’t fit into the core library.

### Contact us

To ask about a possible enhancement, email us at info@reactflow.dev


### 💫 Pull Requests

If you want to contribute improvements or new features we are happy to review your PR :)  
Please use a meaningful commit message and add a little description of your changes.

1. Install dependencies `pnpm install` 
2. Start dev server `pnpm dev` 
3. Test your changes with the existing examples or add a new one if it's needed for your changes
4. Run tests `pnpm test` and add new new tests if you are introducing a new feature
