+++
title = "Phylogenetic Tree Builder"
description = "Build phylogenetic trees from sequence data using distance-based methods. Compare neighbor-joining and UPGMA, and explore how distance metrics affect tree topology."
weight = 4
template = "learn-page.html"

[extra]
difficulty = "Intermediate"
difficulty_level = "intermediate"
duration = "~20 min"
domain = "Phylogenetics"
crates = ["cyanea-phylo"]
papers = 3
badge = "Interactive"
preview_label = "Neighbor-joining tree"
tags = ["Phylogenetics", "Evolution"]
+++

## Reading the Tree of Life

A phylogenetic tree is a branching diagram that represents the evolutionary relationships among a set of organisms or sequences. Internal nodes represent common ancestors, branch lengths represent evolutionary distance, and the topology encodes the order in which lineages diverged.

This simulation lets you build trees from sequence data step by step, choosing between distance-based methods and watching the tree take shape as clusters merge.

## What You'll Explore

- **Compute a distance matrix** from a set of aligned sequences using different models of evolution (Jukes-Cantor, Kimura 2-parameter, or raw p-distance). See how the choice of model affects pairwise distances, especially for divergent sequences where multiple substitutions at the same site become likely.
- **Build a UPGMA tree** (Unweighted Pair Group Method with Arithmetic Mean). UPGMA assumes a constant rate of evolution across all lineages — a molecular clock. This produces an ultrametric tree where all tips are equidistant from the root.
- **Build a neighbor-joining tree.** Neighbor-joining does not assume a molecular clock, so branch lengths can vary across lineages. It works by iteratively joining the pair of nodes that minimises the total tree length. This makes it more accurate than UPGMA for most real datasets.
- **Compare topologies** side by side. Load a set of primate mitochondrial sequences and see where UPGMA and neighbor-joining agree and where they diverge.

## Key Concepts

### Distance Models

Raw p-distance (the fraction of sites that differ) underestimates true evolutionary distance because it ignores multiple substitutions at the same site. Correction models account for this:

- **Jukes-Cantor** assumes all substitutions are equally likely. The corrected distance is *d = −(3/4) ln(1 − 4p/3)*.
- **Kimura 2-parameter** distinguishes transitions (purine↔purine, pyrimidine↔pyrimidine) from transversions (purine↔pyrimidine), since transitions are typically more common.

### UPGMA

UPGMA builds the tree bottom-up. At each step, it finds the two clusters with the smallest average distance, merges them into a new node, and sets the node height to half the distance. It then recalculates distances from the new cluster to all remaining clusters. The result is a rooted, ultrametric tree.

The molecular clock assumption is its main limitation: if one lineage evolves faster than another, UPGMA will place it too close to the root, distorting the topology.

### Neighbor-Joining

Neighbor-joining also works bottom-up but uses a correction term that accounts for the average divergence of each node from all other nodes. This makes it consistent under a wider range of evolutionary models. The resulting tree is unrooted — you must specify an outgroup or use midpoint rooting to place the root.

Neighbor-joining runs in O(n³) time and O(n²) space, making it practical for hundreds to a few thousand sequences.

## Background Reading

1. Saitou, N. & Nei, M. (1987). The neighbor-joining method: a new method for reconstructing phylogenetic trees. *Molecular Biology and Evolution*, 4(4), 406–425.
2. Felsenstein, J. (2004). *Inferring Phylogenies*. Sinauer Associates.
3. Kimura, M. (1980). A simple method for estimating evolutionary rates of base substitutions through comparative studies of nucleotide sequences. *Journal of Molecular Evolution*, 16(2), 111–120.
