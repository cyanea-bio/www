+++
title = "Small Molecule Explorer"
description = "Draw or load small molecules, compute descriptors, and compare fingerprint similarity. Learn how cheminformatics methods underpin drug discovery pipelines."
weight = 6
template = "learn-page.html"

[extra]
difficulty = "Intermediate"
difficulty_level = "intermediate"
duration = "~15 min"
domain = "Structural Biology"
crates = ["cyanea-chem"]
papers = 3
badge = "Interactive"
preview_label = "Molecular fingerprints"
tags = ["Structural Biology", "Cheminformatics"]
+++

## Chemistry Meets Computation

Cheminformatics applies computational methods to chemical data. At the heart of the field is a simple question: how do you represent a molecule in a form that a computer can reason about? The answer — molecular descriptors and fingerprints — enables virtual screening of millions of compounds, similarity searching in chemical databases, and quantitative predictions of drug-like properties.

This simulation lets you draw molecules, compute their descriptors, and compare them using fingerprint similarity.

## What You'll Explore

- **Draw a molecule** using a 2D sketcher or enter a SMILES string. SMILES (Simplified Molecular-Input Line-Entry System) is a compact text notation for molecular structure — for example, `c1ccccc1` represents benzene and `CC(=O)Oc1ccccc1C(=O)O` represents aspirin.
- **Compute molecular descriptors** including molecular weight, LogP (a measure of lipophilicity), number of hydrogen bond donors and acceptors, polar surface area, and rotatable bond count. These properties determine whether a molecule can be absorbed orally — Lipinski's Rule of Five provides a rough filter.
- **Generate fingerprints.** Morgan fingerprints (also called ECFP) encode the local chemical environment around each atom as a fixed-length bit vector. Two molecules with similar fingerprints tend to have similar biological activity — this is the "similar property principle."
- **Compare molecules** using Tanimoto similarity, the standard metric for fingerprint comparison. A Tanimoto coefficient above 0.85 generally indicates high structural similarity; below 0.5 suggests the molecules are quite different.

## Key Concepts

### Molecular Representations

A molecule can be represented at many levels of abstraction:

- **SMILES** — a text string that encodes atoms, bonds, rings, and stereochemistry.
- **Molecular graph** — an undirected graph where nodes are atoms and edges are bonds.
- **3D coordinates** — the spatial positions of all atoms, determined by experiment or computational prediction.
- **Fingerprints** — fixed-length binary or count vectors that summarise structural features.

### Lipinski's Rule of Five

Christopher Lipinski observed that most orally bioavailable drugs satisfy four criteria: molecular weight ≤ 500, LogP ≤ 5, hydrogen bond donors ≤ 5, and hydrogen bond acceptors ≤ 10. These rules are not absolute — many approved drugs violate them — but they are a useful first filter in early-stage drug discovery.

### Tanimoto Similarity

For two binary fingerprints A and B, the Tanimoto coefficient is defined as |A ∩ B| / |A ∪ B| — the number of bits set in both, divided by the number set in either. It ranges from 0 (no bits in common) to 1 (identical fingerprints). Because it ignores bits that are off in both fingerprints, it is robust to the choice of fingerprint length.

## Background Reading

1. Lipinski, C. A. et al. (2001). Experimental and computational approaches to estimate solubility and permeability in drug discovery and development settings. *Advanced Drug Delivery Reviews*, 46(1–3), 3–26.
2. Rogers, D. & Hahn, M. (2010). Extended-connectivity fingerprints. *Journal of Chemical Information and Modeling*, 50(5), 742–754.
3. Weininger, D. (1988). SMILES, a chemical language and information system. *Journal of Chemical Information and Computer Sciences*, 28(1), 31–36.
