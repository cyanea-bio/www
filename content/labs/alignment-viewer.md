+++
title = "alignment-viewer"
description = "Interactive BAM/SAM alignment viewer with pileup visualization, variant highlighting, and coverage plots. Zero server needed."
weight = 21
template = "tool-page.html"

[extra]
org = "cyanea"
badge = "popular"
status = "Popular"
likes = 521
updated = "3d ago"
powered_by = ["cyanea-wasm", "cyanea-io", "cyanea-align"]
tags = ["Viewer", "Alignments", "Browser Tool"]
format_tags = ["BAM", "SAM", "CRAM", "BAI"]
+++

## Overview

Alignment Viewer renders BAM/SAM alignment data directly in the browser. Navigate to any genomic region, see read pileups with mismatches highlighted, and inspect coverage depth — all powered by WebAssembly with no backend required.

## Features

- **Pileup view** — Reads stacked by position with mismatches, insertions, and deletions color-coded.
- **Coverage track** — Real-time coverage depth histogram above the pileup.
- **Variant highlighting** — SNPs and indels are automatically highlighted against the reference.
- **Region navigation** — Jump to coordinates (e.g., `chr1:1,000,000-1,001,000`) or search by gene name.
- **Read details** — Click any read to see mapping quality, CIGAR string, flags, and tags.
- **Split view** — Compare two BAM files side-by-side for tumor/normal or before/after analysis.

## How It Works

BAM files are indexed client-side using `cyanea-io`'s BAM parser compiled to WASM. The viewer fetches only the byte ranges needed for the current viewport, so even multi-gigabyte files are navigable. Alignment operations use `cyanea-align` for local realignment and mismatch detection.

## Use Cases

- **Variant validation** — Visually confirm variant calls by inspecting the supporting reads.
- **Pipeline debugging** — Check alignment quality without downloading IGV or setting up a server.
- **Presentations** — Embed a live alignment view in talks or notebooks.
- **Privacy-sensitive data** — View clinical alignments without uploading to any third-party service.
