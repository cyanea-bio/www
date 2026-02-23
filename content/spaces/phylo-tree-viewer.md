+++
title = "Phylo Tree Viewer"
description = "Phylogenetic tree visualization and comparison tool for evolutionary analysis."
template = "space-page.html"

[extra]
demo = true
org = "sanger"
status = "Running"
status_class = "status-active"
stars = "196"
forks = "31"
updated = "1 week ago"
tags = ["phylogenetics", "tree visualization", "Newick", "evolution", "taxonomy"]
compliance = [
    { label = "FAIR Silver", class = "compliance-silver" },
    { label = "Reproducible", class = "compliance-repro" },
]
contents = [
    { icon = "notebook", label = "3 Notebooks" },
    { icon = "dataset", label = "2 Datasets" },
    { icon = "protocol", label = "1 Protocol" },
]
contributors = 5
metadata_tags = ["Multi-species", "Phylogenetics", "Evolution"]
+++

An interactive phylogenetic tree viewer for exploring evolutionary relationships. Upload Newick or Nexus files, or connect to precomputed gene trees from Ensembl Compara to visualize and compare tree topologies.

## Features

- **Interactive tree rendering** with radial, rectangular, and unrooted layouts
- **Tanglegram view** for comparing two tree topologies side-by-side
- **Metadata overlay** — color branches by taxonomy, geography, or custom annotations
- **Subtree operations** — collapse, reroot, rotate, and extract clades

## Included datasets

Ships with example trees from the Sanger Institute's global pathogen surveillance projects, including a 10,000-tip *Mycobacterium tuberculosis* phylogeny and a multi-locus *Plasmodium* species tree.
