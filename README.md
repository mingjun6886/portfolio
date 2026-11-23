# Portfolio — Minh Quan Nguyen

Static site built with [Astro](https://astro.build). Plain CSS, no UI library.

## Run

```bash
npm install
npm run dev      # http://localhost:4321
npm test         # builds, then runs the tests
```

## Add a project

Copy any file in `src/content/projects/`, change the front matter and write the body.

| Field | Meaning |
|---|---|
| `title`, `summary` | Name and one-line description |
| `course` | Unit code (e.g. `FIT5225`); omit for personal projects |
| `team_size`, `role` | `team_size: 1` is solo; `role` is required when it is above 1 |
| `period` | Quote it, e.g. `"2026"` |
| `tags` | One or more of `Cloud`, `AI/ML`, `Planning`, `Data`, `Web` (drive the filter chips) |
| `stack`, `metrics` | Technologies; up to 3 `{ value, label }` pairs |
| `links` | `demo`, `github`, `diagram` (all optional) |
| `code_public: false` | Hides the GitHub link (use for coursework code) |
| `cover` | Image under `public/`, e.g. `/projects/x.jpg` |
| `featured: true`, `order` | Puts it in "Selected work"; lower `order` comes first |

A file with no body shows only as a tile; with a body it also gets a page at `/projects/<file-name>/`.

## Personal details

Everything about you (name, intro, degree, links, education) lives in `src/site.config.js`. Put your photo in `public/` and set `photo`, and your CV at `public/cv.pdf`.

## Before deploying

```bash
npm run predeploy
```

It fails while any `TODO(Quan)` or the placeholder URL `todo-quan` remains, if a file is missing (like `/cv.pdf`), or if a link is dead. Set the real address in `astro.config.mjs` (`site`) so link previews use the right URL.

Deploy by importing the GitHub repo in Vercel (the Astro preset needs no settings).
