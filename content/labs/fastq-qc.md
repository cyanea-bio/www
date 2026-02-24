+++
title = "fastq-qc"
description = "Browser-based FASTQ quality control reports. Generate per-base quality, adapter content, and GC distribution plots client-side."
weight = 24
template = "tool-page.html"

[extra]
org = "community"
badge = "new"
status = "New"
likes = 156
updated = "2d ago"
powered_by = ["cyanea-wasm", "cyanea-io", "cyanea-seq", "cyanea-stats"]
tags = ["QC", "Quality Control", "Browser Tool"]
format_tags = ["FASTQ", "FASTQ.GZ"]
+++

## Overview

FASTQ QC generates FastQC-style quality reports entirely in your browser. Drop a FASTQ file (plain or gzipped) and get per-base quality distributions, GC content curves, adapter contamination checks, and sequence length histograms — all computed client-side with WebAssembly.

## Features

- **Per-base quality** — Box-and-whisker plots of Phred scores at each read position.
- **Quality score distribution** — Histogram of mean quality scores across all reads.
- **GC content** — Per-sequence GC distribution compared to a theoretical normal.
- **Sequence length** — Distribution of read lengths for variable-length datasets.
- **Adapter content** — Detection of common adapter sequences (Illumina, Nextera, SOLiD).
- **Duplication levels** — Estimate of library complexity from sequence duplication rates.
- **Overrepresented sequences** — Flag sequences appearing more often than expected.

## How It Works

The tool streams FASTQ records through `cyanea-io`'s parser in a Web Worker. `cyanea-seq` handles base encoding and adapter matching, while `cyanea-stats` computes the statistical summaries. Results are plotted with a lightweight charting library. Processing speed is typically 1-2 million reads per second.

## Use Cases

- **Pre-alignment QC** — Check read quality before running an alignment pipeline.
- **Sequencing core reports** — Generate QC summaries without server infrastructure.
- **Troubleshooting** — Diagnose adapter contamination or quality drop-off at read ends.
- **Teaching** — Show students what good and bad sequencing data looks like interactively.
