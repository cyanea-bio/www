+++
title = "cyanea-align"
description = "Sequence alignment algorithms — Smith-Waterman, Needleman-Wunsch, banded alignment, progressive MSA, POA consensus, and CIGAR string manipulation."
weight = 4

[extra]
version = "0.2.4"
layer = "Analysis"
badge = "featured"
tagline = "Pairwise and multiple sequence alignment with full CIGAR support."
wasm_module = "cyanea_wasm"
has_playground = true
license = "Apache-2.0"
source_url = "https://github.com/cyanea-io/cyanea/tree/main/cyanea-align"
docs_url = "/docs"
registry_url = "https://crates.io"
registry_name = "crates.io"
depends_on = ["cyanea-core", "cyanea-seq", "cyanea-io"]
depended_by = ["cyanea-omics", "cyanea-wasm"]
tags = ["Alignment", "Smith-Waterman", "Needleman-Wunsch", "MSA", "CIGAR"]
functions = [
    { name = "align_dna_custom", sig = "(q, t, mode, m, mm, go, ge) -> JSON", desc = "Align two DNA sequences with custom scoring" },
    { name = "align_protein", sig = "(q, t, mode, matrix) -> JSON", desc = "Align protein sequences using substitution matrices" },
    { name = "align_banded", sig = "(q, t, mode, bw, m, mm, go, ge) -> JSON", desc = "Banded alignment for speed on long sequences" },
    { name = "progressive_msa", sig = "(seqs, m, mm, go, ge) -> JSON", desc = "Progressive multiple sequence alignment" },
    { name = "poa_consensus", sig = "(seqs: JSON) -> String", desc = "Partial-order alignment consensus sequence" },
    { name = "cigar_stats", sig = "(cigar: &str) -> JSON", desc = "Compute match/mismatch/indel counts from CIGAR" },
    { name = "parse_cigar", sig = "(cigar: &str) -> JSON", desc = "Parse CIGAR string into operations array" },
]
+++

## Overview

`cyanea-align` implements the classic dynamic-programming alignment algorithms and wraps them in a clean API that returns structured results with alignment strings, scores, and CIGAR representations.

It supports three modes — local (Smith-Waterman), global (Needleman-Wunsch), and semi-global — for both DNA and protein sequences. Banded alignment trades a small accuracy margin for dramatic speedups on long sequences. For multiple sequences, progressive MSA and partial-order alignment (POA) are available.

## Key Concepts

### Scoring Models

DNA alignment uses match/mismatch/gap-open/gap-extend parameters. Protein alignment uses substitution matrices (BLOSUM62, PAM250, etc.) that reflect evolutionary substitution rates between amino acid pairs.

### Banded Alignment

Full dynamic programming is O(mn) in time and space. Banded alignment restricts computation to a diagonal band of width 2k+1, reducing cost to O(k·max(m,n)). This is appropriate when you expect the alignment to be roughly diagonal — which is the common case for similar sequences.

### CIGAR Strings

A CIGAR string (e.g., `8M2I4M1D3M`) is a compact encoding of an alignment. `M` = match/mismatch, `I` = insertion in query, `D` = deletion in query. `cigar_stats` extracts counts; `parse_cigar` returns the full operations array.

### Multiple Sequence Alignment

Progressive MSA builds a guide tree from pairwise distances, then aligns sequences along it. POA consensus constructs a partial-order graph and extracts the consensus path — useful for error correction in long reads.

## Code Examples

### Rust

```rust
use cyanea_align::{align_dna, AlignMode};

let result = align_dna("ACGTACGT", "ACGACGT", AlignMode::Global)?;
println!("Score: {}, CIGAR: {}", result.score, result.cigar);
```

### Python

```python
import cyanea

result = cyanea.align_dna("ACGTACGT", "ACGACGT", mode="global")
print(f"Score: {result['score']}, CIGAR: {result['cigar']}")
```

### JavaScript (WASM)

```javascript
import { align_dna_custom, progressive_msa } from '/wasm/cyanea_wasm.js';

const result = JSON.parse(align_dna_custom("ACGTACGT", "ACGACGT", "global", 2, -1, -5, -2));
console.log(`Score: ${result.ok.score}, CIGAR: ${result.ok.cigar}`);
```

## Use Cases

- **Variant discovery** — Align reads to a reference to find SNPs and indels.
- **Homology search** — Score protein alignments with BLOSUM62 to detect remote homologs.
- **Consensus building** — Combine noisy long reads into a polished consensus via POA.
- **SAM/BAM QC** — Parse and validate CIGAR strings from alignment files.
