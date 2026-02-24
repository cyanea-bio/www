+++
title = "cyanea-struct"
description = "Biological structure handling — PDB/mmCIF parsing, secondary structure annotation, contact maps, RMSD calculation, and Ramachandran analysis."
weight = 9

[extra]
version = "0.1.7"
layer = "I/O"
badge = "new"
tagline = "Parse, analyze, and compare 3D biological structures."
wasm_module = "cyanea_wasm"
has_playground = true
license = "Apache-2.0"
source_url = "https://github.com/cyanea-io/cyanea/tree/main/cyanea-struct"
docs_url = "/docs"
registry_url = "https://crates.io"
registry_name = "crates.io"
depends_on = ["cyanea-core"]
depended_by = ["cyanea-wasm"]
tags = ["Structure", "PDB", "mmCIF", "DSSP", "Contact Map", "Ramachandran"]
functions = [
    { name = "pdb_info", sig = "(pdb_text: &str) -> JSON", desc = "Extract chains, residues, atoms, and metadata from PDB" },
    { name = "pdb_secondary_structure", sig = "(pdb_text: &str) -> JSON", desc = "Assign secondary structure (helix, sheet, coil)" },
    { name = "rmsd", sig = "(coords1, coords2: JSON) -> f64", desc = "Root-mean-square deviation between coordinate sets" },
    { name = "contact_map", sig = "(pdb_text, cutoff: f64) -> JSON", desc = "Residue-residue contact map at a distance cutoff" },
    { name = "ramachandran_analysis", sig = "(pdb_text: &str) -> JSON", desc = "Compute phi/psi dihedral angles for all residues" },
    { name = "parse_mmcif", sig = "(text: &str) -> JSON", desc = "Parse mmCIF structure files" },
    { name = "kabsch_align", sig = "(coords1, coords2: JSON) -> JSON", desc = "Optimal rigid-body superposition (Kabsch algorithm)" },
]
+++

## Overview

`cyanea-struct` handles 3D biological structure data. It parses PDB and mmCIF files into structured representations, assigns secondary structure elements (helix, sheet, coil), computes residue contact maps at arbitrary distance cutoffs, measures RMSD between structures, and extracts Ramachandran (phi/psi) dihedral angles for structure validation.

The Kabsch algorithm provides optimal rigid-body superposition of two coordinate sets, minimizing RMSD — useful for comparing predicted and experimental structures.

## Key Concepts

### PDB Format

The Protein Data Bank (PDB) format stores 3D coordinates of atoms in biological macromolecules. Each ATOM record contains the atom name, residue name, chain ID, residue number, and x/y/z coordinates. `pdb_info` extracts a structured summary: chains, residue count, atom count, resolution, and experimental method.

### Secondary Structure

Proteins fold into regular secondary structure elements: alpha helices, beta sheets, and connecting coils/loops. `pdb_secondary_structure` assigns these elements using the DSSP algorithm, which analyzes hydrogen bonding patterns in the backbone.

### Contact Maps

A contact map is a symmetric binary matrix where entry (i, j) is 1 if residues i and j are within a distance cutoff (typically 8 Å between Cα atoms). Contact maps capture the essential fold topology and are used for structure prediction evaluation.

### Ramachandran Analysis

The Ramachandran plot displays the backbone dihedral angles phi (φ) and psi (ψ) for each residue. Most residues fall in allowed regions (α-helix, β-sheet); outliers indicate strain or errors in the structure model.

## Code Examples

### Rust

```rust
use cyanea_struct::{pdb_info, contact_map, rmsd};

let info = pdb_info(pdb_text)?;
let contacts = contact_map(pdb_text, 8.0)?;
let deviation = rmsd(&coords1, &coords2)?;
```

### Python

```python
import cyanea

info = cyanea.pdb_info(open("1ubq.pdb").read())
contacts = cyanea.contact_map(pdb_text, cutoff=8.0)
rama = cyanea.ramachandran_analysis(pdb_text)
```

### JavaScript (WASM)

```javascript
import { pdb_info, contact_map, ramachandran_analysis } from '/wasm/cyanea_wasm.js';

const info = JSON.parse(pdb_info(pdbText));
const contacts = JSON.parse(contact_map(pdbText, 8.0));
const rama = JSON.parse(ramachandran_analysis(pdbText));
```

## Use Cases

- **Structure validation** — Ramachandran analysis to check model quality.
- **Fold comparison** — RMSD and contact map overlap between structures.
- **Structure prediction** — Evaluate AlphaFold models against experimental structures.
- **Drug discovery** — Identify binding-site residues from contact maps.
