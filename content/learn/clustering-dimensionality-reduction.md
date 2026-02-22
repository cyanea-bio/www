+++
title = "Clustering & Dimensionality Reduction"
description = "Apply PCA, t-SNE, and UMAP to biological datasets. Adjust hyperparameters and see how clusters form, split, and merge in real time."
weight = 8
template = "learn-page.html"

[extra]
difficulty = "Intermediate"
difficulty_level = "intermediate"
duration = "~20 min"
domain = "Machine Learning"
crates = ["cyanea-ml"]
papers = 4
badge = "Interactive"
preview_label = "UMAP / t-SNE projection"
tags = ["Machine Learning", "Visualization"]
+++

## Making Sense of High-Dimensional Data

Biological datasets are often high-dimensional. A single-cell RNA-seq experiment might measure the expression of 20,000 genes in each of 100,000 cells. No human can visualise 20,000 dimensions — but dimensionality reduction algorithms can project this data into two or three dimensions while preserving meaningful structure, revealing cell types, developmental trajectories, and disease states.

This simulation lets you apply three widely used techniques to biological datasets and watch clusters emerge in real time.

## What You'll Explore

- **PCA (Principal Component Analysis)** finds the orthogonal axes of greatest variance. The first principal component captures the most variance, the second the most remaining variance orthogonal to the first, and so on. PCA is linear, fast, and deterministic — the same input always produces the same output.
- **t-SNE (t-distributed Stochastic Neighbor Embedding)** preserves local neighborhood structure by modelling pairwise similarities as probability distributions. It excels at revealing clusters but can distort global distances — clusters that appear far apart in a t-SNE plot are not necessarily more different than clusters that appear close.
- **UMAP (Uniform Manifold Approximation and Projection)** is similar to t-SNE in spirit but uses a different mathematical framework (fuzzy simplicial sets). It is generally faster, better at preserving global structure, and has become the default in single-cell genomics.
- **Adjust hyperparameters** — perplexity for t-SNE, number of neighbors and minimum distance for UMAP — and see how they change the embedding. Too low a perplexity fragments real clusters; too high a perplexity merges distinct groups.

## Key Concepts

### Principal Component Analysis

PCA works by computing the eigendecomposition of the data's covariance matrix. The eigenvectors (principal components) define new axes, and the eigenvalues indicate how much variance each axis explains. Projecting the data onto the top 2–3 components gives a quick overview of the dominant sources of variation.

PCA has limitations: because it is linear, it cannot capture curved or nonlinear structures (manifolds) in the data. A circle in 2D, for example, would be poorly represented by a single principal component.

### t-SNE

t-SNE converts high-dimensional Euclidean distances into conditional probabilities that represent similarities. In the high-dimensional space, it uses Gaussian kernels; in the low-dimensional embedding, it uses Student's t-distributions (which have heavier tails, preventing the "crowding problem" where moderate-distance points collapse together).

The key hyperparameter is **perplexity**, which roughly controls how many neighbors each point considers. Typical values range from 5 to 50.

### UMAP

UMAP constructs a weighted graph in high-dimensional space (connecting each point to its *k* nearest neighbors), then optimises a low-dimensional layout that preserves the graph's topology. Two key hyperparameters:

- **n_neighbors** controls local vs. global structure (analogous to perplexity). Small values emphasise fine-grained clusters; large values capture broader patterns.
- **min_dist** controls how tightly points are packed in the embedding. Smaller values create denser clusters; larger values spread points out more evenly.

### Clustering

Once the data are embedded, clustering algorithms can identify groups. K-means partitions points into *k* spherical clusters by minimising within-cluster variance. Leiden and Louvain algorithms detect communities in a nearest-neighbor graph and are the standard in single-cell analysis — they do not require specifying *k* in advance.

## Background Reading

1. van der Maaten, L. & Hinton, G. (2008). Visualizing data using t-SNE. *Journal of Machine Learning Research*, 9, 2579–2605.
2. McInnes, L., Healy, J. & Melville, J. (2018). UMAP: Uniform Manifold Approximation and Projection for dimension reduction. *arXiv:1802.03426*.
3. Traag, V. A., Waltman, L. & van Eck, N. J. (2019). From Louvain to Leiden: guaranteeing well-connected communities. *Scientific Reports*, 9, 5233.
4. Jolliffe, I. T. & Cadima, J. (2016). Principal component analysis: a review and recent developments. *Philosophical Transactions of the Royal Society A*, 374, 20150202.
