---
layout: ../../layouts/PostLayout.astro
title: Advent of Code 2023 - Day 1 - Python
description: Solving Day 1 with Python
date: 2023-12-01
slug: aoc-2023-day1
---

I know some of the fastest coders for Advent of Code will be minimal with the problem solving approach.
This year, I wanted to do it in Python and still focus on writing readable code.

So let's get into the problem.

In terms of the data we're provided, we're given lines of strings that contain alphanumeric characters.

Part 1 of the problem tasks us with finding the first and last digit within a line to form a two digit integer.
We eventually want to find the sum of all such integers from the file.

I have my own utility set up for solving Advent of Code which is available in [this repository](https://github.com/ja153903/advent_of_code).
So forgive me if this code seems a bit foreign, but I wanted to abstract the reading of the files and separation
between real and test data.

```python
class Solution(BaseSolution):
    def __init__(self, year: int, day: int, is_test: bool = False):
        super().__init__(year, day, should_read_file=True, is_test=is_test)

    def part1(self) -> int:
        return sum(self.extract_digits_for_part1(line) for line in self.data)

    def extract_digits_for_part1(self, line: str) -> int:
        left, right = 0, len(line) - 1

        while left <= right and not line[left].isdigit() or not line[right].isdigit():
            if not line[left].isdigit():
                left += 1

            if not line[right].isdigit():
                right -= 1

        return int(line[left]) * 10 + int(line[right])
```

To solve part 1, I simply used a two-pointer approach to find the first and last digits. Then, I found the sum of all such two-digit numbers.

Part 2 made it a little more involved by also allowing the written representation of a digit to count towards our two-digit number. This means that
strings such as *one*, *two*, *three*, etc. would also count as digits.

```python
DIGITS_AS_STR = ("one", "two", "three", "four", "five", "six", "seven", "eight", "nine")


class Solution(BaseSolution):
    # ...Ignoring previous part

    def part2(self) -> int:
        return sum(self.extract_digits_for_part2(line) for line in self.data)

    def extract_digits_for_part2(self, line: str) -> int:
        digit_indices = [(i, int(val)) for i, val in enumerate(line) if val.isdigit()]
        digit_indices.extend(self.find_indices_of_digit_as_word(line))

        digit_indices.sort(key=lambda t: t[0])

        fst, lst = digit_indices[0][1], digit_indices[-1][1]

        return fst * 10 + lst

    def find_indices_of_digit_as_word(self, line: str) -> list[Tuple[int, int]]:
        indices = []

        for i, num in enumerate(DIGITS_AS_STR):
            for m in re.finditer(num, line):
                indices.append((m.start(), i + 1))

        return indices
```

The logic for this problem is a little more involved. I collected all the indices where we either have a written representation of a digit
or just the actual digit character. I would collect all these digits and their corresponding indices in a list. I would then
sort this list by the indices so that I can easily pull the first and last indices. Then like before, I would just compute the two-digit number.

One thing to note here is that I did an exhaustive search for each line to find if it contains any of the written representations of a digit.

That's a wrap for day 1. I'll be back again with another write-up for day 2.
