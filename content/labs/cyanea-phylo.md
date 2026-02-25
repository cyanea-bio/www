+++
title = "cyanea-phylo"
description = "Phylogenetic tree construction and manipulation — Newick/Nexus parsing, distance matrices, UPGMA, neighbor-joining, Robinson-Foulds distance, and evolutionary simulation."
weight = 10

[extra]
version = "0.2.6"
layer = "Analysis"
badge = "popular"
tagline = "Build, compare, and simulate phylogenetic trees."
wasm_module = "cyanea_wasm"
has_playground = true
license = "Apache-2.0"
source_url = "https://github.com/cyanea-bio/labs/tree/main/cyanea-phylo"
docs_url = "https://docs.cyanea.bio/rust/phylo/"
registry_url = "https://crates.io/crates/cyanea-phylo"
registry_name = "crates.io"
depends_on = ["cyanea-core"]
depended_by = ["cyanea-wasm"]
tags = ["Phylogenetics", "Newick", "UPGMA", "Neighbor-Joining", "Evolution"]
functions = [
    { name = "newick_info", sig = "(newick: &str) -> JSON", desc = "Parse a Newick tree and extract statistics" },
    { name = "evolutionary_distance", sig = "(seq1, seq2, model) -> JSON", desc = "Compute pairwise evolutionary distance (JC69, K2P)" },
    { name = "build_upgma", sig = "(labels, matrix: JSON) -> String", desc = "Build a UPGMA tree from a distance matrix" },
    { name = "build_nj", sig = "(labels, matrix: JSON) -> String", desc = "Build a neighbor-joining tree from a distance matrix" },
    { name = "rf_distance", sig = "(tree1, tree2: &str) -> u32", desc = "Robinson-Foulds distance between two trees" },
    { name = "simulate_evolution", sig = "(newick, len, model, seed) -> JSON", desc = "Simulate sequence evolution along a tree" },
    { name = "simulate_coalescent", sig = "(n, pop_size, seed) -> String", desc = "Simulate a coalescent genealogy" },
]
+++

## Overview

`cyanea-phylo` covers the full phylogenetic workflow: compute pairwise evolutionary distances between sequences, build trees using UPGMA or neighbor-joining, parse and emit Newick/Nexus formats, compare trees with Robinson-Foulds distance, and simulate sequence evolution or coalescent genealogies.

## Key Concepts

### Distance Models

Evolutionary distance corrects observed differences for multiple substitutions at the same site. The Jukes-Cantor model (JC69) assumes equal substitution rates; the Kimura 2-parameter model (K2P) distinguishes transitions from transversions. `evolutionary_distance` supports both.

### Tree Building

**UPGMA** (Unweighted Pair Group Method with Arithmetic Mean) assumes a molecular clock — all taxa evolve at the same rate. It produces ultrametric (clock-like) trees. **Neighbor-joining** (NJ) does not assume a clock and generally produces more accurate trees for real-world data.

Both algorithms take a distance matrix and a list of taxon labels and return a Newick string.

### Robinson-Foulds Distance

The RF distance counts the number of bipartitions (splits) present in one tree but not the other. It equals zero when the two trees have identical topology (branch lengths are ignored). It is the most widely used metric for comparing phylogenetic trees.

### Simulation

`simulate_evolution` takes a guide tree and evolves sequences along its branches according to a substitution model, producing an alignment of simulated sequences at the tips. `simulate_coalescent` generates random genealogies under the Wright-Fisher neutral model.

## Code Examples

### Rust

```rust
use cyanea_phylo::{evolutionary_distance, build_nj, rf_distance, Model};

let dist = evolutionary_distance("ACGTACGT", "ACGAACGT", Model::K2P)?;
let tree = build_nj(&labels, &matrix)?;
let rf = rf_distance("((A,B),(C,D));", "((A,C),(B,D));")?;
```

### Python

```python
import cyanea

tree = cyanea.build_nj(labels=["A","B","C","D"], matrix=[[0,1,2,3],[1,0,2,3],[2,2,0,1],[3,3,1,0]])
rf = cyanea.rf_distance("((A,B),(C,D));", "((A,C),(B,D));")
```

### JavaScript (WASM)

```javascript
import { build_nj, rf_distance, simulate_evolution } from '/wasm/cyanea_wasm.js';

const tree = JSON.parse(build_nj(JSON.stringify(labels), JSON.stringify(matrix)));
const rf = JSON.parse(rf_distance("((A,B),(C,D));", "((A,C),(B,D));"));
```

## Use Cases

- **Molecular phylogenetics** — Build gene trees from aligned sequences.
- **Species delimitation** — Compare gene trees with species trees via RF distance.
- **Simulation studies** — Generate test data with known evolutionary history.
- **Ancestral reconstruction** — Simulate mutations along a tree to study convergent evolution.
