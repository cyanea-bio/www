+++
title = "cyanea-omics"
description = "Multi-omics analysis — genomic intervals, copy-number segmentation, CpG island detection, methylation analysis, and spatial autocorrelation."
weight = 5

[extra]
version = "0.2.1"
layer = "Analysis"
badge = "new"
tagline = "Interval arithmetic and multi-omics analysis at scale."
wasm_module = "cyanea_wasm"
has_playground = true
license = "Apache-2.0"
source_url = "https://github.com/cyanea-bio/labs/tree/main/cyanea-omics"
registry_url = "https://crates.io/crates/cyanea-omics"
registry_name = "crates.io"
depends_on = ["cyanea-core", "cyanea-seq", "cyanea-io", "cyanea-align"]
depended_by = ["cyanea-wasm"]
tags = ["Omics", "Intervals", "CNV", "Methylation", "Spatial"]
functions = [
    { name = "merge_intervals", sig = "(json: &str) -> JSON", desc = "Merge overlapping genomic intervals" },
    { name = "intersect_intervals", sig = "(a, b: &str) -> JSON", desc = "Find intersection of two interval sets" },
    { name = "subtract_intervals", sig = "(a, b: &str) -> JSON", desc = "Subtract interval set B from A" },
    { name = "jaccard_intervals", sig = "(a, b: &str) -> f64", desc = "Jaccard similarity between interval sets" },
    { name = "make_windows", sig = "(genome, window_size) -> JSON", desc = "Tile a genome into fixed-size windows" },
    { name = "cbs_segment", sig = "(pos, vals, chrom, alpha, min) -> JSON", desc = "Circular binary segmentation for CNV detection" },
    { name = "find_cpg_islands", sig = "(seq, chrom) -> JSON", desc = "Detect CpG islands in a DNA sequence" },
    { name = "morans_i", sig = "(values, neighbors) -> JSON", desc = "Moran's I spatial autocorrelation statistic" },
]
+++

## Overview

`cyanea-omics` provides two broad capabilities: genomic interval arithmetic (merge, intersect, subtract, window, Jaccard) and multi-omics analysis routines (copy-number segmentation, CpG island detection, spatial autocorrelation).

Interval operations follow the BEDTools convention — zero-based, half-open coordinates, sorted by chromosome and position. They are the building blocks for coverage analysis, peak calling, and variant filtration.

## Key Concepts

### Interval Arithmetic

Genomic analyses constantly manipulate intervals: "which peaks overlap my gene list?", "subtract blacklist regions from my ChIP-seq peaks", "what fraction of two peak sets overlap?" The five core operations — merge, intersect, subtract, closest, and Jaccard — answer these questions efficiently.

### Circular Binary Segmentation (CBS)

CBS is the standard algorithm for detecting copy-number alterations from array or sequencing data. It finds breakpoints in a signal by recursively testing whether splitting a segment produces two subsegments with significantly different means. The `alpha` parameter controls the significance threshold.

### CpG Islands

CpG islands are regions of elevated CG dinucleotide frequency, typically found near gene promoters. `find_cpg_islands` scans a sequence for regions meeting the Gardiner-Garden & Frommer criteria (length ≥ 200 bp, GC ≥ 50%, observed/expected CpG ≥ 0.6).

### Spatial Autocorrelation

Moran's I measures whether values at nearby locations tend to be similar (positive autocorrelation) or dissimilar (negative). It is used in spatial transcriptomics to identify genes whose expression varies spatially across a tissue section.

## Code Examples

### Rust

```rust
use cyanea_omics::{merge_intervals, cbs_segment, Interval};

let merged = merge_intervals(&intervals);
let segments = cbs_segment(&positions, &log2ratios, "chr1", 0.01, 5);
```

### Python

```python
import cyanea

merged = cyanea.merge_intervals([
    {"chrom": "chr1", "start": 100, "end": 200},
    {"chrom": "chr1", "start": 150, "end": 300},
])
```

### JavaScript (WASM)

```javascript
import { merge_intervals, cbs_segment, find_cpg_islands } from '/wasm/cyanea_wasm.js';

const merged = JSON.parse(merge_intervals(JSON.stringify(intervals)));
const islands = JSON.parse(find_cpg_islands(dnaSequence, "chr1"));
```

## Use Cases

- **ChIP-seq analysis** — Intersect peak calls with gene promoters.
- **CNV calling** — Segment log2-ratio arrays to detect amplifications and deletions.
- **Epigenomics** — Map CpG islands and correlate with methylation profiles.
- **Spatial transcriptomics** — Identify spatially variable genes with Moran's I.
