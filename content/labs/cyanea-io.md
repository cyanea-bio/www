+++
title = "cyanea-io"
description = "High-performance parsers and writers for bioinformatics formats. FASTA, FASTQ, VCF, BED, GFF3, SAM, BLAST XML, GFA, and more."
weight = 3

[extra]
version = "0.3.5"
layer = "I/O"
badge = "new"
tagline = "Read and write every major bioinformatics format at native speed."
wasm_module = "cyanea_wasm"
has_playground = true
license = "Apache-2.0"
source_url = "https://github.com/cyanea-bio/labs/tree/main/cyanea-io"
registry_url = "https://crates.io/crates/cyanea-io"
registry_name = "crates.io"
depends_on = ["cyanea-core", "cyanea-seq"]
depended_by = ["cyanea-align", "cyanea-omics", "cyanea-wasm"]
tags = ["I/O", "Parsing", "FASTA", "FASTQ", "VCF", "BED", "GFF3", "SAM", "GFA"]
functions = [
    { name = "parse_fasta", sig = "(data: &str) -> JSON", desc = "Parse FASTA format into records with name and sequence" },
    { name = "parse_fastq", sig = "(data: &str) -> JSON", desc = "Parse FASTQ format into records with quality scores" },
    { name = "parse_vcf_text", sig = "(text: &str) -> JSON", desc = "Parse VCF variant records with INFO and genotype fields" },
    { name = "parse_bed_text", sig = "(text: &str) -> JSON", desc = "Parse BED interval records" },
    { name = "parse_gff3_text", sig = "(text: &str) -> JSON", desc = "Parse GFF3 gene annotation records" },
    { name = "pileup_from_sam", sig = "(sam: &str) -> JSON", desc = "Generate pileup from SAM alignment text" },
    { name = "parse_blast_xml", sig = "(xml: &str) -> JSON", desc = "Parse BLAST XML output into structured hits" },
    { name = "parse_gfa", sig = "(text: &str) -> JSON", desc = "Parse GFA assembly graph format" },
]
+++

## Overview

`cyanea-io` is the I/O workhorse of the ecosystem. It provides zero-copy, streaming parsers for every major bioinformatics file format — FASTA, FASTQ, VCF, BED, GFF3, SAM/BAM, BLAST XML, GFA, BedGraph, and more. Each parser returns structured JSON that downstream crates can consume directly.

The parsers are designed for both server-side Rust pipelines and browser-side WASM use. In the browser, you can paste or drag-drop a file and get immediate, interactive results — no server round-trip required.

## Key Concepts

### Streaming vs. Full Parse

For large files (multi-GB FASTQ), the Rust API provides streaming iterators that process one record at a time with constant memory. The WASM bindings parse the full text in one call, which is appropriate for the smaller files typically handled in the browser.

### Format Gallery

| Format | Extension | Content |
|--------|-----------|---------|
| FASTA | `.fa`, `.fasta` | Sequences with headers |
| FASTQ | `.fq`, `.fastq` | Sequences + quality scores |
| VCF | `.vcf` | Variant calls with genotypes |
| BED | `.bed` | Genomic intervals |
| GFF3 | `.gff3` | Gene annotations |
| SAM | `.sam` | Read alignments |
| BLAST XML | `.xml` | Search results |
| GFA | `.gfa` | Assembly graphs |

### Validation

Each parser validates the format structure and reports clear error messages with line numbers. Malformed records are flagged but don't halt parsing — you get both the valid data and a list of warnings.

## Code Examples

### Rust

```rust
use cyanea_io::{FastaReader, VcfReader};

let reader = FastaReader::from_path("genome.fa")?;
for record in reader {
    println!("{}: {} bp", record.name, record.seq.len());
}
```

### Python

```python
import cyanea

records = cyanea.parse_fasta(open("genome.fa").read())
variants = cyanea.parse_vcf(open("calls.vcf").read())
```

### JavaScript (WASM)

```javascript
import { parse_fasta, parse_vcf_text, parse_bed_text } from '/wasm/cyanea_wasm.js';

const records = JSON.parse(parse_fasta(fastaText));
const variants = JSON.parse(parse_vcf_text(vcfText));
const intervals = JSON.parse(parse_bed_text(bedText));
```

## Use Cases

- **Format conversion** — Parse one format, emit another. FASTA ↔ FASTQ, VCF → BED, GFF3 → BED.
- **Browser-based QC** — Drop a FASTQ file onto the page and see per-base quality distributions instantly.
- **Pipeline glue** — Read SAM text, generate pileup, and feed it into variant calling.
