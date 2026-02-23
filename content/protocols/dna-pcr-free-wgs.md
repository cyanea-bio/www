+++
title = "DNA PCR-free WGS"
description = "PCR-free whole genome library prep for NovaSeq — high-quality libraries without amplification bias."
template = "protocol-page.html"

[extra]
demo = true
org = "illumina"
forks = "1,856"
likes = "621"
steps = 16
duration = "~6 hours"
difficulty = "Intermediate"
difficulty_level = "intermediate"
category = "Library Prep"
version = "3.0"
tags = ["WGS", "PCR-free", "library prep", "Illumina", "NovaSeq"]
materials = [
    "Illumina DNA PCR-Free Prep Kit (cat. 20041793)",
    "IDT for Illumina DNA/RNA UD Indexes (cat. 20027213)",
    "Covaris microTUBE-50 (for shearing)",
    "SPRIselect Reagent (Beckman Coulter)",
    "Qubit dsDNA BR Assay Kit",
    "Bioanalyzer High Sensitivity DNA Kit",
    "Magnetic stand for 96-well plates",
]
+++

This protocol describes PCR-free whole genome sequencing library preparation optimized for Illumina NovaSeq 6000 and NovaSeq X platforms. By eliminating the PCR amplification step, these libraries provide more uniform coverage and reduced GC-bias compared to traditional PCR-based approaches.

## Overview

The workflow involves mechanical DNA fragmentation using a Covaris ultrasonicator, end repair and A-tailing, adapter ligation with unique dual indexes, and double-sided size selection. The resulting libraries have a target insert size of 350 bp and are ready for cluster generation without amplification.

## Key considerations

- **Input DNA**: Requires 100–500 ng of high-quality, high-molecular-weight genomic DNA (DIN > 7.0)
- **Fragment size**: Target 350 bp insert size for optimal paired-end sequencing on NovaSeq
- **Coverage**: Recommend 30x for human whole genome; adjust loading concentration accordingly
- **Quality control**: Final libraries should show a single peak at ~450 bp (insert + adapters) on Bioanalyzer
