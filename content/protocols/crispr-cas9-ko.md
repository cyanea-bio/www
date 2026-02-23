+++
title = "CRISPR-Cas9 Knockout"
description = "Gene knockout using CRISPR-Cas9 ribonucleoprotein delivery in mammalian cells."
template = "protocol-page.html"

[extra]
demo = true
org = "broad-institute"
forks = "1,429"
likes = "534"
steps = 18
duration = "~5 days"
difficulty = "Advanced"
difficulty_level = "advanced"
category = "Molecular Biology"
version = "2.1"
tags = ["CRISPR", "Cas9", "gene editing", "knockout", "RNP"]
materials = [
    "Alt-R S.p. Cas9 Nuclease V3 (IDT, cat. 1081058)",
    "Alt-R CRISPR-Cas9 crRNA (custom design, IDT)",
    "Alt-R CRISPR-Cas9 tracrRNA (IDT, cat. 1072532)",
    "Nuclease-free Duplex Buffer (IDT)",
    "Neon Transfection System (Invitrogen)",
    "T7 Endonuclease I (NEB, cat. M0302)",
    "Genomic DNA extraction kit",
]
+++

This protocol covers CRISPR-Cas9-mediated gene knockout in mammalian cell lines using ribonucleoprotein (RNP) delivery. RNP electroporation offers advantages over plasmid-based approaches including reduced off-target effects, no risk of genomic integration, and faster editing kinetics.

## Overview

The workflow spans guide RNA design and validation, RNP complex assembly, electroporation into target cells, clonal expansion, and genotyping to confirm knockout. Typical editing efficiencies of 70–90% are achievable at most loci, with successful biallelic knockout rates of 30–60%.

## Key considerations

- **Guide design**: Use 2–3 guides per target gene; select guides with high on-target scores and minimal off-target predictions
- **Cell type optimization**: Electroporation parameters vary by cell line; optimize pulse conditions before scaling
- **Timing**: Day 1: RNP assembly + electroporation; Days 2–4: recovery; Day 5+: genotyping and clonal isolation
- **Validation**: Confirm knockout at both DNA (T7E1 assay, Sanger sequencing) and protein (Western blot) levels
