+++
title = "cyanea-seq"
description = "Biological sequence types and operations — DNA, RNA, protein. Transcription, translation, k-mers, reverse complement, GC content, RNA folding, and more."
weight = 2

[extra]
version = "0.3.8"
layer = "Core"
badge = "popular"
tagline = "The sequence toolkit at the heart of Cyanea."
wasm_module = "cyanea_wasm"
has_playground = true
license = "Apache-2.0"
source_url = "https://github.com/cyanea-io/cyanea/tree/main/cyanea-seq"
docs_url = "/docs"
registry_url = "https://crates.io"
registry_name = "crates.io"
depends_on = ["cyanea-core"]
depended_by = ["cyanea-io", "cyanea-align", "cyanea-omics", "cyanea-stats", "cyanea-wasm"]
tags = ["Sequences", "DNA", "RNA", "Protein", "K-mers", "Translation"]
functions = [
    { name = "transcribe", sig = "(seq: &str) -> String", desc = "Convert DNA to mRNA (T → U)" },
    { name = "translate", sig = "(seq: &str) -> String", desc = "Translate DNA/RNA to amino acid sequence" },
    { name = "reverse_complement", sig = "(seq: &str) -> String", desc = "Reverse complement of a DNA sequence" },
    { name = "gc_content_json", sig = "(seq: &str) -> f64", desc = "Calculate GC content as a fraction" },
    { name = "validate", sig = "(seq: &str, alphabet: &str) -> bool", desc = "Check sequence validity against an alphabet" },
    { name = "rna_fold_nussinov", sig = "(seq: &str) -> String", desc = "Predict RNA secondary structure (Nussinov algorithm)" },
    { name = "protein_props", sig = "(seq: &str) -> JSON", desc = "Compute protein physicochemical properties" },
    { name = "codon_usage", sig = "(seq: &str) -> JSON", desc = "Compute codon usage table from a coding sequence" },
    { name = "minhash_compare", sig = "(a: &str, b: &str, k, n) -> f64", desc = "Estimate Jaccard similarity via MinHash sketches" },
    { name = "assembly_stats_json", sig = "(contigs: JSON) -> JSON", desc = "Compute N50, L50, and assembly statistics" },
]
+++

## Overview

`cyanea-seq` is the most-used crate in the ecosystem. It provides strongly-typed biological sequence representations (DNA, RNA, protein) with efficient 2-bit encoding, plus a comprehensive toolkit of sequence operations: transcription, translation, reverse complement, GC content, k-mer generation, MinHash similarity, RNA secondary structure prediction, and contig assembly statistics.

Every operation that manipulates a raw biological sequence lives here, making it the natural dependency for any crate that reads, writes, aligns, or analyzes sequences.

## Key Concepts

### 2-Bit Encoding

DNA bases require only 2 bits each (A=00, C=01, G=10, T=11). `cyanea-seq` stores sequences in packed form, reducing memory by 4x compared to one-byte-per-base representations. All operations work directly on the packed representation — no unpacking needed.

### The Central Dogma

`transcribe` converts a DNA template into mRNA (T → U). `translate` reads the mRNA three bases at a time, mapping each codon to its amino acid via the standard genetic code. Together they implement the central dogma of molecular biology in two function calls.

### K-mer Analysis

K-mers are all subsequences of length *k* in a sequence. They are the foundation of genome assembly, metagenomic classification, and sequence comparison. `kmer_count` produces a frequency table; `minhash_compare` uses locality-sensitive hashing to estimate Jaccard similarity between two sets of k-mers in sublinear time.

### RNA Secondary Structure

`rna_fold_nussinov` implements the Nussinov algorithm to predict the maximum number of base pairs in an RNA sequence. The result is a dot-bracket string where `(` and `)` indicate paired bases and `.` indicates unpaired positions.

## Code Examples

### Rust

```rust
use cyanea_seq::{DnaSeq, transcribe, translate, gc_content};

let seq = DnaSeq::from("ATGGCTAGCAAAGAC");
let mrna = transcribe(&seq);
let protein = translate(&seq);
let gc = gc_content(&seq);
```

### Python

```python
import cyanea

mrna = cyanea.transcribe("ATGGCTAGCAAAGAC")
protein = cyanea.translate("ATGGCTAGCAAAGAC")
gc = cyanea.gc_content("ATGGCTAGCAAAGAC")
fold = cyanea.rna_fold_nussinov("GGGAAACCC")
```

### JavaScript (WASM)

```javascript
import { transcribe, translate, gc_content_json, rna_fold_nussinov } from '/wasm/cyanea_wasm.js';

const mrna = transcribe("ATGGCTAGCAAAGAC");
const protein = translate("ATGGCTAGCAAAGAC");
const gc = JSON.parse(gc_content_json("ATGGCTAGCAAAGAC"));
const fold = JSON.parse(rna_fold_nussinov("GGGAAACCC"));
```

## Use Cases

- **Gene annotation** — Translate ORFs and compute reading frame statistics.
- **Quality control** — Validate sequences against expected alphabets before analysis.
- **Metagenomic binning** — Compare k-mer profiles between contigs via MinHash.
- **RNA structure** — Predict simple secondary structures for short non-coding RNAs.
