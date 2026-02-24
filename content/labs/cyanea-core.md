+++
title = "cyanea-core"
description = "Foundation types and traits shared across the Cyanea ecosystem. Alphabets, coordinate systems, error types, hashing, compression, and memory-efficient collections."
weight = 1

[extra]
version = "0.4.2"
layer = "Core"
badge = "popular"
tagline = "The foundation every Cyanea crate builds on."
wasm_module = "cyanea_wasm"
has_playground = true
license = "Apache-2.0"
source_url = "https://github.com/cyanea-bio/labs/tree/main/cyanea-core"
registry_url = "https://crates.io/crates/cyanea-core"
registry_name = "crates.io"
depends_on = []
depended_by = ["cyanea-seq", "cyanea-io", "cyanea-align", "cyanea-omics", "cyanea-stats", "cyanea-ml", "cyanea-chem", "cyanea-struct", "cyanea-phylo", "cyanea-gpu", "cyanea-wasm", "cyanea-py"]
tags = ["Foundation", "Types", "Hashing", "Compression"]
functions = [
    { name = "sha256", sig = "(data: &str) -> String", desc = "Compute SHA-256 hash of input data" },
    { name = "compress", sig = "(data: &str) -> String", desc = "Compress data using zstd" },
    { name = "decompress", sig = "(data: &str) -> String", desc = "Decompress zstd-compressed data" },
]
+++

## Overview

`cyanea-core` provides the shared foundation that every other crate in the ecosystem depends on. It defines the core type system — biological alphabets (DNA, RNA, amino acid), genomic coordinate types, strand enums, and a common error hierarchy — so that data flows cleanly between crates without conversion overhead.

Beyond types, it bundles essential utilities: SHA-256 hashing for data integrity, zstd compression for efficient storage and transfer, and memory-efficient bit-packed collections for working with large biological datasets.

## Key Concepts

### Alphabets and Encoding

Biological sequences are ultimately strings over small alphabets. `cyanea-core` defines `Alphabet` variants for DNA (A, C, G, T), RNA (A, C, G, U), amino acids (20 standard residues plus stop), and IUPAC ambiguity codes. These alphabets power validation, encoding, and 2-bit packing throughout the stack.

### Coordinate Systems

Genomic intervals are represented as zero-based, half-open `(chrom, start, end, strand)` tuples — the BED convention. This eliminates off-by-one errors when crates exchange interval data.

### Hashing and Compression

`sha256` provides fast, deterministic content hashing — useful for deduplication, caching, and verifying file integrity. `compress` / `decompress` wrap the zstd codec, giving 3–5x compression on typical bioinformatics text formats at interactive speeds.

## Code Examples

### Rust

```rust
use cyanea_core::{sha256, compress, decompress, Alphabet};

let hash = sha256(b"ATCGATCG");
let packed = compress(b"ATCGATCG...");
let original = decompress(&packed);
assert!(Alphabet::Dna.is_valid(b"ATCGATCG"));
```

### Python

```python
import cyanea

h = cyanea.sha256("ATCGATCG")
compressed = cyanea.compress("ATCGATCG" * 1000)
original = cyanea.decompress(compressed)
```

### JavaScript (WASM)

```javascript
import { sha256, compress, decompress } from '/wasm/cyanea_wasm.js';

const hash = sha256("ATCGATCG");
const packed = compress("ATCGATCG".repeat(1000));
const original = decompress(packed);
```

## Use Cases

- **Data integrity** — Hash FASTA/VCF files before and after transfer to verify nothing was corrupted.
- **Compact storage** — Compress intermediate analysis results for browser-side caching.
- **Type safety** — Use shared alphabet types to catch invalid sequences at parse time rather than deep inside an analysis pipeline.
