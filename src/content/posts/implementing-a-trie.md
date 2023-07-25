---
layout: ../../layouts/PostLayout.astro
title: Implementing a Trie in TypeScript
description: Let's build a naive version of a pretty useful data structure
date: 2023-07-25
slug: trie-typescript
---

## So why are we implementing a trie?

A typical application of tries is to generate suggestions for a typeahead/auto-suggest system. So knowing how tries can work is definitely within the ballpark of a front-end engineer.

Understanding the basics of how a trie works is definitely useful in a high-level discussion on how to implement such systems.

Here's a [Wikipedia link](https://en.wikipedia.org/wiki/Trie) to a more formal and generic definition.

## Our simplified implementation

For our case, we'll suppose that we have a database of words such as:

```ts
const DATABASE = [
    "apple",
    "tree",
    "asphalt",
    ...
];
```

Then, suppose that we want to generate suggestions based on what
the user has typed into a search bar. One way we can do this is by creating a trie that can memoize suggestions at the individual prefix node level.

Let's also assume that we're not accounting for typos and all searches are single word strings.

Now, let's spec out what functions we'll want to implement.

```ts
class TrieWithSuggestions {
  insert(word: string) {}

  query(input: string) {}
}
```

The `insert` function will for obvious reasons insert a word into the trie.

The `query` function will fetch the appropriate suggestions based on what the user has entered into the search bar.

We should also figure out what data structures will be necessary to store items within the trie implementation.

## Rough implementation in TypeScript

For our trie, we'll want to make sure that we keep track of the `suggestions` and the `children` at every level.

Let's create two private variables: `suggestions` and `children` where `suggestions` should be a set of strings and `children` is a HashMap where the key is the character prefix and the value is another `Trie` instance.

Given this information let's start by implementing a constructor to initialize our data structures

```ts
class TrieWithSuggestions {
  private suggestions: Set<string>;
  private children: Map<string, TrieWithSuggestions>;

  constructor() {
    this.suggestions = new Set();
    this.children = new Map();
  }
}
```

### TrieWithSuggestions::insert

Next let's think about how to implement the `insert` function. The idea with insert is to go
character by character and insert nodes into the trie if needed.

We also have to remember that at every level to insert the **entire** word into our suggestions
set.

If the current node's `children` hashmap does not contain the character we're iterating on,
then we should create a new instance of a `Trie` node and include it into the current node's
`children` hashmap.

The implementation will look like the following:

```ts
class TrieWithSuggestions {
  // ... Refer to code above if needed

  insert(word: string) {
    let current: TrieWithSuggestions = this;

    for (const ch of word) {
      if (!current.children.has(ch)) {
        current.children.set(ch, new TrieWithSuggestions());
      }

      current = current.children.get(ch)!;
      current.suggestions.add(word);
    }
  }
}
```

The `insert` function runs in `O(n)` time where `n` is the length of the `word` argument we provide.

### TrieWithSuggestions::query

Finally, let's also implement the `query` function.

This function takes some `input` that we would get from the client and do a similar iteration starting from the root of the `Trie` instance. If at any point, the character doesn't exist in the `Trie`, then we should just stop iteration and return the `suggestions` up to that point.

Otherwise, we'll finish up iteration and return the `suggestions` which should be more specific if it ever reaches the end of the word.

```ts
class TrieWithSuggestions {
  // ... Refer to code above if needed

  query(input: string): string[] {
    let current: TrieWithSuggestions = this;

    for (const ch of input) {
      if (!current.children.has(ch)) {
        break;
      }

      current = current.children.get(ch)!;
    }

    return Array.from(current.suggestions);
  }
}
```

The `query` function runs in `O(n)` time where `n` is the length of the `input` argument we provide.

### Testing

Let's also build up some unit tests (expand if you want) to show that this is somewhat working.

```ts
describe("TrieWithSuggestions", () => {
  test("should pass a basic case", () => {
    const root = new TrieWithSuggestions();

    const words = ["apple", "accent", "application", "bootstrap", "bottom"];

    words.forEach((word) => {
      root.insert(word);
    });

    expect(root.query("a").sort((a, b) => a.localeCompare(b))).toStrictEqual([
      "accent",
      "apple",
      "application",
    ]);
    expect(root.query("app").sort((a, b) => a.localeCompare(b))).toStrictEqual([
      "apple",
      "application",
    ]);
  });
});
```

### Code in full

```ts
export class TrieWithSuggestions {
  private suggestions: Set<string>;
  private children: Map<string, TrieWithSuggestions>;

  constructor() {
    this.suggestions = new Set();
    this.children = new Map();
  }

  insert(word: string) {
    let current: TrieWithSuggestions = this;

    for (const ch of word) {
      if (!current.children.has(ch)) {
        current.children.set(ch, new TrieWithSuggestions());
      }

      current = current.children.get(ch)!;
      current.suggestions.add(word);
    }
  }

  query(input: string): string[] {
    let current: TrieWithSuggestions = this;

    for (const ch of input) {
      if (!current.children.has(ch)) {
        break;
      }

      current = current.children.get(ch)!;
    }

    return Array.from(current.suggestions);
  }
}
```