# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A static Astro portfolio for Minh Quan Nguyen (graduate/junior Cloud & ML Engineer) where each project is one markdown file, ready to deploy to Vercel once Quan supplies his personal inputs.

**Architecture:** Astro 7 static output. One content collection (`projects`, glob loader over `src/content/projects/*.md`) and one personal config module (`src/site.config.js`). Pure helpers in `src/lib/projects.js` decide ordering, labels, link visibility and which entries get a detail page; components only render. Tests run with Node's built-in runner against the helpers and against the built `dist/` HTML.

**Tech Stack:** astro@7.4.13 (only dependency), plain CSS, system fonts, Node ≥22.23.4 (machine has 25.3), `node:test`, macOS `sips` + headless Chrome for images.

**Spec:** `docs/superpowers/specs/2026-11-23-portfolio-design.md` (Vietnamese). Approved homepage mockup: `docs/superpowers/specs/2026-11-23-portfolio-home-mockup.html` (look at the `.B` block for layout, spacing and copy).

## Global Constraints

- Only runtime/dev dependency: `astro` pinned to exactly `7.4.13`. No Tailwind, no UI library, no font packages, no test framework (use `node:test` + `node:assert/strict`).
- Colours (exact): background `#fafaf7`, text `#1c1c1a`, muted `#6b6b66`, accent `#1d4ed8`, rules `#e7e5df`, card `#ffffff`.
- Fonts: headings `Georgia, "Times New Roman", serif`; body `-apple-system, "Segoe UI", system-ui, sans-serif`. No web fonts.
- All site copy in English, `<html lang="en">`.
- The string "software engineer" (any case) must never appear in `dist/`. Quan's title is exactly `Cloud & ML Engineer`.
- Every number on the site must be traceable to the sources in spec §9 (plus WildLens README "Measured results"). Do not invent figures, dates or claims.
- If `code_public: false`, no link to that project's repository is rendered anywhere.
- Unknown personal inputs use the exact marker `TODO(Quan)` and the site URL placeholder `https://todo-quan.vercel.app`; `npm run predeploy` must fail while either remains.
- Light theme only. No 3D, no contact form, no blog.
- Local git only: never `git push`, never deploy. Commit messages carry no Claude/AI attribution and no `Co-Authored-By` line.

**Refinement of the spec's content table (Claude's call, spec §6 is Claude's):** `kind` is replaced by `team_size` (1 = solo) plus the optional `course`, because FIREBREAK is both a team project and coursework. Labels are derived from these two fields.

## Review Focus

1. **Narrow phones (≤390 px):** hero stacks photo above text, every grid is one column, the long email address wraps, no horizontal scroll. Pinned by `layout is mobile-safe` (Task 6) plus the Lighthouse mobile run.
2. **Clipboard unavailable (insecure context, denied permission):** "Copy email" must not pretend to succeed; a plain `mailto:` link to the address must always exist. Pinned by `contact keeps a mailto fallback` (Task 4).
3. **JavaScript disabled or the filter script failing:** every tile is visible in the static HTML. Pinned by `no tile is hidden in static HTML` (Task 4).
4. **A project with no cover, metrics or links** (Too Many Chefs, Piglet): no empty `<img>`, no empty metrics row, no dead buttons. Pinned by `bare project renders without empty boxes` (Task 5).
5. **Link previews on LinkedIn:** `og:image` and `og:url` must be absolute `https://` URLs. Pinned by `head has absolute Open Graph URLs` (Task 1).

---

### Task 1: Project skeleton, base layout, test harness

**Files:**
- Create: `package.json`, `astro.config.mjs`, `.gitignore`, `src/site.config.js`, `src/layouts/Base.astro`, `src/styles/global.css`, `src/pages/index.astro`, `tests/dist.js`, `tests/build.test.js`, `public/favicon.svg`

**Interfaces:**
- Produces: `site` (default export of `src/site.config.js`) with exactly these keys:
  `name, shortName, title, greeting, tagline, intro, description, location, university, degree, available, workRights, photo, cv, email, github, linkedin, education, experience`.
  `education` and `experience` are arrays of `{ years: string, place: string, role: string, detail: string }`.
- Produces: `Base.astro` props `{ title: string, description?: string, image?: string }` (image is a site-relative path, default `/og.png`); it renders `<slot />` inside `<main>`.
- Produces: `tests/dist.js` exporting `readDist(relPath: string): string` (reads `dist/<relPath>`, throws if missing), `distExists(relPath: string): boolean` and `allDistHtml(): string[]` (every `.html` path under `dist/`, relative).

- [ ] **Step 1: Init repo and scaffold**

Run in `/Users/nmquan/portfolio`: `git init`, then create `package.json` with `"type": "module"`, dependency `"astro": "7.4.13"`, scripts `dev: astro dev`, `build: astro build`, `preview: astro preview`, `test: astro build && node --test tests/`, `predeploy: astro build && node scripts/predeploy.mjs`. `.gitignore`: `node_modules/`, `dist/`, `.astro/`, `.DS_Store`. Run `npm install`.

`astro.config.mjs`: `site: 'https://todo-quan.vercel.app'` (static output is the default).

- [ ] **Step 2: Write `src/site.config.js` with this exact copy**

```js
export default {
  name: 'Minh Quan Nguyen',
  shortName: 'Quan',
  title: 'Cloud & ML Engineer',
  greeting: "Hi, I'm Quan.",
  tagline: 'I build cloud systems and ship ML models — and I measure them.',
  intro: "I'm a Melbourne-based cloud and ML engineer studying at Monash University. I write cloud infrastructure as code and put machine-learning models behind real APIs — most recently WildLens, a serverless wildlife-tagging platform on AWS, and the voice assistant in FIREBREAK, built with a team of five. I'm looking for a graduate or junior role in cloud, platform or ML engineering.",
  description: 'Minh Quan Nguyen — Cloud & ML Engineer in Melbourne. Projects with measured results: serverless ML on AWS, Kubernetes inference and a voice-assisted bushfire app.',
  location: 'Melbourne, Australia',
  university: 'Monash University',
  degree: 'TODO(Quan): degree name',
  available: 'TODO(Quan): month/year',
  workRights: null,            // optional; null hides it
  photo: null,                 // e.g. '/photo.jpg'; null shows initials
  cv: '/cv.pdf',
  email: 'minhquan.nguyen1202@gmail.com',
  github: 'https://github.com/mingjun6886',
  linkedin: 'TODO(Quan): LinkedIn URL',
  education: [
    { years: 'TODO(Quan): years', place: 'Monash University', role: 'TODO(Quan): degree name', detail: 'Cloud Computing, Machine Learning, NLP, Data Processing, Planning, Industry Experience' },
    { years: 'TODO(Quan): years', place: 'Macquarie University', role: 'TODO(Quan): degree name', detail: 'Data Science, Big Data, Databases' },
  ],
  experience: [],              // empty hides the experience list
};
```

- [ ] **Step 3: Write the failing head test** in `tests/build.test.js`

```js
test('head is complete', () => {
  const html = readDist('index.html');
  assert.match(html, /<html lang="en"/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /<meta name="description" content="Minh Quan Nguyen — Cloud &amp; ML Engineer/);
  assert.match(html, /src="\/_vercel\/insights\/script.js"/);
});
test('head has absolute Open Graph URLs', () => {
  const html = readDist('index.html');
  assert.match(html, /property="og:image" content="https:\/\/[^"]+\/og\.png"/);
  assert.match(html, /property="og:url" content="https:\/\/[^"]+"/);
  assert.match(html, /property="og:title"/);
});
test('never calls Quan a software engineer', () => {
  for (const f of allDistHtml()) assert.doesNotMatch(readDist(f), /software engineer/i, f);
});
```

- [ ] **Step 4: Run `npm test`** — Expected: FAIL (no layout yet / build output missing tags).

- [ ] **Step 5: Implement `Base.astro`, `global.css`, minimal `index.astro`, `favicon.svg`**

`Base.astro`: charset, viewport, `<title>`, description, `og:title/description/url/image/type`, `twitter:card=summary_large_image`, favicon, `<script defer src="/_vercel/insights/script.js"></script>`; absolute URLs via `new URL(path, Astro.site)`. `global.css`: colour/font tokens from Global Constraints as CSS custom properties, `body` background, a `.container` (max-width 1040px, 16px side padding on mobile, 44px ≥720px), `:focus-visible` outline in accent, `.btn` (dark pill) and `.lnk` (underlined) from the mockup. `favicon.svg`: "MQ" monogram on `#1c1c1a`. `index.astro` renders `Base` with an empty `<main>` for now.

- [ ] **Step 6: Run `npm test`** — Expected: PASS.

- [ ] **Step 7: Commit** — also add `docs/` (spec, mockup, this plan).

```bash
git add -A && git commit -m "feat: Astro skeleton, base layout and test harness"
```

---

### Task 2: Content schema and project helpers

**Files:**
- Create: `src/lib/projects.js`, `src/content.config.ts`, `tests/projects.test.js`

**Interfaces:**
- Produces (all in `src/lib/projects.js`, plain JS + JSDoc so `node --test` can import it):
  - `TAG_ORDER = ['Cloud', 'AI/ML', 'Planning', 'Data', 'Web']`
  - `teamLabel(data) -> string` — `'Solo'` when `team_size` is 1, else `` `Team of ${team_size}` ``
  - `kicker(data) -> string` — `[course, teamLabel(data)]` without empties, joined by `' · '`
  - `featuredProjects(entries) -> entries` — `data.featured` only, sorted by `data.order` then `data.title`
  - `otherProjects(entries) -> entries` — non-featured, same sort
  - `hasDetailPage(entry) -> boolean` — `entry.body` has non-whitespace text
  - `visibleLinks(data) -> { demo?, github?, diagram? }` — `github` omitted when `code_public === false`; unset links omitted
  - `filterTags(entries) -> string[]` — `TAG_ORDER` restricted to tags used by `entries`
- Produces: collection `projects`; entry shape `{ id, data, body }`; `data` fields: `title`, `summary`, `course?`, `team_size` (int ≥1, default 1), `role?` (required when `team_size > 1`), `period`, `tags` (≥1, values from `TAG_ORDER`), `stack` (string[], default []), `metrics` (≤3 of `{value, label}`, default []), `links` (`{demo?, github?, diagram?}` URLs, default {}), `code_public` (default true), `cover?` (site path), `featured` (default false), `order` (default 100).

- [ ] **Step 1: Write failing tests** in `tests/projects.test.js` (entries are plain objects `{ id, data, body }`)

```js
const p = (id, data, body = '') => ({ id, body, data: { title: id, team_size: 1, tags: ['Cloud'], links: {}, code_public: true, featured: false, order: 100, ...data } });
test('teamLabel and kicker', () => {
  assert.equal(teamLabel({ team_size: 1 }), 'Solo');
  assert.equal(kicker({ course: 'FIT5120', team_size: 5 }), 'FIT5120 · Team of 5');
  assert.equal(kicker({ team_size: 1 }), 'Solo');
});
test('featured first by order, others exclude featured', () => {
  const list = [p('c', { featured: true, order: 3 }), p('a', { featured: true, order: 1 }), p('x', { order: 20 }), p('w', { order: 10 })];
  assert.deepEqual(featuredProjects(list).map(e => e.id), ['a', 'c']);
  assert.deepEqual(otherProjects(list).map(e => e.id), ['w', 'x']);
});
test('detail page only with a body', () => {
  assert.equal(hasDetailPage(p('a', {}, '## The problem\nText')), true);
  assert.equal(hasDetailPage(p('b', {}, '  \n ')), false);
});
test('private code hides the repo link only', () => {
  assert.deepEqual(visibleLinks({ code_public: false, links: { github: 'https://g', demo: 'https://d' } }), { demo: 'https://d' });
  assert.deepEqual(visibleLinks({ code_public: true, links: { github: 'https://g' } }), { github: 'https://g' });
});
test('filter tags keep canonical order', () => {
  assert.deepEqual(filterTags([p('a', { tags: ['Planning', 'Cloud'] }), p('b', { tags: ['Cloud'] })]), ['Cloud', 'Planning']);
});
```

- [ ] **Step 2: Run `node --test tests/projects.test.js`** — Expected: FAIL (module not found).
- [ ] **Step 3: Implement `src/lib/projects.js`** to the signatures above.
- [ ] **Step 4: Implement `src/content.config.ts`** with `defineCollection` + `glob({ base: './src/content/projects', pattern: '*.md' })` + `z` from `astro/zod`, fields as in Interfaces, `tags` as `z.array(z.enum(TAG_ORDER)).min(1)`, and `.refine(d => d.team_size === 1 || !!d.role, 'team projects need a role')`. Create an empty `src/content/projects/.gitkeep` so the build has the folder.
- [ ] **Step 5: Run `npm test`** — Expected: PASS.
- [ ] **Step 6: Commit** — `git commit -m "feat: project content schema and helpers"`

---

### Task 3: Project content and images

**Files:**
- Create: `src/content/projects/{wildlens,firebreak,cloudeco,aussie-ecolens,too-many-chefs,piglet}.md`
- Create: `public/projects/wildlens.jpg`, `public/projects/firebreak.jpg`, `public/projects/cloudeco.png`
- Test: the schema itself (the build fails on any invalid file)

**Interfaces:**
- Consumes: the schema from Task 2.
- Produces: six entries; ids are the file names above. Featured order: `wildlens` 1, `firebreak` 2, `cloudeco` 3.

Frontmatter (exact values; re-check each number against its source before writing):

| id | title | course | team_size / role | period | tags | metrics (value — label) | links | code_public | cover | featured/order |
|---|---|---|---|---|---|---|---|---|---|---|
| wildlens | WildLens | — | 1 | Sep–Nov 2026 | Cloud, AI/ML | `~$4` — worst-case cost (was ~$80); `100%` — Terraform; `13` — pipeline stages | demo `https://d1y0xvoewbydft.cloudfront.net`, github `https://github.com/mingjun6886/wildlens`, diagram `https://mingjun6886.github.io/wildlens/diagrams/pipeline.html` | true | `/projects/wildlens.jpg` | true / 1 |
| firebreak | FIREBREAK | FIT5120 | 5 / Frontend, UI/UX, backend and the voice assistant | Aug–Oct 2026 | Web, AI/ML | `128` — of 301 commits (top); `3` — live iterations; `Live` — cubesix.me | demo `https://cubesix.me`, github `https://github.com/zhan0042-gif/FIT5120-Assignment-TP03` | true | `/projects/firebreak.jpg` | true / 2 |
| cloudeco | CloudEco | FIT5225 | 1 | 2026 | Cloud, AI/ML | `99%` — scaling efficiency, 1→2 pods; `2.0 req/s` — throughput at 8 pods; `1→8` — pods load-tested | github `https://github.com/mingjun6886/cloudeco-wildlife-inference` | true | `/projects/cloudeco.png` | true / 3 |
| aussie-ecolens | Aussie EcoLens | FIT5225 | 4 / Auth, cloud foundation and data management (Member A) | May–Jun 2026 | Cloud | — | — | false | — | false / 10 |
| too-many-chefs | Too Many Chefs | FIT5222 | 1 | Oct–Nov 2026 | Planning, AI/ML | — | — | false | — | false / 20 |
| piglet | Piglet path-finding | FIT5222 | 1 | Jul–Sep 2026 | Planning | — | — | false | — | false / 21 |

Summaries: WildLens "Camera-trap photos and clips, tagged with species by a two-stage ML pipeline and searchable through a secured API."; FIREBREAK "A household bushfire-preparedness app with a voice assistant. Vue 3 + FastAPI, shipped in three assessed iterations."; CloudEco "YOLOv8 wildlife-detection API on a self-built 3-node Kubernetes cluster on Oracle Cloud."; Aussie EcoLens "Multi-cloud serverless wildlife observation platform."; Too Many Chefs "PDDL planning controller for an Overcooked-style kitchen."; Piglet "Search algorithms for grid path-finding." `stack` lists come from each README's architecture section.

Bodies (`##` sections in this order: `The problem`, `What I built`, `Architecture`, `Results`, `What I learned`; omit a section that has no sourced content):
- wildlens: from `~/Projects/wildlens/README.md` ("What makes this more than a demo", "Measured results" table, link to the walkthrough under Architecture). What I learned (draft for Quan): the README's point that a cache cannot help the invocation that populates it.
- firebreak: from `~/FIT5120-Assignment-TP03/README.md` (architecture text block, deployed iterations) and `git log origin/main` for the voice assistant (`backend/app/services/voice_actions.py`, PR #72). Say plainly the team had five members and what Quan did. What I learned (draft): giving the model a closed list of actions and an evaluation set (`backend/scripts/evaluate_voice_actions.py`) made voice control safe to ship.
- cloudeco: from its README (architecture block, load-test table). What I learned (draft): count physical cores, not vCPUs.
- aussie-ecolens: no body (tile only).
- too-many-chefs, piglet: short write-ups (`The problem`, `What I built`) at concept level only: no pseudo-code, no scores, no code links.

- [ ] **Step 1: Re-verify the two moving numbers.** Run `git -C ~/FIT5120-Assignment-TP03 fetch -q && git -C ~/FIT5120-Assignment-TP03 shortlog -sne origin/main | head -3` and `git -C ~/FIT5120-Assignment-TP03 rev-list --count origin/main`. Use the results for the FIREBREAK commit metric (top author must still be `mingjun6886`; otherwise drop the metric and tell Quan).
- [ ] **Step 2: Write the six markdown files.** Check: Aussie EcoLens has no body; FIT5222 bodies have no code, scores or links.
- [ ] **Step 3: Make images** (≤1200 px wide, JPEG quality 80 unless noted):
  - wildlens: `sips -s format png ~/Projects/wildlens/docs/media/demo.gif --out /tmp/wl.png` (first frame), then `sips -Z 1200 -s format jpeg -s formatOptions 80 /tmp/wl.png --out public/projects/wildlens.jpg`.
  - firebreak: headless Chrome `--window-size=1280,800 --screenshot` of `https://cubesix.me`, then the same `sips` resize to JPEG.
  - cloudeco: `sips -Z 1200` of `results/yolov8l/plots/plot2_pods_vs_throughput.png` from the CloudEco repo into `public/projects/cloudeco.png`.
- [ ] **Step 4: Run `npm test`** — Expected: build succeeds (schema accepts all six files) and existing tests still PASS.
- [ ] **Step 5: Commit** — `git commit -m "content: six projects with covers"`

---

### Task 4: Homepage

**Files:**
- Create: `src/components/Nav.astro`, `Hero.astro`, `FeaturedProject.astro`, `ProjectGrid.astro`, `About.astro`, `Contact.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/build.test.js` (add)

**Interfaces:**
- Consumes: `site` (Task 1); helpers and collection (Task 2); entries (Task 3).
- Produces: `Contact.astro` (no props; reused by Task 5). Section anchors `#work`, `#coursework`, `#about`, `#contact`. Nav labels exactly: `Work`, `Coursework`, `About`, `CV ↓` (CV links to `site.cv`).

Layout follows the mockup `.B` block. Hero: 150 px round photo (or an initials disc "MQ" when `site.photo` is null) left; right: `<h1>` = greeting + `<em>` tagline (accent, italic serif); intro paragraph; facts line (location · university · degree · "Available {available}" · workRights only when non-null); buttons `Download CV` (`.btn`, `href={site.cv}`, `download`), `GitHub`, `LinkedIn`, and a `<button>` "Copy email". Copy script: `navigator.clipboard.writeText(email)` → label "Copied" for 2 s; on rejection or missing API, set the label to the email address itself. FeaturedProject alternates image side (odd index reversed); shows kicker, serif title, summary, up to 3 metrics (big value + small label), "Read case study →" when `hasDetailPage`, "Live demo ↗" when `links.demo`. ProjectGrid: filter `<button aria-pressed>` chips "All" + `filterTags(others)`, tiles show `kicker`, title, summary, `data-tags`, and link to `/projects/<id>/` only when `hasDetailPage`; a small inline script toggles `tile.hidden`. About: heading "Experience & education" when `experience` is non-empty, else "Education"; lists entries as year / place — role · detail. Contact: serif "Let's talk.", then `<a href="mailto:…">email</a> · GitHub · LinkedIn · location`.

- [ ] **Step 1: Write failing tests**

```js
test('three featured projects in order', () => {
  const html = readDist('index.html');
  const pos = ['WildLens', 'FIREBREAK', 'CloudEco'].map(t => html.indexOf(t));
  assert.ok(pos.every(i => i > 0) && pos[0] < pos[1] && pos[1] < pos[2]);
});
test('hero shows photo or initials, intro and actions', () => {
  const html = readDist('index.html');
  assert.match(html, /Hi, I&#39;m Quan\.|Hi, I'm Quan\./);
  assert.match(html, /cloud and ML engineer/);
  assert.match(html, /<a(?=[^>]*href="\/cv\.pdf")(?=[^>]*\bdownload\b)[^>]*>/);
  assert.match(html, /href="https:\/\/github\.com\/mingjun6886"/);
  assert.match(html, /class="[^"]*initials/);           // photo is null in config
  assert.doesNotMatch(html, /Work rights/i);            // workRights is null
});
test('contact keeps a mailto fallback', () => {
  assert.match(readDist('index.html'), /href="mailto:minhquan\.nguyen1202@gmail\.com"/);
});
test('grid: filters, tiles, links follow content', () => {
  const html = readDist('index.html');
  assert.match(html, /aria-pressed="true"[^>]*>All</);
  for (const t of ['Cloud', 'AI/ML', 'Planning']) assert.match(html, new RegExp(`aria-pressed="false"[^>]*>${t.replace('/', '\\/')}<`));
  assert.match(html, /href="\/projects\/too-many-chefs\/"/);
  assert.doesNotMatch(html, /href="\/projects\/aussie-ecolens\/"/);   // no body → no page
});
test('no tile is hidden in static HTML', () => {
  assert.doesNotMatch(readDist('index.html'), /data-tags="[^"]*"[^>]*\shidden/);
});
test('private repos are never linked', () => {
  const html = readDist('index.html');
  for (const bad of ['fit5222-student-repositories', 'too-many-chefs-mquannguyen', 'FIT5225_Assignment2_Group132']) assert.ok(!html.includes(bad), bad);
});
```

- [ ] **Step 2: Run `npm test`** — Expected: FAIL on the new tests.
- [ ] **Step 3: Implement the six components and compose `index.astro`** (Nav, Hero, `#work` featured list, `#coursework` grid, `#about`, `#contact`).
- [ ] **Step 4: Run `npm test`** — Expected: all PASS.
- [ ] **Step 5: Look at it.** `npm run preview`, headless Chrome screenshot at 1280×2400; compare with the mockup's `.B` block (spacing, serif headings, accent tagline).
- [ ] **Step 6: Commit** — `git commit -m "feat: homepage sections"`

---

### Task 5: Project detail pages

**Files:**
- Create: `src/pages/projects/[id].astro`
- Test: `tests/build.test.js` (add)

**Interfaces:**
- Consumes: `hasDetailPage`, `kicker`, `visibleLinks` (Task 2); `Contact.astro` (Task 4); `Base.astro` with `image` = entry `cover` when present.
- Produces: one page per entry with a body at `/projects/<id>/`.

Page: "← All work" (to `/#work`), kicker + period, serif `<h1>` title, summary, link buttons from `visibleLinks` (`Live demo ↗` primary, `GitHub`, `Architecture walkthrough`), cover `<img>` with `alt="<title> screenshot"` and explicit width/height only when `cover` is set, metrics row only when metrics exist, a facts list (Role when `team_size > 1`, Stack, Period), then `<Content />` with serif `h2`s, then `Contact`.

- [ ] **Step 1: Write failing tests**

```js
test('detail pages exist only for entries with a body', () => {
  for (const id of ['wildlens', 'firebreak', 'cloudeco', 'too-many-chefs', 'piglet']) assert.ok(distExists(`projects/${id}/index.html`), id);
  assert.equal(distExists('projects/aussie-ecolens/index.html'), false);
});
test('team project states size and role', () => {
  const html = readDist('projects/firebreak/index.html');
  assert.match(html, /Team of 5/);
  assert.match(html, /voice assistant/i);
});
test('bare project renders without empty boxes', () => {
  const html = readDist('projects/too-many-chefs/index.html');
  assert.doesNotMatch(html, /<img(?![^>]*src="[^"]+")/);
  assert.doesNotMatch(html, /class="metrics"/);
  assert.doesNotMatch(html, /github\.com\/[^"\/]+\/[^"]+/);   // no repo link; the profile link in Contact is fine
});
test('wildlens links its live demo and walkthrough', () => {
  const html = readDist('projects/wildlens/index.html');
  assert.match(html, /d1y0xvoewbydft\.cloudfront\.net/);
  assert.match(html, /diagrams\/pipeline\.html/);
});
```

- [ ] **Step 2: Run `npm test`** — Expected: FAIL.
- [ ] **Step 3: Implement `[id].astro`** with `getStaticPaths` over `(await getCollection('projects')).filter(hasDetailPage)`, `params: { id: entry.id }`, and `render(entry)`.
- [ ] **Step 4: Run `npm test`** — Expected: PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: project case-study pages"`

---

### Task 6: Mobile layout, share image, pre-deploy checks, handover notes

**Files:**
- Modify: `src/styles/global.css`, component `<style>` blocks, `tests/dist.js` (add `cssFileFor(htmlRel: string): string`, the dist path of the first `<link rel="stylesheet">` in that page)
- Create: `public/og.png`, `scripts/predeploy.mjs`, `tests/predeploy.test.js`, `README.md`
- Test: `tests/build.test.js` (add)

**Interfaces:**
- Produces: `scripts/predeploy.mjs` exporting `findPlaceholders(html: string) -> string[]` (matches of `TODO(Quan)…` up to the next `<` or `"`, plus `todo-quan`) and `extractRefs(html: string) -> string[]` (all `href`/`src` values); running the file walks `dist/`, checks every internal ref exists in `dist/` (skip `/_vercel/`), fetches every external `http(s)` ref (HEAD then GET fallback, 10 s timeout, status < 400), ignores `mailto:`, prints a grouped report and exits 1 on any placeholder, missing file or bad link.

- [ ] **Step 1: Write failing tests**

```js
// tests/predeploy.test.js
test('finds placeholders', () => {
  assert.deepEqual(findPlaceholders('<p>TODO(Quan): degree name</p><a href="https://todo-quan.vercel.app">'), ['TODO(Quan): degree name', 'todo-quan']);
  assert.deepEqual(findPlaceholders('<p>done</p>'), []);
});
test('extracts refs', () => {
  assert.deepEqual(extractRefs('<a href="/cv.pdf"></a><img src="/p.jpg">'), ['/cv.pdf', '/p.jpg']);
});
// tests/build.test.js
test('layout is mobile-safe', () => {
  const css = readDist(cssFileFor('index.html'));
  assert.match(css, /@media \(max-width:\s*720px\)/);
  assert.match(css, /overflow-wrap:\s*anywhere/);
});
```

- [ ] **Step 2: Run `npm test`** — Expected: FAIL.
- [ ] **Step 3: Implement mobile CSS** (below 720 px: hero becomes one column with the photo above, featured rows and grids become one column, buttons wrap, `overflow-wrap: anywhere` on the email) and `scripts/predeploy.mjs`.
- [ ] **Step 4: Run `npm test`** — Expected: PASS.
- [ ] **Step 5: Share image.** `npm run preview`, headless Chrome `--window-size=1200,630 --screenshot=public/og.png http://localhost:4321/`. Rebuild.
- [ ] **Step 6: Lighthouse (mobile).** `npx lighthouse@$(npm view lighthouse version) http://localhost:4321/ --form-factor=mobile --only-categories=performance,accessibility --output=json --quiet --chrome-flags=--headless` and the same for `/projects/wildlens/`. Expected: both scores ≥ 95. Fix and re-run if not.
- [ ] **Step 7: Run `npm run predeploy`** — Expected: FAIL listing exactly the `TODO(Quan)` placeholders, `todo-quan`, and missing `/cv.pdf`. This is the hand-over list; any other failure (dead external link, missing image) gets fixed now.
- [ ] **Step 8: Write `README.md`** (English, short): run locally; add a project = copy a file in `src/content/projects/`, fill the frontmatter table, set `featured: true` to promote it; personal details live in `src/site.config.js`; before deploying run `npm run predeploy` until clean; deployment is Vercel importing the GitHub repo (Astro preset, no settings).
- [ ] **Step 9: Commit** — `git commit -m "feat: mobile layout, share image and pre-deploy checks"`

---

## After the plan (not tasks)

Hand Quan: screenshots (desktop + 390 px phone) of the homepage and one case study, the `npm run predeploy` list of what he must supply, the three "What I learned" drafts to confirm, the Macquarie units left out until he describes them (spec §8), and the open GitHub items from spec §12. Pushing to GitHub and connecting Vercel wait for his go-ahead.
