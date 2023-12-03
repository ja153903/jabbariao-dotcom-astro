---
layout: ../../layouts/PostLayout.astro
title: Advent of Code 2023 - Day 3 - Python
description: Solving Day 3 with Python
date: 2023-12-03
slug: aoc-2023-day3
---

I might have overcomplicated the code for my day 3 solution, but at the time,
this was the most intuitive way I saw it.

Day 3 gave us a grid of numbers, symbols, and periods. Our task for part 1 was
to find numbers adjacent to symbols and sum them all up.

So suppose that we have the following grid:

```
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
```

We can see that for the first `*` `467` and `35` are adjacent to the star.
Then the `#` has `633` adjacent to it and etc.

So the idea here is to iterate over the entire grid and find the symbols.
For each symbol, we want to check if there's an adjacent digit. If so, we
want the grab the entire digit and add it to our sum.

The one thing I was worrying about was how I would retrieve the entire digit without
doing a lot more work for each symbol.

To solve this portion of the question, I generated two hash maps.

The first hash map which i called `lookup` has the coordinates as the key
and the value is the full digit nearby.

For example, in our above grid, part of our `lookup` table would be the following:

```python
lookup = {
  '0,0': 467,
  '0,1': 467,
  '0,2': 467,
  ...
}
```

This way, we can look up the indices directly on the hash map to retrieve the entire number.

The other hash map I created was to account for related coordinates. We want to make sure
that when we're iterating over the grid that we don't double-count any coordinates. So I wanted
to make sure that any visited coordinate and its related coordinates are placed within a `visited` set.

To do this, we need a record of a coordinate and its related coordinates. This hash table would look
the following:

```python
related_coords = {
  '0,0': set('0,0', '0,1', '0,2'),
  '0,1': set('0,0', '0,1', '0,2'),
  '0,2': set('0,0', '0,1', '0,2'),
  ...
}
```

So when we visit the first `*` and find that `0,2` is an adjacent coordinate with a number, we know to
add `467` to our result and also add `0,0`, `0,1`, and `0,2` to our `visited` set so we don't double-count.

Here is the implementation of the strategy above:

```python
class Solution(BaseSolution):
    def get_lookup_table_and_related_coordinates(
        self
    ) -> tuple[dict[str, int], dict[str, set]]:
        """
        We want to create a pair of dictionaries that contain
        the following information:
        - A map from some coordinate (row, col) -> the full number
          * For example, {(0, 0) -> 467, (0, 1) -> 467, (0, 2) -> 467}
        - A map from some coordinate (row, col) -> related coordinates that fulfill the number
          * For example, {(0, 0) -> set((0, 0), (0, 1), (0, 2)), (0, 1) -> set((0, 0), (0, 1), (0, 2)), ...}

        These dictionaries help us easily map which number is adjacent to some symbol and also helps us
        dedupe possible duplicates while we're trying to check adjacent characters by allowing us
        to insert all related coordinates into some data structure that keeps track of visited coordinates.
        """

        lookup = {}
        related_coords = defaultdict(set)

        for row, line in enumerate(self.data):
            itr = re.finditer(r"\d+", line)
            fndall = re.findall(r"\d+", line)

            for m, num in zip(itr, fndall):
                coords = set()
                for i in range(len(num)):
                    key = f"{row},{m.start() + i}"
                    coords.add(key)
                    lookup[key] = int(num)

                for coord in coords:
                    related_coords[coord] = coords

        return lookup, related_coords
```

Now for part 1, we take advantage of our lookup table and the related coordinates and go through each
character in the grid. If we have a symbol, we look around for adjacent numbers and add them to a result.

```python
DIRS = ((0, 1), (1, 0), (1, 1), (-1, 0), (0, -1), (-1, -1), (-1, 1), (1, -1))


class Solution(BaseSolution):
    def part1(self) -> int:
        """
        Find numbers adjacent to symbols.
        Sum them all up.
        """
        lookup, related_coords = self.get_lookup_table_and_related_coordinates()
        result = 0

        visited = set()

        for row, line in enumerate(self.data):
            for col, char in enumerate(line):
                if not char.isdigit() and char != ".":
                    for drow, dcol in DIRS:
                        nrow = row + drow
                        ncol = col + dcol

                        if (
                            nrow < 0
                            or nrow >= len(self.data)
                            or ncol < 0
                            or ncol >= len(line)
                        ):
                            continue

                        key = f"{nrow},{ncol}"
                        if key in lookup and key not in visited:
                            result += lookup[key]
                            visited.update(related_coords[key])

        return result
```

For part 2, we simplify the constraints. We only want to look for `*` and there have to be only 2 digits adjacent to the symbol.

```python
class Solution(BaseSolution):
    def part2(self) -> int:
        """
        Only symbol we care about is *
        and we only want to consider * when
        there are two part numbers associated
        with the *.

        We find the product of those part numbers
        and for every instance of *, we sum up all those
        products
        """

        lookup, related_coords = self.get_lookup_table_and_related_coordinates()
        result = 0

        for row, line in enumerate(self.data):
            for col, char in enumerate(line):
                if char == "*":
                    visited = set()
                    part_numbers = []

                    for drow, dcol in DIRS:
                        # Break out if no need to search
                        if len(part_numbers) > 2:
                            break

                        nrow = row + drow
                        ncol = col + dcol

                        if (
                            nrow < 0
                            or nrow >= len(self.data)
                            or ncol < 0
                            or ncol >= len(line)
                        ):
                            continue

                        key = f"{nrow},{ncol}"
                        if key in lookup and key not in visited:
                            part_numbers.append(lookup[key])
                            visited.update(related_coords[key])

                    if len(part_numbers) == 2:
                        result += math.prod(part_numbers)

        return result
```

With that, day 3 comes to a close. Will be back for day 4.
