+++
title = "DNA Transcription"
description = "Watch a DNA sequence get transcribed into mRNA and translated into a protein chain. Adjust codons and see how mutations change the output in real time."
weight = 1
template = "learn-page.html"

[extra]
difficulty = "Beginner"
difficulty_level = "beginner"
duration = "~10 min"
domain = "Molecular Biology"
crates = ["cyanea-seq"]
papers = 2
badge = "Interactive"
preview_label = "DNA → mRNA → Protein"
tags = ["Molecular Biology", "Central Dogma"]
+++

## The Central Dogma

The central dogma of molecular biology describes how genetic information flows from DNA to RNA to protein. This simulation lets you follow each step of that process interactively.

**Transcription** is the first step: an enzyme called RNA polymerase reads a template strand of DNA and synthesizes a complementary messenger RNA (mRNA) molecule. Each adenine (A) in the DNA pairs with uracil (U) in the RNA, while cytosine (C) pairs with guanine (G), and vice versa. The resulting mRNA is a portable copy of the gene that can leave the nucleus.

**Translation** is the second step: ribosomes read the mRNA three nucleotides at a time. Each triplet — called a codon — maps to a specific amino acid according to the genetic code. The chain of amino acids folds into a functional protein.

## What You'll Explore

- **Edit a DNA sequence** and watch the mRNA and protein update in real time.
- **Introduce point mutations** (substitutions, insertions, deletions) and observe whether they are silent, missense, or nonsense.
- **Compare codon usage** across organisms to see why the same amino acid can be encoded by different triplets.
- **Trace the reading frame** to understand how a single insertion can shift every downstream codon.

## Key Concepts

### The Genetic Code

The standard genetic code maps 64 codons to 20 amino acids plus a stop signal. It is highly degenerate — most amino acids are specified by more than one codon. For example, leucine has six codons (UUA, UUG, CUU, CUC, CUA, CUG). This redundancy provides a buffer against point mutations: many single-nucleotide changes at the third codon position are silent.

### Mutations and Their Effects

A **synonymous (silent) mutation** changes a codon without changing the amino acid. A **missense mutation** substitutes one amino acid for another — the effect on protein function depends on how chemically different the two residues are. A **nonsense mutation** introduces a premature stop codon, truncating the protein, which is almost always deleterious.

**Frameshift mutations** — insertions or deletions that are not multiples of three — are the most disruptive because they alter every codon downstream of the mutation site.

## Background Reading

1. Crick, F. (1970). Central dogma of molecular biology. *Nature*, 227, 561–563.
2. Nirenberg, M. & Matthaei, J. H. (1961). The dependence of cell-free protein synthesis in *E. coli* upon naturally occurring or synthetic polyribonucleotides. *PNAS*, 47(10), 1588–1602.
