+++
title = "1000 Genomes 30x"
description = "High-coverage whole genome sequences for 3,202 samples across 26 populations worldwide."
template = "dataset-page.html"

[extra]
demo = true
org = "igsr"
downloads = "31.7k"
likes = "956"
size = "8.2 TB"
organism = "H. sapiens"
format_tags = ["CRAM", "VCF", "FASTQ"]
tags = ["population genetics", "reference panel", "WGS", "diversity"]
updated = "1 week ago"
license = "CC0"
version = "Phase 3 GRCh38"
files = [
    { name = "GRCh38_full_analysis_set/", size = "7.1 TB" },
    { name = "integrated_call_samples_v3.panel", size = "124 KB" },
    { name = "ALL.wgs.shapeit2_integrated.v1.GRCh38.vcf.gz", size = "890 GB" },
    { name = "sequence_index.tsv", size = "2.1 MB" },
    { name = "README.md", size = "6.2 KB" },
]
+++

The 1000 Genomes Project produced high-coverage (30x) whole genome sequencing data for **3,202 samples** from 26 populations across 5 continents. This dataset is one of the most widely used references for population genetics and serves as a foundational imputation panel.

## What's included

- **CRAM alignments** for all 3,202 samples against GRCh38
- **Joint-called VCFs** with SNPs, indels, and structural variants
- **Population metadata** including super-population and sub-population labels
- **Phased haplotypes** suitable for imputation reference panels

## Use cases

This dataset serves as the gold-standard reference for population allele frequencies, imputation panels, and benchmarking variant callers. It is commonly used in GWAS, pharmacogenomics, and ancestry estimation.
