+++
title = "gnomAD v4.1"
description = "Genome aggregation database — 807k exomes, 76k genomes with variant frequencies across diverse populations."
template = "dataset-page.html"

[extra]
demo = true
org = "broad-institute"
downloads = "48.2k"
likes = "1,842"
size = "12.4 TB"
organism = "H. sapiens"
format_tags = ["VCF", "TSV", "Hail MatrixTable"]
tags = ["population genetics", "variant frequency", "exome", "genome", "gnomAD"]
updated = "2 days ago"
license = "CC0"
version = "4.1"
files = [
    { name = "gnomad.exomes.v4.1.sites.vcf.bgz", size = "58.3 GB" },
    { name = "gnomad.genomes.v4.1.sites.vcf.bgz", size = "742 GB" },
    { name = "gnomad.v4.1.coverage.summary.tsv.bgz", size = "12.1 GB" },
    { name = "gnomad.v4.1.constraint_metrics.tsv", size = "4.2 MB" },
    { name = "README.md", size = "8.4 KB" },
]
+++

The Genome Aggregation Database (gnomAD) is a resource developed by an international coalition of investigators that aggregates and harmonizes both exome and genome data from a wide range of large-scale sequencing projects. This release spans **807,162 exomes** and **76,215 genomes** from unrelated individuals sequenced as part of various disease-specific and population genetic studies.

## What's included

- **Variant frequencies** across 8 major population groups
- **Loss-of-function constraint metrics** for every protein-coding gene
- **Structural variants** from short-read WGS
- **Mitochondrial variant calls** from all available samples

## Use cases

gnomAD is widely used for variant filtering in rare-disease diagnostics, estimating carrier frequencies for recessive conditions, and benchmarking variant-calling pipelines. The constraint metrics are a standard tool for gene-level interpretation in clinical genomics.
