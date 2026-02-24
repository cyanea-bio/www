+++
title = "cyanea-gpu"
description = "GPU-accelerated compute kernels via wgpu. Pairwise alignment, k-mer counting, and matrix operations on GPU hardware."
weight = 11

[extra]
version = "0.1.0"
layer = "Platform"
badge = "featured"
tagline = "Offload heavy computation to the GPU with WebGPU."
wasm_module = ""
has_playground = false
license = "Apache-2.0"
source_url = "https://github.com/cyanea-io/cyanea/tree/main/cyanea-gpu"
docs_url = "/docs"
registry_url = "https://crates.io"
registry_name = "crates.io"
depends_on = ["cyanea-core"]
depended_by = ["cyanea-wasm"]
tags = ["GPU", "WebGPU", "wgpu", "Acceleration", "Compute Shaders"]
functions = []
+++

## Overview

`cyanea-gpu` provides GPU-accelerated compute kernels for bioinformatics workloads that benefit from massive parallelism. It uses `wgpu` — a cross-platform GPU abstraction that works on Vulkan, Metal, DX12, and WebGPU — to dispatch compute shaders for pairwise alignment, k-mer counting, and matrix operations.

On a modern GPU, pairwise alignment of 10,000 × 10,000 short sequences completes in under a second — a 50–100x speedup over single-threaded CPU alignment.

## Key Concepts

### WebGPU and wgpu

WebGPU is the next-generation graphics and compute API for the web, replacing WebGL. `wgpu` is a Rust implementation that provides the same API on native platforms. `cyanea-gpu` writes compute shaders in WGSL (WebGPU Shading Language) and dispatches them through `wgpu`, achieving portability across desktop, server, and browser environments.

### Compute Shader Architecture

Each kernel is a WGSL compute shader that processes data in workgroups. For example, the pairwise alignment kernel assigns one workgroup per sequence pair and uses shared memory for the scoring matrix. The input sequences and output scores are passed via GPU buffers.

### Kernel Library

| Kernel | Description | Typical Speedup |
|--------|-------------|-----------------|
| `pairwise_align` | All-vs-all Smith-Waterman | 50–100x |
| `kmer_count` | Parallel k-mer frequency tables | 10–30x |
| `matmul` | Dense matrix multiplication | 20–50x |
| `distance_matrix` | Pairwise Euclidean/cosine distances | 30–60x |

### Integration

`cyanea-gpu` integrates transparently with the rest of the ecosystem. CPU-based crates (e.g., `cyanea-align`) fall back to GPU kernels when available, with zero API changes for the caller.

## Code Examples

### Rust

```rust
use cyanea_gpu::{GpuContext, pairwise_align};

let ctx = GpuContext::new().await?;
let scores = pairwise_align(&ctx, &queries, &targets, AlignMode::Local).await?;
```

### Python

```python
import cyanea

ctx = cyanea.GpuContext()
scores = ctx.pairwise_align(queries, targets, mode="local")
```

## Requirements

- A GPU with Vulkan 1.2, Metal 3, or DX12 support
- For browser use: Chrome 113+ or Firefox 121+ with WebGPU enabled
- `cyanea-gpu` is not included in the WASM playground because WebGPU support in WASM is still experimental

## Use Cases

- **Large-scale alignment** — Align millions of short reads against a panel of references.
- **Metagenomics** — Build k-mer frequency matrices for thousands of samples in seconds.
- **Single-cell analysis** — Accelerate distance matrix computation for clustering pipelines.
