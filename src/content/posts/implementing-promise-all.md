---
layout: ../../layouts/PostLayout.astro
title: Implementing Promise.all()
description: Learning more about promises
date: 2023-05-25
slug: impl-promise-all
---

When interviewing for front-end engineers, one of the questions I like to ask or be asked
involves implementing Promise methods.

One of the Promise methods that I want to go through today is `Promise.all()`.

## Problem

`Promise.all()` takes an iterable of promises as input and returns a single Promise
as a result that resolves to be an array of fulfillment values if we successfully fulfilled **all** the promises.
Otherwise, we reject if any of the promises are rejected.

## Thoughtprocess

Let's create a function stub to start.

```js
/**
 * @param {Promise[]} promises
 * @returns {Promise}
 */
Promise.prototype.all = function (promises) {};
```

The first thing I would think to do is create a result array that we can use to store the results of our fulfilled promises.

```js
/**
 * @param {Promise[]} promises
 * @returns {Promise}
 */
Promise.prototype.all = function (promises) {
  const result = new Array(promises.length);
};
```

Next, we also know that we want to make sure that we keep track of how many promises are left to be fulfilled. We can create a variable
called `unresolved` and set this variable to be the length of our promises iterable.

```js
/**
 * @param {Promise[]} promises
 * @returns {Promise}
 */
Promise.prototype.all = function (promises) {
  const numPromises = promises.length;
  const result = new Array(numPromises);
  let unresolved = numPromises;
};
```

Since we're returning a Promise, we want to make sure our return value is a Promise. We should also move all the variables we created
previously into the Promise callback.

```js
/**
 * @param {Promise[]} promises
 * @returns {Promise}
 */
Promise.prototype.all = function (promises) {
  return new Promise((resolve, reject) => {
    const numPromises = promises.length;
    const result = new Array(numPromises);
    let unresolved = numPromises;
  });
};
```

In the Promise callback, we're going to iterate over the promises.

For each Promise, we're going to try and `await` to resolve or reject the values.

If we resolve a value successfully, we're going to want to update our `unresolved` variable by decrementing it.
If `unresolved` is 0, then this means that we can call `resolve` with our `result` array.
If any of our promises are rejected, then we should call `reject` with some error message.

```js
/**
 * @param {Promise[]} promises
 * @returns {Promise}
 */
Promise.prototype.all = function (promises) {
  return new Promise((resolve, reject) => {
    const numPromises = promises.length;
    const result = new Array(numPromises);
    let unresolved = numPromises;

    if (unresolved === 0) {
      resolve(result);
      return;
    }

    promises.forEach(async (promise, index) => {
      try {
        const value = await promise;
        result[index] = value;
        unresolved--;
        if (unresolved === 0) {
          resolve(result);
        }
      } catch (err) {
        reject("Could not resolve all promises");
      }
    });
  });
};
```

## Conclusion

Hope you learned something about how Promise methods can be implemented.
