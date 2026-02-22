+++
title = "Protein Structure Viewer"
description = "Explore protein structures in 3D. Toggle between cartoon, ball-and-stick, and surface representations. Color by secondary structure, residue type, or B-factor."
weight = 5
template = "learn-page.html"

[extra]
difficulty = "Beginner"
difficulty_level = "beginner"
duration = "~10 min"
domain = "Structural Biology"
crates = ["cyanea-struct"]
papers = 2
badge = "Interactive"
badge_extra = "Popular"
preview_label = "3D protein fold"
tags = ["Structural Biology", "PDB"]
+++

## Seeing Proteins in Three Dimensions

Proteins are not flat sequences of amino acids — they fold into intricate three-dimensional shapes that determine their function. An enzyme's active site, an antibody's binding pocket, and a channel's pore are all defined by the precise spatial arrangement of atoms. Understanding structure is key to understanding how proteins work, how mutations cause disease, and how drugs bind their targets.

This simulation lets you load a protein structure from the Protein Data Bank (PDB) and explore it interactively in your browser.

## What You'll Explore

- **Representation modes.** Switch between cartoon (showing secondary structure elements), ball-and-stick (showing individual atoms and bonds), and surface (showing the solvent-accessible envelope). Each view highlights different aspects of the structure.
- **Color schemes.** Color by secondary structure (helices in red, sheets in blue, loops in grey), by residue type (hydrophobic, polar, charged), by chain, or by B-factor (a measure of atomic mobility — high B-factors indicate flexible regions).
- **Select and inspect residues.** Click on any residue to see its name, number, chain, and the atoms it contains. Measure distances between atoms to understand hydrogen bonds, salt bridges, and disulfide bonds.
- **Compare wild-type and mutant structures** side by side to see how a single amino acid change can alter the fold.

## Key Concepts

### Levels of Protein Structure

- **Primary structure** is the amino acid sequence.
- **Secondary structure** refers to local folding patterns: alpha-helices (stabilised by i → i+4 backbone hydrogen bonds) and beta-sheets (stabilised by hydrogen bonds between adjacent strands).
- **Tertiary structure** is the complete 3D fold of a single polypeptide chain, driven by hydrophobic packing, disulfide bonds, salt bridges, and van der Waals interactions.
- **Quaternary structure** describes the arrangement of multiple polypeptide chains (subunits) in a multi-chain complex.

### The Protein Data Bank

The PDB is the global archive of experimentally determined 3D structures of biological macromolecules. Each entry is identified by a four-character code (e.g., 1MBO for myoglobin). Structures are determined by X-ray crystallography, cryo-electron microscopy, or NMR spectroscopy. As of 2025, the PDB contains over 220,000 structures.

### B-factors

The B-factor (or temperature factor) of an atom reflects how much its position varies across the copies in a crystal or the frames in a cryo-EM reconstruction. High B-factors indicate flexibility or disorder. Active-site loops and terminal residues often have the highest B-factors, while the hydrophobic core is typically rigid.

## Background Reading

1. Berman, H. M. et al. (2000). The Protein Data Bank. *Nucleic Acids Research*, 28(1), 235–242.
2. Richardson, J. S. (1981). The anatomy and taxonomy of protein structure. *Advances in Protein Chemistry*, 34, 167–339.
