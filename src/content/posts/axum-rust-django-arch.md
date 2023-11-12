---
layout: ../../layouts/PostLayout.astro
title: Importing Router objects from other directories in Axum
description: Using a Django-like app structure for Axum projects
date: 2023-11-11
slug: axum-router-import
---

Whenever I work on backend code, I prefer to use a Django-styled approach to my directory structure. This means I'll have several *apps* that have isolated logic.

So, when I started using Axum, a Rust-based web framework, I adopted a similar structure. In order to achieve this structure, we have to make sure that each *app* will export a single `Router` object.

We would then nest the exported `Router` object with our base `Router`.

Here's an example of this. Suppose that we have the following code that lives within `src/example/router.rs`.

```rust
use axum::{routing::get, Json, Router};
use serde::Serialize;

pub fn get_example_router() -> Router {
    Router::new().route("/", get(get_hello))
}

async fn get_hello() -> Json<HelloWorld> {
    Json(HelloWorld {
        message: String::from("Hello, world"),
    })
}

#[derive(Serialize)]
struct HelloWorld {
    message: String,
}
```

In this file, we're creating a local `Router` object that has our handler for our `get_hello` endpoint. This local `Router` will then be nested on our base `Router` object which I'll show shortly.

Now in our `src/main.rs` file, we're going to have the following:

```rust
mod example;

use axum::Router;

use example::routes::get_example_router;

#[tokio::main]
async fn main() {
    let app = Router::new().nest("/api/example", get_example_router());

    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
```

