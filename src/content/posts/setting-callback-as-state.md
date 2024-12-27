---
layout: ../../layouts/PostLayout.astro
title: Setting a callback in React useState
description: When would we want to set a callback function as React state?
date: 2024-12-27
slug: usestate-callback
---

I'm sure that you've seen this once in a while where we have a call to React's `useState`, but the value within that `useState`
happens to be a callback function.

For example, we could do something like the following:

```tsx
const [onFirstRenderTimestamp] = React.useState(() => Date.now());
```

What does this actually achieve? When we pass a pure function as state in React, we are creating an initializer function.
The function is only called once during initialization and on every subsequent render, we won't have to recreate the initial state.

This is generally useful if the initial state of the task requires an expensive operation that we really only want to do once.
I've also used it in cases where I wanted to profile certain events within a component such as waiting for certain asynchronous tasks to resolve
and getting a gist of how long that would take.
