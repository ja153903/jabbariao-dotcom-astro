---
layout: ../../layouts/PostLayout.astro
title: Throttle in JavaScript
description: Another popular frontend interview question
date: 2025-01-02
slug: throttle-js
---

Throttling in JavaScript is when you want to make sure that a callback function isn't called more than once given some cooldown period.

Let's try to implement this in JavaScript.

```js
function throttle(func, cooldown) {
  let isThrottled = false;
  let result;

  return function(...args) {
    if (isThrottled) {
      return result
    }

    result = func.apply(this, args);
    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
    }, cooldown);

    return result;
  }
}
```

This function `throttle` takes a function and a cooldown period as its arguments.
It returns a function that we can call with any number of arguments.

If the function is currently throttled, then we'll return the previous result.
Otherwise, we evaluate the function with the given arguments and set `isThrottled` to true.

We also call a `setTimeout` such that after some cooldown period, we set `isThrottled` back to false.
