---
layout: ../../layouts/PostLayout.astro
title: Advent of Code 2023 - Day 2 - Python
description: Solving Day 1 with Python
date: 2023-12-02
slug: aoc-2023-day2
---

It looks like they had mercy on people's souls with day 2.

Most of the work for day 2 was really with parsing each line, but other than that
the intuition for the problem was quite simple.

But first, let's go over what we're being asked in part 1.

We're given the following data as input:

```
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
```

Some elf will pull a number of different cubes from a bag and this elf will show you these cubes
our job here is to figure out which game ID can be satisfied given constraints on how many cubes
we have for each color.

For part 1, we can't have more than 12 red cubes, 13 green cubes, and 14 blue cubes. So ideally, here
we want to find the maximum number of cubes per line.

So the first thing I wanted to do was parse the data that we've read in.

```python
from collections import defaultdict
from typing import DefaultDict, TypedDict

from utils.base_solution import BaseSolution


class Cube(TypedDict):
    red: int
    blue: int
    green: int


def default_cube_state() -> Cube:
    return {"red": 0, "blue": 0, "green": 0}


class Solution(BaseSolution):
    # ...omitting part1 and part 2 code for now
    def get_cubes_by_game_id(self) -> DefaultDict[str, Cube]:
        cubes_by_id = defaultdict(default_cube_state)

        for line in self.data:
            left, right = line.split(": ")
            _, game_id = left.split(" ")
            game_sets = right.split("; ")

            for game_set in game_sets:
                color_counts = game_set.split(", ")
                for color_count in color_counts:
                    count, color = color_count.split(" ")
                    cubes_by_id[game_id][color] = max(
                        cubes_by_id[game_id][color], int(count)
                    )

        return cubes_by_id
```

Going through this method, we see that for each line, we'll split first by `: ` so that we can get the left side which contains the
game ID and the right side which contains all the game sets.

We do another simple split to get the game ID on the `left` side and we split on `; ` to get the various game sets on the right side.

For each of the game sets, we'll split by `, ` to get the various *color counts* such as `3 blue` or `4 green`. Then we'll
update a dictionary that we've initialized with the maximum cube count for a certain color for a specific game ID.

Having this record will let us know in a later step whether we want to filter the record for our final solution.

Now that we have a data structure that contains the data like such:

```python
cubes_by_id = {
  '1': {'red': 12, 'blue': 2, 'green': 23},
  ...
}
```

We can proceed to solve part 1. We can iterate over the dictionary entries that we have and keep only
entries where the `red`, `blue`, and `green` cubes are within our constraints.

We then cast the `id` to be a integer and collect the sum.


```python
class Solution(BaseSolution):
    def part1(self) -> int:
        cubes_by_game_id = self.get_cubes_by_game_id()

        return sum(
            int(key)
            for key, record in cubes_by_game_id.items()
            if record["red"] <= 12 and record["blue"] <= 14 and record["green"] <= 13
        )
```

Luckily, part 2 is simple in nature. We are asked to find the fewest number of cubes of each
color that could have been in the bag to make the game possible, then to find the product of all those numbers in a set, and finally
to compute the sum of all products.

What this means is that we want to find the maximum number of cubes that exists within the sets for each color. 
This is what we've already done in our pre-processing step.

After that, we simply find the product of all the entries in a record and then sum all those values up.

```python
class Solution(BaseSolution):
    def part2(self) -> int:
        cubes_by_game_id = self.get_cubes_by_game_id()

        return sum(math.prod(record.values()) for record in cubes_by_game_id.values())
```

Just like that, we've solved day 2. I'll be back for day 3.
