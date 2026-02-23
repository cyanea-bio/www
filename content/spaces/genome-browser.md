+++
title = "Genome Browser"
description = "WASM-powered genome viewer with multi-track support — runs entirely in the browser."
template = "space-page.html"

[extra]
demo = true
org = "cyanea"
status = "Running"
status_class = "status-active"
stars = "412"
forks = "68"
updated = "6 hours ago"
tags = ["genome browser", "WASM", "visualization", "BAM", "bigWig"]
compliance = [
    { label = "FAIR Silver", class = "compliance-silver" },
]
contents = [
    { icon = "notebook", label = "2 Notebooks" },
    { icon = "dataset", label = "3 Datasets" },
]
contributors = 12
metadata_tags = ["Multi-species", "Visualization", "WebAssembly"]
+++

A WebAssembly-powered genome browser that runs entirely in the browser with no server-side computation. Load BAM, CRAM, VCF, bigWig, and BED files from local disk or remote URLs and visualize them with smooth scrolling and zooming.

## Features

- **Multi-track visualization** supporting BAM/CRAM alignments, coverage, variants, and annotations
- **Client-side rendering** using Rust compiled to WASM for near-native performance
- **Remote file support** with HTTP range requests for streaming large files
- **Bookmark and share** specific genomic coordinates and track configurations

## Performance

The browser handles BAM files with millions of reads by using indexed access and progressive rendering. Typical load times are under 2 seconds for a 100 kb region even on mid-range hardware.
