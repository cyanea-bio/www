+++
title = "Chromium scRNA-seq"
description = "Single-cell gene expression with Chromium Next GEM — full workflow from cell suspension to sequencing-ready libraries."
template = "protocol-page.html"

[extra]
demo = true
org = "10x-genomics"
forks = "2,187"
likes = "743"
steps = 24
duration = "~2 days"
difficulty = "Advanced"
difficulty_level = "advanced"
category = "Library Prep"
version = "4.0"
tags = ["scRNA-seq", "single-cell", "10x Genomics", "library prep", "Chromium"]
materials = [
    "Chromium Next GEM Single Cell 3' Kit v4 (10x Genomics)",
    "Chromium Controller or Chromium X",
    "Next GEM Chip K (10x Genomics)",
    "SPRIselect Reagent (Beckman Coulter)",
    "Low TE Buffer",
    "Bioanalyzer High Sensitivity DNA Kit (Agilent)",
    "Qubit dsDNA HS Assay Kit (Invitrogen)",
]
+++

This protocol covers the full single-cell RNA-seq workflow using the 10x Genomics Chromium platform. Starting from a single-cell suspension, it walks through GEM generation, barcoded cDNA synthesis, library construction, and QC — resulting in sequencing-ready libraries compatible with Illumina platforms.

## Overview

The Chromium system partitions thousands of individual cells into nanoliter-scale Gel Bead-in-Emulsions (GEMs), where each cell's mRNA is uniquely barcoded. After reverse transcription, the barcoded cDNA is pooled for amplification and library construction. A single library captures the transcriptomes of 500–10,000 cells.

## Key considerations

- **Cell viability**: Input suspension should have >90% viability; dead cells inflate ambient RNA background
- **Target cell recovery**: Loading 10,000 cells typically yields ~6,000 recovered cells after filtering
- **Sequencing depth**: Recommend 20,000–50,000 reads per cell for standard gene expression
- **Timing**: Day 1 covers GEM generation through cDNA amplification; Day 2 covers library construction and QC
