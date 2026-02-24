+++
title = "phylo-tree"
description = "Interactive phylogenetic tree viewer with support for Newick and Nexus formats. Circular, radial, and rectangular layouts."
weight = 23
template = "tool-page.html"

[extra]
org = "community"
badge = "featured"
status = "Featured"
likes = 198
updated = "1w ago"
powered_by = ["cyanea-wasm", "cyanea-phylo"]
tags = ["Visualization", "Phylogenetics", "Browser Tool"]
format_tags = ["Newick", "Nexus", "PhyloXML"]
+++

## Overview

Phylo Tree is a community-built interactive viewer for phylogenetic trees. Paste a Newick string or upload a Nexus file and instantly see a rendered tree with multiple layout options — circular, radial, rectangular, and unrooted. Runs entirely in the browser via WebAssembly.

## Features

- **Multiple layouts** — Switch between rectangular (cladogram), circular, radial, and unrooted views.
- **Interactive** — Pan, zoom, collapse/expand clades, and reroot the tree with click actions.
- **Metadata overlay** — Color branches or tips by metadata columns (e.g., species, geography, host).
- **Branch labels** — Show bootstrap support values, branch lengths, or custom annotations.
- **Search** — Find and highlight taxa by name with instant filtering.
- **Export** — Download the rendered tree as SVG or PNG for publication-quality figures.

## How It Works

Tree files are parsed by `cyanea-phylo` compiled to WASM, which handles Newick, Nexus, and PhyloXML formats. Layout algorithms compute node positions in Rust for speed, then the JavaScript rendering layer draws the tree to an SVG canvas with interactive controls.

## Use Cases

- **Paper figures** — Generate publication-ready tree images without installing FigTree or iTOL.
- **Quick visualization** — Paste a Newick string from RAxML or IQ-TREE output to see the result instantly.
- **Teaching** — Demonstrate tree thinking and clade concepts in a classroom setting.
- **Conference posters** — Export high-resolution SVGs for poster layouts.
