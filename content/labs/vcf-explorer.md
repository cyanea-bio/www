+++
title = "vcf-explorer"
description = "Explore VCF files with filtering, sorting, and annotation lookups. Supports multi-sample VCFs with genotype visualization."
weight = 22
template = "tool-page.html"

[extra]
org = "cyanea"
badge = ""
status = "Stable"
likes = 287
updated = "5d ago"
powered_by = ["cyanea-wasm", "cyanea-io", "cyanea-stats"]
tags = ["Viewer", "Variants", "Browser Tool"]
format_tags = ["VCF", "gVCF", "BCF"]
+++

## Overview

VCF Explorer lets you load, filter, and browse variant call files entirely in the browser. Supports single-sample and multi-sample VCFs with interactive genotype matrices, quality filtering, and region-based queries — no server or installation needed.

## Features

- **Interactive table** — Sort by position, quality, allele frequency, or any INFO/FORMAT field.
- **Smart filtering** — Filter by quality (QUAL), read depth (DP), allele frequency (AF), variant type (SNP/indel/SV), and custom expressions.
- **Genotype matrix** — Multi-sample VCFs rendered as a color-coded genotype grid (ref/het/hom-alt/missing).
- **Region queries** — Zoom into a chromosome region or search by rsID.
- **Summary statistics** — Ts/Tv ratio, variant density per chromosome, allele frequency spectrum.
- **Export** — Download filtered variants as a new VCF or TSV for downstream analysis.

## How It Works

The tool uses `cyanea-io` compiled to WASM for fast VCF parsing, including gzipped files. Filtering and aggregation use `cyanea-stats` for statistical summaries. All processing happens in a Web Worker so the UI stays responsive even with millions of variants.

## Use Cases

- **Variant triage** — Quickly filter a clinical VCF to candidate pathogenic variants.
- **QC review** — Check Ts/Tv ratios and depth distributions before joint calling.
- **Teaching** — Explore population VCFs (e.g., 1000 Genomes subsets) interactively.
- **Cohort overview** — Visualize genotype patterns across dozens of samples.
