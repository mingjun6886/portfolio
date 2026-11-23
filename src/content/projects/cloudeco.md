---
title: CloudEco
summary: YOLOv8 wildlife-detection API on a self-built 3-node Kubernetes cluster on Oracle Cloud.
course: FIT5225
team_size: 1
period: "2026"
tags: [Cloud, AI/ML]
stack: [FastAPI, ONNX Runtime, YOLOv8, Docker, Kubernetes (kubeadm), Oracle Cloud, Terraform, Locust]
metrics:
  - { value: "99%", label: "scaling efficiency, 1→2 pods" }
  - { value: "2.0 req/s", label: "throughput at the top step" }
  - { value: "1→6", label: "pods running (8 requested)" }
links:
  github: https://github.com/mingjun6886/cloudeco-wildlife-inference
code_public: true
cover: /projects/cloudeco.png
featured: true
order: 3
---
## The problem

Serve an object-detection model behind a REST API and find out, with measurements, how far adding replicas actually scales it.

## What I built

A FastAPI service that detects elephants, buffalo, rhinos and zebras in images with YOLOv8 exported to ONNX, containerised with Docker and run on a three-node kubeadm cluster (one master, two workers) provisioned on Oracle Cloud. Traffic enters through a network load balancer to a NodePort. Each pod is capped at 1 vCPU and 2 GB, and the executor is deliberately single-threaded because inference is CPU-bound.

## Architecture

```text
Client -> OCI Network Load Balancer -> NodePort :30080
       -> Kubernetes (kubeadm + Flannel), 1 master + 2 workers
       -> wildlife-yolo pods, 1 vCPU / 2 GB each
```

## Results

Load was scaled with the deployment for two minutes per configuration, with a 3:1 mix of predict to annotate requests.

| Replicas requested | Users | Throughput (req/s) | p95 | Failures | Scaling efficiency |
|-----:|------:|-------------------:|----:|---------:|-------------------:|
| 1 | 5 | 0.63 | 8.5 s | 0 | — |
| 2 | 10 | 1.24 | 9.5 s | 0 | 99% |
| 4 | 20 | 1.76 | 15 s | 0 | 70% |
| 8 | 25 | 2.00 | 23 s | 3 | 40% |

The results chart footnotes that at the top step only 6 of the 8 requested replicas were scheduled, because of node capacity. The cluster has since been torn down, so there is no live endpoint.

## What I learned

Scaling was close to linear up to two pods and then bent exactly where the physical cores ran out: the cloud reported 4 vCPUs per worker, but that is 2 hyper-threaded cores. Capacity planning for this kind of workload should count physical cores, not vCPUs. The high latency was queueing behind a single-threaded executor, not slow inference, so throughput is the meaningful measure.
