+++
title = "ENCODE4 ATAC-seq"
description = "Chromatin accessibility across 600+ biosamples from the ENCODE consortium."
template = "dataset-page.html"

[extra]
demo = true
org = "encode"
downloads = "19.1k"
likes = "512"
size = "3.8 TB"
organism = "H. sapiens / M. musculus"
format_tags = ["BAM", "bigWig", "BED narrowPeak"]
tags = ["chromatin accessibility", "ATAC-seq", "epigenomics", "regulatory elements"]
updated = "5 days ago"
license = "CC-BY 4.0"
version = "ENCODE4"
files = [
    { name = "experiments/ENCSR*/alignments.bam", size = "~2.4 TB" },
    { name = "experiments/ENCSR*/signal.bigWig", size = "~800 GB" },
    { name = "experiments/ENCSR*/peaks.bed.gz", size = "~12 GB" },
    { name = "metadata.tsv", size = "14 MB" },
    { name = "README.md", size = "5.1 KB" },
]
+++

The ENCODE4 ATAC-seq collection provides genome-wide chromatin accessibility profiles across **600+ biosamples**, including primary tissues, cell lines, and in vitro differentiated cells. This is one of the largest standardized collections of open chromatin data available.

## What's included

- **Aligned reads** (BAM) processed through the ENCODE ATAC-seq pipeline
- **Signal tracks** (bigWig) for genome browser visualization
- **Peak calls** (narrowPeak BED) identifying accessible chromatin regions
- **Standardized metadata** with biosample ontology terms and quality metrics

## Use cases

Used for identifying regulatory elements, transcription factor binding sites, and chromatin state across cell types. Essential for integrative analyses combining gene expression with epigenomic data.
