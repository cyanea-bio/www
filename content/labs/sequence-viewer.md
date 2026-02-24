+++
title = "sequence-viewer"
description = "View and inspect FASTA/FASTQ files directly in your browser. Syntax highlighting, search, and quality score visualization."
weight = 20
template = "tool-page.html"

[extra]
org = "cyanea"
badge = "popular"
status = "Stable"
likes = 342
updated = "1d ago"
powered_by = ["cyanea-wasm", "cyanea-io", "cyanea-seq"]
tags = ["Viewer", "Sequences", "Browser Tool"]
format_tags = ["FASTA", "FASTQ", "GenBank", "EMBL"]
+++

## Overview

Sequence Viewer is a browser-based tool for inspecting biological sequence files. Drop a FASTA or FASTQ file onto the page and instantly browse sequences with syntax highlighting, per-base quality score visualization, and full-text search — all running client-side via WebAssembly.

## Features

- **Drag-and-drop** — Open files by dragging them into the browser window. No upload, no server.
- **Syntax highlighting** — Bases are color-coded by type (A/T/G/C for DNA, amino acid groups for protein).
- **Quality scores** — FASTQ Phred scores rendered as a heatmap overlay so low-quality regions stand out.
- **Search** — Find sequences by ID or subsequence with instant regex-powered matching.
- **Large file support** — Virtualized scrolling handles files with millions of records without lag.
- **Copy and export** — Select and copy sequences to clipboard, or export filtered subsets as new FASTA/FASTQ.

## How It Works

The viewer uses `cyanea-wasm` to compile the Rust parsing stack to WebAssembly. When you open a file, `cyanea-io` parses the format and `cyanea-seq` validates and encodes the sequences. Everything stays in your browser — the file never leaves your machine.

## Use Cases

- **Quick inspection** — Check a FASTA file before feeding it into a pipeline.
- **Teaching** — Show students sequence structure without installing software.
- **Quality review** — Scan FASTQ quality scores to decide on trimming parameters.
- **Field work** — Inspect sequencing output on a laptop with no internet connection (works offline after first load).
