+++
title = "cyanea-py"
description = "Python bindings via PyO3. Use the full Cyanea ecosystem from Python with zero-copy data exchange and NumPy/Polars interop."
weight = 13

[extra]
version = "0.2.0"
layer = "Platform"
badge = "new"
tagline = "The Cyanea ecosystem, callable from Python."
wasm_module = ""
has_playground = false
license = "Apache-2.0"
source_url = "https://github.com/cyanea-bio/labs/tree/main/cyanea-py"
docs_url = "https://docs.cyanea.bio/python/"
registry_url = "https://pypi.org/project/cyanea-py/"
registry_name = "PyPI"
depends_on = ["cyanea-core", "cyanea-seq", "cyanea-io", "cyanea-align", "cyanea-omics", "cyanea-stats", "cyanea-ml", "cyanea-chem", "cyanea-struct", "cyanea-phylo"]
depended_by = []
tags = ["Python", "PyO3", "NumPy", "Polars", "Bindings"]
functions = []
+++

## Overview

`cyanea-py` wraps the full Cyanea Rust ecosystem in a Python package via PyO3. Every function available in the Rust API is callable from Python with native-feeling ergonomics — no subprocess calls, no FFI boilerplate. Data passes between Python and Rust with zero-copy where possible, and NumPy arrays and Polars DataFrames are supported natively.

## Key Concepts

### Zero-Copy Data Exchange

PyO3's buffer protocol integration means that NumPy arrays can be passed directly to Rust functions without copying the underlying memory. This is critical for large matrices (expression data, distance matrices, alignments) where copying would dominate runtime.

### NumPy and Polars Interop

Functions that accept or return tabular data work with both NumPy arrays and Polars DataFrames. For example, `cyanea.describe()` accepts a list, a NumPy array, or a Polars Series. Functions returning tabular results (VCF records, BED intervals) return Polars DataFrames by default.

### Maturin Build

`cyanea-py` is built with Maturin, the standard Rust→Python build tool. It produces wheels for Linux (x86_64, aarch64), macOS (x86_64, arm64), and Windows (x86_64).

## Installation

```bash
pip install cyanea
```

Or from source:

```bash
pip install maturin
cd cyanea-py
maturin develop --release
```

## Usage Examples

```python
import cyanea
import numpy as np

# Sequence analysis
mrna = cyanea.transcribe("ATGGCTAGCAAAGAC")
protein = cyanea.translate("ATGGCTAGCAAAGAC")
gc = cyanea.gc_content("ATGGCTAGCAAAGAC")

# File parsing
records = cyanea.parse_fasta(open("genome.fa").read())
variants = cyanea.parse_vcf(open("calls.vcf").read())

# Statistics
data = np.random.randn(1000)
summary = cyanea.describe(data)
pvals = [0.001, 0.04, 0.03, 0.5]
adjusted = cyanea.benjamini_hochberg(pvals)

# Machine learning
embedding = cyanea.pca(data_matrix, n_features=100, n_components=2)
clusters = cyanea.kmeans(data_matrix, n_features=100, k=5)

# Phylogenetics
tree = cyanea.build_nj(labels, distance_matrix)
```

## Performance

| Operation | cyanea-py | BioPython | Speedup |
|-----------|-----------|-----------|---------|
| Parse 1M FASTA records | 0.8s | 12.4s | 15x |
| Pairwise align (1000 pairs) | 0.3s | 8.1s | 27x |
| K-mer count (k=21, 10Mbp) | 0.4s | 6.7s | 17x |
| PCA (10k × 500) | 0.2s | 1.1s | 5.5x |

## Use Cases

- **Jupyter notebooks** — Interactive analysis with Rust performance.
- **Pipeline scripts** — Drop-in replacement for BioPython with 10–30x speedups.
- **Data science** — Combine with pandas, scikit-learn, and seaborn workflows.
