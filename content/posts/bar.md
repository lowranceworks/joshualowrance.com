---
title: "Bar"
date: "2026-03-29"
description: "A first post to test."
mode: professional
---

This is a sample professional post. It will only appear when the site is in professional mode (`?mode=professional`).

## How it works

Each markdown file in `content/posts/` becomes a blog post. The filename (without `.md`) becomes the URL slug. Frontmatter fields:

- **title** — displayed as the post heading
- **date** — publication date in `YYYY-MM-DD` format
- **description** — optional summary shown in the post list
- **mode** — `personal`, `professional`, or omit to show in both

## Markdown support

Standard markdown features work out of the box:

- **Bold**, *italic*, and `inline code`
- [Links](https://example.com)
- Lists, blockquotes, headings
- Code blocks

> This is a blockquote.

```js
const greeting = "Hello, world!";
console.log(greeting);
```
