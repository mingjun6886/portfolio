---
title: FIREBREAK
summary: A household bushfire-preparedness app with a voice assistant. Vue 3 + FastAPI, shipped in three assessed iterations.
course: FIT5120
team_size: 5
role: Frontend, UI/UX, backend and the voice assistant
period: Aug–Oct 2026
tags: [Web, AI/ML]
stack: [Vue 3, Vite, FastAPI, Pydantic, MySQL, OpenAI, TomTom Orbis, BOM data]
metrics:
  - { value: "128", label: "of 308 commits (top)" }
  - { value: "3", label: "assessed iterations" }
  - { value: "5", label: "team members" }
links:
  github: https://github.com/zhan0042-gif/FIT5120-Assignment-TP03
code_public: true
cover: /projects/firebreak.jpg
featured: true
order: 2
---
## The problem

Households in bushfire-prone areas are told to have a plan, but most never write one down. FIREBREAK lets a household build and save a plan one question at a time, check how complete it is, see local fire and weather context, and test the plan against a meet-up scenario.

## What I built

This was a team of five, built over three assessed iterations. I worked across the frontend, UI/UX and backend, and built the voice assistant. I made 128 of the repository's 308 commits, the most of any member.

The app is a Vue 3 + Vite frontend over a FastAPI backend with MySQL, using TomTom Orbis for addresses and Bureau of Meteorology data for current conditions and fire danger.

**Voice assistant.** A person can talk to the app while their hands are busy. The model does not run the app: it picks one action from a closed list, and the browser handlers can only navigate, read, or run the meet-up check, and never edit the plan. A koala character in the corner is the voice button, and its face shows whether it is listening or talking.

## Architecture

```text
Vue 3 + Vite frontend
  -> HTTP JSON API (/api/v1)
  -> FastAPI routes -> Pydantic schemas -> services
  -> MySQL repositories -> providers (TomTom, BOM, spatial open data)
```

## Results

Each iteration was frozen as it was assessed, with later work continuing on the main build. The deployed site sits behind a password for the unit, so there is no public demo; the code is public.

## What I learned

Letting a language model choose from a fixed list of actions, and checking that list against an evaluation set whenever the prompt or the actions change, is what made voice control safe enough to ship.
