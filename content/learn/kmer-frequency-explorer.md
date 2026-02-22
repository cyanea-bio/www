+++
title = "K-mer Frequency Explorer"
description = "Decompose a DNA sequence into k-mers and visualize their frequency distribution. Explore how k-mer size affects genome assembly and sequence comparison."
weight = 2
template = "learn-page.html"

[extra]
difficulty = "Beginner"
difficulty_level = "beginner"
duration = "~10 min"
domain = "Sequence Analysis"
crates = ["cyanea-seq"]
papers = 3
badge = "Interactive"
preview_label = "K-mer spectrum"
tags = ["Sequence Analysis", "Genomics"]
+++

## What Are K-mers?

A k-mer is a substring of length *k* extracted from a longer sequence. For a DNA sequence of length *L*, there are *L − k + 1* overlapping k-mers. Despite their simplicity, k-mer counts are the foundation of many modern bioinformatics tools — from genome assemblers to metagenomic classifiers.

This simulation lets you paste or generate a DNA sequence, choose a value of *k*, and immediately see the resulting frequency spectrum.

## What You'll Explore

- **Adjust k** from 1 to 12 and watch how the frequency histogram changes shape. Small values of *k* produce few distinct k-mers with high counts; large values produce many distinct k-mers that mostly appear once.
- **Load different sequences** — a bacterial genome, a human exon, or a random string — and compare their k-mer spectra. Real genomes have distinctive spectral shapes due to codon usage bias and repetitive elements.
- **Identify repeats** by looking for k-mers with unexpectedly high frequency. Transposable elements, tandem repeats, and low-complexity regions all leave signatures in the spectrum.
- **Explore GC content** through dinucleotide (k = 2) frequencies, which vary dramatically across species and even within a single chromosome.

## Key Concepts

### The K-mer Spectrum

A k-mer frequency spectrum plots the number of distinct k-mers (y-axis) that occur exactly *f* times (x-axis). In a typical genome, the spectrum has a large peak near the average sequencing depth, a smaller peak at double that depth (representing diploid heterozygosity or repeats), and a long tail of high-frequency repetitive k-mers. Sequencing errors appear as a spike at frequency 1.

### Applications

**Genome assembly.** De Bruijn graph assemblers (Velvet, SPAdes, MEGAHIT) build a graph where each node is a k-mer and edges connect k-mers that overlap by *k − 1* bases. The choice of *k* is a trade-off: smaller *k* values give better connectivity but more ambiguity; larger values resolve repeats but require higher coverage.

**Taxonomic classification.** Tools like Kraken2 assign each read to a taxon by looking up its k-mers in a reference database. Because k-mer lookup is an O(1) hash operation, this is orders of magnitude faster than alignment-based approaches.

**Sequence comparison.** The Jaccard index or cosine similarity between two k-mer frequency vectors provides an alignment-free estimate of sequence similarity, useful for building rough phylogenies or detecting contamination.

## Background Reading

1. Compeau, P. E. C., Pevzner, P. A. & Tesler, G. (2011). How to apply de Bruijn graphs to genome assembly. *Nature Biotechnology*, 29(11), 987–991.
2. Marçais, G. & Kingsford, C. (2011). A fast, lock-free approach for efficient parallel counting of occurrences of k-mers. *Bioinformatics*, 27(6), 764–770.
3. Wood, D. E., Lu, J. & Langmead, B. (2019). Improved metagenomic analysis with Kraken 2. *Genome Biology*, 20, 257.
