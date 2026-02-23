+++
title = "BRCA Variant Explorer"
description = "Interactive browser for BRCA1/2 clinical variants with pathogenicity classification."
template = "space-page.html"

[extra]
demo = true
org = "cyanea"
status = "Running"
status_class = "status-active"
stars = "284"
forks = "42"
updated = "2 days ago"
tags = ["BRCA1", "BRCA2", "clinical genomics", "variant interpretation", "ClinVar"]
compliance = [
    { label = "FAIR Gold", class = "compliance-gold" },
    { label = "Reproducible", class = "compliance-repro" },
]
contents = [
    { icon = "notebook", label = "4 Notebooks" },
    { icon = "dataset", label = "2 Datasets" },
    { icon = "protocol", label = "1 Protocol" },
]
contributors = 8
metadata_tags = ["Homo sapiens", "WGS", "Clinical Genomics"]
+++

An interactive workspace for exploring BRCA1 and BRCA2 clinical variants. This space integrates ClinVar annotations, population frequency data from gnomAD, and in-silico pathogenicity predictions to provide a comprehensive view of each variant's clinical significance.

## Features

- **Variant browser** with filterable columns for gene, position, consequence, and classification
- **Lollipop plots** showing variant distribution across protein domains
- **Automated pathogenicity scoring** using ACMG/AMP criteria
- **ClinVar concordance tracking** with alerts for reclassified variants

## Datasets included

This space links to curated BRCA1/2 variant datasets from ClinVar (v2024-01) and gnomAD v4.1 population frequencies, joined with functional assay results from published saturation genome editing experiments.
