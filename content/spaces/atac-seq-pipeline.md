+++
title = "ATAC-seq Pipeline"
description = "End-to-end ATAC-seq analysis with QC reports — from FASTQ to peak calls."
template = "space-page.html"

[extra]
demo = true
org = "encode"
status = "Published"
status_class = "status-published"
stars = "158"
forks = "24"
updated = "3 days ago"
tags = ["ATAC-seq", "chromatin accessibility", "pipeline", "epigenomics", "peak calling"]
compliance = [
    { label = "FAIR Gold", class = "compliance-gold" },
    { label = "Reproducible", class = "compliance-repro" },
]
contents = [
    { icon = "notebook", label = "6 Notebooks" },
    { icon = "dataset", label = "4 Datasets" },
    { icon = "protocol", label = "2 Protocols" },
]
contributors = 10
metadata_tags = ["H. sapiens", "ATAC-seq", "Epigenomics"]
+++

A production-grade ATAC-seq analysis pipeline following ENCODE best practices. This space bundles analysis notebooks, reference datasets, and quality control protocols into a single reproducible workspace.

## Pipeline steps

1. **Read QC** — adapter trimming, quality filtering with fastp
2. **Alignment** — Bowtie2 alignment to GRCh38 with mitochondrial read filtering
3. **Post-alignment QC** — duplicate marking, fragment size distribution, TSS enrichment
4. **Peak calling** — MACS2 narrow peak calling with IDR for replicate consistency
5. **Signal tracks** — normalized bigWig generation for genome browser visualization
6. **Differential accessibility** — DESeq2-based differential analysis between conditions

## Quality metrics

Every run produces a comprehensive HTML QC report including library complexity estimates, TSS enrichment scores, FRiP values, and reproducibility metrics (IDR).
