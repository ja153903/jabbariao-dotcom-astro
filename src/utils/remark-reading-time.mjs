import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

export function getPostReadingTime(text) {
  return getReadingTime(text);
}

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    data.astro.frontmatter.minutesRead = readingTime.text;
  };
}
