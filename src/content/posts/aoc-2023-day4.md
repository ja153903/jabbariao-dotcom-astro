---
layout: ../../layouts/PostLayout.astro
title: Advent of Code 2023 - Day 4 - Python
description: Solving Day 4 with Python
date: 2023-12-04
slug: aoc-2023-day4
---

Day 4's problem is simple just like day 2.

We're given a list of scratchcards that contain the winning numbers on the left side of the divider
and the numbers you've chosen on the right side.

Part 1 wants us to compute the total number of points from every entry that we have.

For each entry, you earn a point based on the number of matching numbers between the winning and chosen set.
For each match, you double the point total such that if you have 4 matches, this means that you have earned 8 points.
So the progression looks like `1 -> 2 -> 4 -> 8` for 4 matches. We can generalize this to be `2 ** (matches - 1)` which we'll use
in our code to compute the point total

So for part 1, my solution is the following:

```python
class Entry(TypedDict):
    id: int
    winning_numbers: list[int]
    chosen_numbers: list[int]


class Solution(BaseSolution):
    def part1(self):
        return sum(
            self.get_points(self.get_entry_from_line(line)) for line in self.data
        )

    def get_entry_from_line(self, line: str) -> Entry:
        left, right = line.split(": ")
        *_, id = left.split()
        winning, chosen = right.split(" | ")

        winning_numbers = self.parse_as_list_int(winning)
        chosen_numbers = self.parse_as_list_int(chosen)

        return {
            "id": int(id),
            "winning_numbers": winning_numbers,
            "chosen_numbers": chosen_numbers,
        }

    def get_points(self, entry: Entry) -> int:
        matches = self.get_num_matches(entry)

        if matches == 0:
            return 0

        return 2 ** (matches - 1)

    def get_num_matches(self, entry: Entry) -> int:
        intersection = set(entry["winning_numbers"]).intersection(
            set(entry["chosen_numbers"])
        )
        return len(intersection)

    def parse_as_list_int(self, s: str) -> list[int]:
        return [int(el) for el in ()]

```

Part 2 shakes things up a little bit, but nothing too dramatic.
Instead of just counting points based on doubling values from matches, we're now going to create copies of future scratchcards
based on the number of matches.

For example, if card 1 has 3 matches, then we have to create copies of card 2, card 3, and card 4.
Then if we're on card 2 (which has 2 instances), and card 2 has 3 matches. This means that we need to create 2 copies each for card 3, 4, and 5.

So we keep doing this until we've gone through all the cards. We then sum up the total number of original and copies of the scratchcards.

```python
class Solution(BaseSolution):
    def part2(self):
        freq = Counter()
        for line in self.data:
            entry = self.get_entry_from_line(line)
            freq[entry["id"]] += 1

            num_matches = self.get_num_matches(entry)

            for i in range(1, num_matches + 1):
                freq[entry["id"] + i] += freq[entry["id"]]

        return sum(freq.values())
```

That's a wrap for day 4. I'll be back for day 5.
