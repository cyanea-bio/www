+++
title = "Cell Atlas Explorer"
description = "Browse and query the Human Cell Atlas datasets with interactive visualizations."
template = "space-page.html"

[extra]
demo = true
org = "cellxgene"
status = "Running"
status_class = "status-active"
stars = "1,203"
forks = "347"
updated = "5 days ago"
tags = ["single-cell", "cell atlas", "UMAP", "cell types", "Human Cell Atlas"]
compliance = [
    { label = "FAIR Gold", class = "compliance-gold" },
    { label = "Reproducible", class = "compliance-repro" },
]
contents = [
    { icon = "notebook", label = "8 Notebooks" },
    { icon = "dataset", label = "5 Datasets" },
    { icon = "protocol", label = "2 Protocols" },
]
contributors = 15
metadata_tags = ["H. sapiens", "scRNA-seq", "Cell Atlas"]
+++

An interactive explorer for Human Cell Atlas datasets. Browse cell type annotations, visualize gene expression across tissues, and query single-cell data without writing code.

## Features

- **UMAP explorer** with interactive cell type selection and gene expression overlay
- **Cross-tissue comparison** of cell type proportions and marker gene expression
- **Gene search** — instantly query expression levels across all cell types and tissues
- **Dataset browser** — filter and select from 600+ contributing datasets

## Data sources

This space integrates data from the CellxGene Census, including over 50 million cells from human and mouse tissues. Cell type annotations follow the Cell Ontology standard for consistent cross-dataset comparison.
