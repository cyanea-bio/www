+++
title = "Pairwise Sequence Alignment"
description = "Step through Needleman-Wunsch and Smith-Waterman algorithms cell by cell. Adjust gap penalties and substitution matrices to see how alignment scores change."
weight = 3
template = "learn-page.html"

[extra]
difficulty = "Intermediate"
difficulty_level = "intermediate"
duration = "~20 min"
domain = "Sequence Analysis"
crates = ["cyanea-align"]
papers = 4
badge = "Interactive"
badge_extra = "Featured"
preview_label = "Dynamic programming matrix"
tags = ["Sequence Analysis", "Algorithms"]
+++

## Aligning Two Sequences

Sequence alignment is the most fundamental operation in bioinformatics. Given two DNA or protein sequences, the goal is to find the arrangement of characters — including insertions of gaps — that maximises a similarity score. The result reveals which residues are evolutionarily conserved, where insertions and deletions have occurred, and how closely related two sequences are.

This simulation lets you step through two classic dynamic programming algorithms cell by cell, watching the score matrix fill and the traceback path form.

## What You'll Explore

- **Needleman-Wunsch (global alignment)** aligns two sequences end to end. It is the right choice when you expect the sequences to be similar across their entire length — for example, two orthologous genes from closely related species.
- **Smith-Waterman (local alignment)** finds the highest-scoring subsequence alignment. It is better when you expect only a portion of each sequence to match — for example, finding a conserved domain inside a longer protein.
- **Substitution matrices.** Switch between BLOSUM62, BLOSUM45, and PAM250 to see how the matrix affects which residue pairs are considered similar. BLOSUM62 is tuned for moderately diverged sequences; BLOSUM45 favors more distant homologs.
- **Gap penalties.** Adjust the gap-open and gap-extend penalties to control how aggressively the algorithm introduces indels. Affine gap penalties (expensive to open, cheap to extend) produce biologically more realistic alignments than linear penalties.

## Key Concepts

### Dynamic Programming

Both algorithms fill an *(m+1) × (n+1)* matrix *F* where *F[i][j]* holds the best score for aligning the first *i* characters of sequence A with the first *j* characters of sequence B. Each cell is computed from three neighbours:

- **Diagonal** (*F[i-1][j-1] + s(a_i, b_j)*): align two characters.
- **Up** (*F[i-1][j] + gap penalty*): insert a gap in sequence B.
- **Left** (*F[i][j-1] + gap penalty*): insert a gap in sequence A.

Needleman-Wunsch initialises the first row and column with cumulative gap penalties and traces back from the bottom-right corner. Smith-Waterman initialises with zeros, clamps negative scores to zero, and traces back from the cell with the maximum score.

### Scoring Matrices

A substitution matrix defines the score for aligning each pair of residues. BLOSUM (Blocks Substitution Matrix) matrices are derived from observed amino acid substitutions in conserved protein blocks. The number after BLOSUM indicates the clustering threshold: BLOSUM62 was built from blocks where sequences share at most 62% identity. Lower numbers (BLOSUM45) capture more distant evolutionary relationships.

### Affine Gap Penalties

A simple linear penalty assigns the same cost to every gap position. An affine model uses two parameters: a gap-open penalty *d* and a gap-extend penalty *e* (where *e < d*). This reflects biology: a single mutational event can insert or delete several residues at once, so a long contiguous gap should cost less than many scattered single-residue gaps.

## Background Reading

1. Needleman, S. B. & Wunsch, C. D. (1970). A general method applicable to the search for similarities in the amino acid sequence of two proteins. *Journal of Molecular Biology*, 48(3), 443–453.
2. Smith, T. F. & Waterman, M. S. (1981). Identification of common molecular subsequences. *Journal of Molecular Biology*, 147(1), 195–197.
3. Henikoff, S. & Henikoff, J. G. (1992). Amino acid substitution matrices from protein blocks. *PNAS*, 89(22), 10915–10919.
4. Gotoh, O. (1982). An improved algorithm for matching biological sequences. *Journal of Molecular Biology*, 162(3), 705–708.
