+++
title = "CellxGene Census 2024"
description = "Single-cell RNA-seq atlas — 50M+ cells, 600+ datasets from the CZ CELLxGENE project."
template = "dataset-page.html"

[extra]
demo = true
org = "cellxgene"
downloads = "14.8k"
likes = "389"
size = "1.2 TB"
organism = "H. sapiens / M. musculus"
format_tags = ["h5ad", "TileDB-SOMA", "Parquet"]
tags = ["single-cell", "RNA-seq", "cell atlas", "transcriptomics"]
updated = "1 week ago"
license = "CC-BY 4.0"
version = "2024-07"
files = [
    { name = "census_data/homo_sapiens/", size = "820 GB" },
    { name = "census_data/mus_musculus/", size = "340 GB" },
    { name = "cell_metadata.parquet", size = "2.8 GB" },
    { name = "dataset_metadata.parquet", size = "1.2 MB" },
    { name = "README.md", size = "7.6 KB" },
]
+++

The CellxGene Census 2024 is a standardized aggregation of **50+ million single cells** from over **600 published datasets**. It provides a unified, queryable interface to the largest collection of single-cell RNA-seq data, harmonized with consistent cell type annotations and metadata.

## What's included

- **Gene expression matrices** in AnnData (h5ad) and TileDB-SOMA formats
- **Harmonized cell metadata** with cell ontology terms and donor information
- **Dataset-level metadata** linking back to original publications
- **Pre-computed embeddings** (UMAP, PCA) for visualization

## Use cases

Ideal for cell type reference mapping, cross-dataset integration, and large-scale meta-analyses of gene expression. The Census API enables efficient slice-and-query access without downloading the full dataset.
