+++
title = "cyanea-ml"
description = "Machine learning primitives for biological data — PCA, UMAP, t-SNE, k-means clustering, random forest classification, and distance metrics."
weight = 7

[extra]
version = "0.1.3"
layer = "Analysis"
badge = "new"
tagline = "Dimensionality reduction, clustering, and classification for biology."
wasm_module = "cyanea_wasm"
has_playground = true
license = "Apache-2.0"
source_url = "https://github.com/cyanea-io/cyanea/tree/main/cyanea-ml"
docs_url = "/docs"
registry_url = "https://crates.io"
registry_name = "crates.io"
depends_on = ["cyanea-core", "cyanea-stats"]
depended_by = ["cyanea-wasm"]
tags = ["Machine Learning", "PCA", "UMAP", "t-SNE", "Clustering", "Classification"]
functions = [
    { name = "kmer_count", sig = "(seq: &str, k: u32) -> JSON", desc = "Count k-mer frequencies in a sequence" },
    { name = "euclidean_distance", sig = "(a, b: JSON) -> f64", desc = "Euclidean distance between two vectors" },
    { name = "pca", sig = "(data, n_feat, n_comp) -> JSON", desc = "Principal component analysis" },
    { name = "umap", sig = "(data, n_feat, n_comp, ...) -> JSON", desc = "UMAP dimensionality reduction" },
    { name = "tsne", sig = "(data, n_feat, n_comp, ...) -> JSON", desc = "t-SNE dimensionality reduction" },
    { name = "kmeans", sig = "(data, n_feat, k, max_iter, seed) -> JSON", desc = "K-means clustering" },
    { name = "random_forest_classify", sig = "(data, n_feat, labels, n_trees, depth, seed) -> JSON", desc = "Random forest classifier" },
    { name = "confusion_matrix", sig = "(actual, predicted: JSON) -> JSON", desc = "Compute confusion matrix from predictions" },
    { name = "roc_curve", sig = "(scores, labels: JSON) -> JSON", desc = "Compute ROC curve points and AUC" },
]
+++

## Overview

`cyanea-ml` provides the core machine learning algorithms used in modern bioinformatics — from dimensionality reduction (PCA, UMAP, t-SNE) through clustering (k-means) to classification (random forest) and evaluation (confusion matrix, ROC/AUC, precision-recall).

These algorithms run entirely in the browser via WASM, making it possible to explore single-cell datasets, classify sequences, and visualize high-dimensional data without any server infrastructure.

## Key Concepts

### Dimensionality Reduction

High-dimensional biological data (gene expression, k-mer profiles, protein features) needs to be projected into 2 or 3 dimensions for visualization. PCA finds the linear projections of maximum variance; t-SNE and UMAP find non-linear embeddings that preserve local structure. UMAP is generally preferred for its speed and global structure preservation.

### K-means Clustering

K-means partitions data into k clusters by iteratively assigning points to the nearest centroid and recomputing centroids. It is fast and deterministic (given a seed), making it suitable for interactive exploration where you want to try different values of k.

### Random Forest Classification

A random forest builds many decision trees on random subsets of the data and features, then aggregates their votes. It handles high-dimensional data well, provides feature importance scores, and is robust to overfitting. `confusion_matrix` and `roc_curve` evaluate the classifier's performance.

## Code Examples

### Rust

```rust
use cyanea_ml::{pca, kmeans, random_forest_classify};

let embedding = pca(&data, n_features, 2);
let clusters = kmeans(&data, n_features, 5, 100, 42);
let model = random_forest_classify(&data, n_features, &labels, 100, 10, 42);
```

### Python

```python
import cyanea

embedding = cyanea.pca(data, n_features=100, n_components=2)
clusters = cyanea.kmeans(data, n_features=100, k=5)
```

### JavaScript (WASM)

```javascript
import { pca, umap, kmeans, random_forest_classify } from '/wasm/cyanea_wasm.js';

const embedding = JSON.parse(pca(JSON.stringify(data), n_features, 2));
const clusters = JSON.parse(kmeans(JSON.stringify(data), n_features, 5, 100, 42));
```

## Use Cases

- **Single-cell RNA-seq** — PCA → UMAP → k-means pipeline for cell type discovery.
- **Metagenomics** — Classify sequences by k-mer profile using random forests.
- **Drug response** — Predict cell line drug sensitivity from gene expression features.
- **QC** — Visualize batch effects in high-dimensional assay data.
