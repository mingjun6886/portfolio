---
title: WildLens
summary: Camera-trap photos and clips, tagged with species by a two-stage ML pipeline and searchable through a secured API.
team_size: 1
period: Sep–Nov 2026
tags: [Cloud, AI/ML]
stack: [AWS, Terraform, Lambda (container), S3, SQS, Cognito, MegaDetector, SpeciesNet, GitHub Actions]
metrics:
  - { value: "~$4", label: "worst-case cost, vs ~$80 without the queue" }
  - { value: "100%", label: "Terraform" }
  - { value: "13", label: "pipeline stages" }
links:
  demo: https://d1y0xvoewbydft.cloudfront.net
  github: https://github.com/mingjun6886/wildlens
  diagram: https://mingjun6886.github.io/wildlens/diagrams/pipeline.html
code_public: true
cover: /projects/wildlens.jpg
featured: true
order: 1
---
## The problem

Camera-trap photos and video clips are only useful once someone knows which species are in them. Tagging by hand does not scale, and a naive cloud pipeline can run up a large bill the first time someone uploads a thousand files.

## What I built

A serverless platform on AWS, solo. Browsers upload straight to S3 through a presigned URL. S3 events land in SQS rather than invoking Lambda directly, and a container Lambda runs MegaDetector and then a species classifier. Results are tags with counts, such as `{"southern cassowary": 1}`, searchable by species, by minimum counts, or by example photo through a Cognito-protected REST API. Users can subscribe to email alerts per species.

- **Cost-bounded ingest.** The queue caps the tagger at two concurrent executions and sends a message to a dead-letter queue after three attempts. A runaway upload burst costs a few dollars instead of about $80.
- **Infrastructure as code.** Every resource is in Terraform, thirteen modules in one environment, so `terraform destroy` removes the whole estate between sessions.
- **No long-lived secrets in CI.** GitHub Actions lints, tests, builds and validates Terraform without credentials; pull requests that touch infrastructure get a `terraform plan` through a read-only OIDC role.
- **Operable.** Structured logs with a correlation ID, metrics, X-Ray tracing, a dashboard, five kinds of alarm and a runbook organised by symptom.

## Architecture

The full ingest path is on an [interactive walkthrough](https://mingjun6886.github.io/wildlens/diagrams/pipeline.html): browser, S3, SQS with a dead-letter queue, the container Lambda running both models, and the API behind Cognito.

## Results

Cold-start and warm latency were measured before and after one optimisation: caching the loaded MegaDetector model instead of a path to its weights.

| | Before | After | Change |
|---|---|---|---|
| First invocation after deploy | 55.2 s | 42.3 s | −23% |
| Cold start, p50 | 23.6 s | 21.5 s | −9% |
| Warm | 8.35 s | 6.40 s | −23% |
| Peak memory | 3000 MB | 2861 MB | −139 MB |

## What I learned

A cache cannot help the invocation that populates it. The change moved a per-request cost to a per-environment one, so warm calls gained a lot and cold starts barely moved. Re-measuring also showed that a mis-read log line had overstated the expected cold-start saving tenfold, so I recorded the correction instead of quietly fixing it.
