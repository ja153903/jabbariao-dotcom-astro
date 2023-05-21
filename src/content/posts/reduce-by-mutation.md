---
layout: ../../layouts/PostLayout.astro
title: Writing efficient reduce functions in JavaScript
description: A simple best practice to pick up
date: 2023-05-20
slug: reduce-with-mutation
approxTimeSpentReading: 1
---

When I first started using the spread operator in JavaScript,
I never once stopped to think of how expensive copies can be.

So I found myself writing my `.reduce()` functions like the following:

```js
const someReducedArr = arr.reduce((acc, item) => {
  if (somePredFn(item)) {
    return {
      ...acc,
      [item.id]: item,
    };
  }

  return acc;
}, {});
```

Notice that every time our predicate function evaluates to `TRUE`, we return a new object that
spreads the existing accumulator into a new object with our new item.

This _can_ become a problem because we're creating a new object every time.

To solve this problem, we can write our reduce like so:

```js
const someReducedArr = arr.reduce((acc, item) => {
  if (somePredFn(item)) {
    acc[item.id] = item;
  }

  return acc;
}, {});
```

This way we only create one object and just mutate that object until we reach the end of our array.
