---
layout: ../../layouts/PostLayout.astro
title: Debounce in JavaScript
description: The Fizz-Buzz of front-end interview questions
date: 2023-06-02
slug: debounce-js
---

Another question I want to tackle is implementing `debounce`, but before we do that
let's define what debouncing a request even is.

## Use Case

So when do we typically debounce a request? An example I like to think of is a search bar
that renders a list of suggestions as you type.

For each keystroke, we'll ideally want to fire a request to our server to get the appropriate suggestions.
However, if we type too quickly, we'll end up making more requests than we want which can be detrimental
to the app's performance.

What debouncing a request can do is make sure that we only fire a request/callback after some set amount of time with the freshest input data.

For example, we may want to only trigger the search 500ms after the user has stopped typing and if the user continues
to type, we'd want to make sure that the only request made is the latest input.

## Implementing debounce from scratch

There are libraries like `lodash` that provide an implementation of `debounce`, but we're going to implement one for ourselves.

Let's start with a function definition to set the expectations for what the function should take and return.

```js
/**
 * @param {Function} func
 * @param {number} time
 * @returns {Function}
 */
function debounce(func, time) {
  return function (...args) {};
}
```

`debounce` is a higher-order function that takes some function and a number that represents how long we want to wait out before
queueing another callback into the message queue.

Given that we're going to wait some time before running the callback, we should use `setTimeout` and call `func` in there with the appropriate arguments.

```js
/**
 * @param {Function} func
 * @param {number} time
 * @returns {Function}
 */
function debounce(func, time) {
  return function (...args) {
    setTimeout(() => {
      func.apply(this, args);
    }, time);
  };
}
```

Although we've implemented the `setTimeout` in the code snippet above. We're still missing
a key piece for debouncing and that is the clearing of any existing timeouts and callback functions.

In order to avoid making unnecessary requests, we need to clear the existing timeout and naturally the callback within
that timeout.

To do this we should call `clearTimeout` every time the function is invoked and
pass in some reference to the timeout that was created in `setTimeout` via some `timeoutId` variable.

```js
/**
 * @param {Function} func
 * @param {number} time
 * @returns {Function}
 */
function debounce(func, time) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, time);
  };
}
```
