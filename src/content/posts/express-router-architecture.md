---
layout: ../../layouts/PostLayout.astro
title: How I register routers in Express
description: It might be a minor optimization, but I think it's worth talking about
date: 2023-07-27
slug: express-api-routers
---

When people use `Express`, they typically write a couple endpoints and call it a day.

But suppose that you've decided to create a larger project with Express and you wanted to utilize the `Router` object that `Express` provides to break out your project into little `apps` like Django.
You might end up with dozens of directories that contain `app`-level logic and you'll find yourself registering all these routes in your `index.js` files one-by-one. Something like the following:

```js
app.use("/...", ...)
app.use("/...", ...)
app.use("/...", ...)
app.use("/...", ...)
app.use("/...", ...)
app.use("/...", ...)
app.use("/...", ...)
// ... and the list goes on.
```

Personally, I didn't like that this was how I was registering routes. So I created a `Record` where the key was the API endpoint and the value was the `Router` object in a separate file called `src/lib/routes.js`.
It looked like the following:

```js
const ROUTES = {
  [...]: someRouter,
  // This would keep growing
};
```

Given that I have them all registered in a separate common file, I also built a function that would just register the routes in the same file.

```js
/**
 * `registerRoutes` makes sure that all our routers are
 * registered with the Express app.
 *
 * @param {import("express").Express} app
 */
export function registerRoutes(app) {
  Object.entries(ROUTES).forEach(([url, router]) => {
    app.use(url, router);
  });
}
```

Now instead of having to add a new call `app.use("/...", ...)` every time I create a new `app` to register for my API, I can just add the key-value pair to the `Record`.
In my `index.js` file, we'd just have one call to `registerRoutes(app)`.

In reality, there's no real performance benefit. My code just looks less stupid now.
