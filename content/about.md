+++
title = "About"
description = "Cyanea is an open-source, federated platform for bioinformatics."
template = "page.html"
+++

## Named After a Jellyfish

Cyanea takes its name from *Cyanea capillata*, the lion's mane jellyfish — one of the largest known organisms, with tentacles spanning over 30 meters. Like its namesake, Cyanea the platform is designed to extend its reach across a vast network while remaining a single, coherent organism.

## What We're Building

Cyanea is an open-source, federated platform for bioinformatics. Think of it as what you'd get if HuggingFace, protocols.io, and Galaxy had an open-source baby built with modern tools.

The platform lets researchers **share datasets**, **publish protocols**, and **run tools in the browser** — all connected through a federated network where each institution can host its own instance while remaining part of a larger community.

## How It's Built

The platform runs on **Elixir** (Phoenix/LiveView) for the web layer and real-time collaboration, with a **Rust** crate ecosystem for high-performance bioinformatics computation. Browser-based tools are powered by **WebAssembly**, so they run at near-native speed without uploading data to any server.

- **13 Rust crates** for sequence analysis, alignment, I/O, and more
- **Elixir/Phoenix** for the federated platform layer
- **WebAssembly** for client-side bioinformatics tools (Spaces)
- **ActivityPub** for cross-instance federation

## Our Values

**Open by default.** Code, data, and protocols are shared openly. The platform itself is open source under a permissive license.

**Federated, not centralized.** Your data stays on your servers. You choose what to share and with whom. No vendor lock-in.

**Community-driven.** Built by and for the bioinformatics community. Contributions are welcome — from bug reports to new crates.

**Performance matters.** Rust and WebAssembly aren't just buzzwords. They're the right tools for processing gigabytes of genomic data efficiently.
