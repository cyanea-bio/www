+++
title = "GPU Parallel Patterns"
description = "Visualize GPU compute patterns for bioinformatics workloads. Compare CPU vs. GPU execution for k-mer counting, pairwise alignment, and matrix operations."
weight = 10
template = "learn-page.html"

[extra]
difficulty = "Advanced"
difficulty_level = "advanced"
duration = "~30 min"
domain = "HPC"
crates = ["cyanea-gpu"]
papers = 5
badge = "Interactive"
badge_extra = "New"
preview_label = "Compute shader pipeline"
tags = ["HPC", "WebGPU"]
+++

## Why GPUs for Bioinformatics?

A modern GPU has thousands of cores designed to execute the same operation across massive datasets in parallel. Many bioinformatics workloads — pairwise alignment, k-mer counting, distance matrix computation, molecular dynamics — are embarrassingly parallel: the same function is applied independently to millions of data elements. Moving these workloads to the GPU can deliver 10–100× speedups over optimised CPU code.

This simulation lets you visualise how parallel execution patterns map to GPU hardware, using WebGPU compute shaders running directly in your browser.

## What You'll Explore

- **Map pattern.** The simplest GPU pattern: apply a function to every element of an array independently. Watch thousands of threads launch in parallel to complement a DNA sequence, translate codons, or compute per-base quality statistics. Compare the GPU's throughput to a sequential CPU loop.
- **Reduce pattern.** Combine all elements of an array into a single value — a sum, a maximum, or a histogram. GPU reductions use a tree-based approach: each thread combines two elements, then half the threads combine those results, and so on until a single value remains. Visualise the reduction tree for counting k-mer occurrences.
- **Scatter/Gather pattern.** Each thread reads from one location and writes to another. This pattern appears in sorting, histogram building, and hash table construction. Watch how atomic operations prevent race conditions when multiple threads write to the same memory location.
- **Stencil pattern.** Each output element depends on a fixed neighborhood of input elements. This is the pattern behind image convolution, Smith-Waterman alignment (where each cell depends on three neighbors), and molecular dynamics force calculations.

## Key Concepts

### GPU Architecture

A GPU organises threads into a hierarchy:

- **Threads** are the smallest unit of execution. Each runs the same program (the compute shader) but on different data.
- **Workgroups** (CUDA: thread blocks) are groups of threads that can share fast on-chip memory and synchronise with each other. A typical workgroup has 64–256 threads.
- **Dispatches** (CUDA: grids) are the total set of workgroups launched by a single compute call.

Threads within a workgroup execute in lockstep in groups of 32 (NVIDIA: warps) or 64 (AMD: wavefronts). Divergent branching — where threads in the same warp take different paths — reduces efficiency because both paths must be executed.

### Memory Hierarchy

GPU memory is organised in layers of decreasing size and increasing speed:

- **Global memory** (VRAM) — large (8–80 GB), high bandwidth (1–3 TB/s), but high latency (~400 cycles).
- **Shared memory** — small (48–128 KB per workgroup), very fast (~1 cycle), used for inter-thread communication within a workgroup.
- **Registers** — per-thread, fastest, but limited (typically 64–256 per thread).

Efficient GPU code maximises data reuse in shared memory and registers, minimises global memory accesses, and ensures those accesses are coalesced (adjacent threads read adjacent memory addresses).

### WebGPU and Compute Shaders

WebGPU is the modern browser API for GPU compute and graphics. Unlike WebGL, it exposes general-purpose compute shaders written in WGSL (WebGPU Shading Language). A compute shader is a small program that runs on the GPU — it reads input buffers, performs computation, and writes to output buffers. WebGPU handles dispatching workgroups, synchronising memory, and transferring data between CPU and GPU.

### Bioinformatics on the GPU

Real-world GPU-accelerated bioinformatics tools include:

- **CUDASW++** — GPU-accelerated Smith-Waterman alignment.
- **Gkounts** — GPU k-mer counting.
- **RAPIDS cuML** — GPU-accelerated machine learning (PCA, UMAP, k-means) widely used in single-cell genomics via rapids-singlecell.
- **OpenMM** — GPU-accelerated molecular dynamics for protein simulations.

The main challenge is data transfer: moving sequences from CPU to GPU and results back can dominate runtime for small inputs. GPU acceleration pays off when the computation-to-transfer ratio is high.

## Background Reading

1. Kirk, D. B. & Hwu, W. W. (2016). *Programming Massively Parallel Processors: A Hands-on Approach* (3rd ed.). Morgan Kaufmann.
2. Houtgast, E. J. et al. (2018). Hardware acceleration of BWA-MEM genomic short read mapping for longer read lengths. *Computational Biology and Chemistry*, 75, 54–64.
3. Liu, Y., Wirawan, A. & Schmidt, B. (2013). CUDASW++ 3.0: accelerating Smith-Waterman protein database search by coupling CPU and GPU SIMD instructions. *BMC Bioinformatics*, 14, 117.
4. Zheng, G. X. Y. et al. (2017). Massively parallel digital transcriptional profiling of single cells. *Nature Communications*, 8, 14049.
5. W3C WebGPU Working Group (2025). WebGPU Specification. W3C Working Draft.
