+++
title = "cyanea-chem"
description = "Chemical informatics — SMILES parsing, molecular fingerprints, Tanimoto similarity, substructure search, SDF parsing, and molecular property calculation."
weight = 8

[extra]
version = "0.2.0"
layer = "I/O"
badge = "featured"
tagline = "Cheminformatics in the browser, from SMILES to fingerprints."
wasm_module = "cyanea_wasm"
has_playground = true
license = "Apache-2.0"
source_url = "https://github.com/cyanea-bio/labs/tree/main/cyanea-chem"
docs_url = "https://docs.cyanea.bio/rust/chem/"
registry_url = "https://crates.io/crates/cyanea-chem"
registry_name = "crates.io"
depends_on = ["cyanea-core"]
depended_by = ["cyanea-wasm"]
tags = ["Chemistry", "SMILES", "Fingerprints", "Tanimoto", "Substructure"]
functions = [
    { name = "smiles_properties", sig = "(smiles: &str) -> JSON", desc = "Compute molecular properties (MW, LogP, HBA, HBD, TPSA)" },
    { name = "canonical", sig = "(smiles: &str) -> String", desc = "Canonicalize a SMILES string" },
    { name = "smiles_fingerprint", sig = "(smiles, radius, bits) -> JSON", desc = "Compute Morgan/ECFP circular fingerprint" },
    { name = "tanimoto", sig = "(smi1, smi2: &str) -> f64", desc = "Tanimoto similarity between two molecules" },
    { name = "smiles_substructure", sig = "(mol, pattern: &str) -> bool", desc = "SMARTS substructure search" },
    { name = "parse_sdf", sig = "(text: &str) -> JSON", desc = "Parse SDF/MOL file into structured records" },
    { name = "maccs_fingerprint", sig = "(smiles: &str) -> JSON", desc = "Compute 166-bit MACCS structural keys" },
]
+++

## Overview

`cyanea-chem` brings cheminformatics to the Cyanea ecosystem. It parses SMILES strings into molecular graphs, computes physicochemical properties (molecular weight, LogP, polar surface area, hydrogen bond donors/acceptors), generates circular fingerprints (Morgan/ECFP) and MACCS keys, and supports Tanimoto similarity search and SMARTS substructure matching.

All operations run in-browser via WASM, enabling interactive molecular exploration without server-side chemistry toolkits.

## Key Concepts

### SMILES

SMILES (Simplified Molecular-Input Line-Entry System) is a compact string notation for molecules. For example, `c1ccccc1` is benzene and `CC(=O)Oc1ccccc1C(=O)O` is aspirin. `canonical` produces a unique, deterministic SMILES for any input, making string comparison equivalent to molecular identity.

### Molecular Fingerprints

Fingerprints encode molecular substructure into fixed-length bit vectors. Morgan fingerprints (ECFP) enumerate circular substructures at each atom up to a given radius; MACCS keys check for 166 predefined structural patterns. Fingerprints enable fast similarity search over large compound libraries.

### Tanimoto Similarity

The Tanimoto coefficient measures the overlap between two fingerprints: |A ∩ B| / |A ∪ B|. A value of 1.0 means identical substructure sets; 0.0 means no overlap. It is the standard metric for virtual screening and compound clustering.

### Substructure Search

SMARTS patterns extend SMILES with wildcards and logic operators for substructure matching. `smiles_substructure("CC(=O)Oc1ccccc1C(=O)O", "[CX3](=O)[OX2H1]")` checks whether aspirin contains a carboxylic acid group.

## Code Examples

### Rust

```rust
use cyanea_chem::{smiles_properties, tanimoto, canonical};

let props = smiles_properties("CC(=O)Oc1ccccc1C(=O)O")?;
let sim = tanimoto("c1ccccc1", "c1ccc(O)cc1")?;
let canon = canonical("OC1=CC=CC=C1")?; // → "Oc1ccccc1"
```

### Python

```python
import cyanea

props = cyanea.smiles_properties("CC(=O)Oc1ccccc1C(=O)O")
sim = cyanea.tanimoto("c1ccccc1", "c1ccc(O)cc1")
```

### JavaScript (WASM)

```javascript
import { smiles_properties, tanimoto, canonical } from '/wasm/cyanea_wasm.js';

const props = JSON.parse(smiles_properties("CC(=O)Oc1ccccc1C(=O)O"));
const sim = JSON.parse(tanimoto("c1ccccc1", "c1ccc(O)cc1"));
```

## Use Cases

- **Virtual screening** — Rank a compound library by Tanimoto similarity to a lead molecule.
- **Property filters** — Apply Lipinski's Rule of Five using computed MW, LogP, HBA, HBD.
- **SAR analysis** — Check which analogs contain a pharmacophore via substructure search.
- **Data curation** — Canonicalize SMILES to deduplicate compound databases.
