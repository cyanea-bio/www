+++
title = "Adaptive Sampling"
description = "Real-time selective sequencing on MinION / PromethION for targeted enrichment without library prep."
template = "protocol-page.html"

[extra]
demo = true
org = "oxford-nanopore"
forks = "978"
likes = "412"
steps = 10
duration = "~1 day"
difficulty = "Intermediate"
difficulty_level = "intermediate"
category = "Sequencing"
version = "1.4"
tags = ["nanopore", "adaptive sampling", "targeted sequencing", "MinION", "PromethION"]
materials = [
    "MinION Mk1C or PromethION (Oxford Nanopore)",
    "Flow Cell (R10.4.1)",
    "Ligation Sequencing Kit (SQK-LSK114)",
    "MinKNOW software (v23.04+)",
    "Reference genome FASTA (indexed)",
    "High-molecular-weight genomic DNA (>10 kb N50)",
    "AMPure XP beads",
]
+++

Adaptive sampling enables real-time selective sequencing on Oxford Nanopore platforms. As DNA strands pass through the nanopore, MinKNOW software maps the signal to a reference genome and decides within milliseconds whether to continue reading (on-target) or reject the strand (off-target) by reversing the voltage.

## Overview

This computational enrichment approach requires no additional library preparation — any standard ligation-based library can be used. The method achieves 2–10x enrichment of target regions depending on the fraction of the genome being targeted. It is particularly powerful for clinical applications, structural variant detection, and methylation analysis of specific loci.

## Key considerations

- **Target size**: Works best when targeting 1–50% of the genome; very small targets (<1%) show lower enrichment
- **DNA quality**: High-molecular-weight DNA (>10 kb) gives the best results; fragmented DNA reduces rejection efficiency
- **Compute requirements**: Requires a GPU-capable device (MinION Mk1C, GridION, or PromethION) for real-time basecalling
- **Reference preparation**: BED file defining target regions; reference genome must be pre-indexed
