---
layout: ../../layouts/PostLayout.astro
title: Is your object an array?
description: Let's talk about some ways to determine this
date: 2023-06-05
slug: is-array
---

Whenever we want to check if an object we've passed into a function is an array,
we conveniently have the `Array.isArray()` function.

However, suppose that you're trapped in some situation where you cannot use
the above function to determine if an object is an array. How can we reason about this?

You can probably assume that you can do something like `typeof array` but it turns out
this won't work because you'll get an `object`.

So what are some actual ways we can determine if your object is an array?

## `instanceof`

We can use the `instanceof` keyword to determine if an array is an Array. So we can do something like

```js
[1, 2, 3] instanceof Array;
```

## `Object.prototype.toString.call()`

Another way of figuring out if an object is an array is by calling `toString` on the object

```js
Object.prototype.toString.call([1, 2, 3]); // [Object array]
```
