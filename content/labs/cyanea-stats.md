+++
title = "cyanea-stats"
description = "Statistical computing for bioinformatics — descriptive stats, hypothesis testing, multiple testing correction, survival analysis, population genetics, and ecological diversity."
weight = 6

[extra]
version = "0.3.0"
layer = "Analysis"
badge = "popular"
tagline = "From t-tests to Tajima's D — statistics built for biology."
wasm_module = "cyanea_wasm"
has_playground = true
license = "Apache-2.0"
source_url = "https://github.com/cyanea-io/cyanea/tree/main/cyanea-stats"
docs_url = "/docs"
registry_url = "https://crates.io"
registry_name = "crates.io"
depends_on = ["cyanea-core"]
depended_by = ["cyanea-ml", "cyanea-omics", "cyanea-wasm"]
tags = ["Statistics", "Hypothesis Testing", "Survival Analysis", "Population Genetics", "Ecology"]
functions = [
    { name = "describe", sig = "(data: JSON) -> JSON", desc = "Descriptive statistics — mean, median, std, quartiles" },
    { name = "pearson", sig = "(x, y: JSON) -> JSON", desc = "Pearson correlation coefficient and p-value" },
    { name = "spearman", sig = "(x, y: JSON) -> JSON", desc = "Spearman rank correlation and p-value" },
    { name = "t_test", sig = "(data: JSON, mu: f64) -> JSON", desc = "One-sample t-test against a hypothesized mean" },
    { name = "mann_whitney_u", sig = "(x, y: JSON) -> JSON", desc = "Non-parametric Mann-Whitney U test" },
    { name = "bonferroni", sig = "(p: JSON) -> JSON", desc = "Bonferroni multiple testing correction" },
    { name = "benjamini_hochberg", sig = "(p: JSON) -> JSON", desc = "Benjamini-Hochberg FDR correction" },
    { name = "kaplan_meier", sig = "(times, status: JSON) -> JSON", desc = "Kaplan-Meier survival curve estimation" },
    { name = "wright_fisher", sig = "(N, freq, gen, seed) -> JSON", desc = "Wright-Fisher genetic drift simulation" },
    { name = "shannon_index", sig = "(counts: JSON) -> f64", desc = "Shannon diversity index" },
    { name = "tajimas_d", sig = "(S, n, pi) -> f64", desc = "Tajima's D test for neutrality" },
]
+++

## Overview

`cyanea-stats` is the statistical engine for the ecosystem. It covers four domains that are essential in bioinformatics:

1. **Descriptive statistics** — Summarize data distributions with mean, median, standard deviation, and quartiles.
2. **Hypothesis testing** — Parametric tests (t-test, Pearson) and non-parametric tests (Mann-Whitney, Spearman) with multiple testing correction (Bonferroni, Benjamini-Hochberg).
3. **Survival analysis** — Kaplan-Meier curves and log-rank tests for clinical and time-to-event data.
4. **Population genetics and ecology** — Wright-Fisher drift simulation, Tajima's D, Shannon and Simpson diversity indices, and F-statistics.

## Key Concepts

### Multiple Testing Correction

When testing thousands of genes for differential expression, the family-wise error rate explodes. Bonferroni controls the probability of any false positive (strict); Benjamini-Hochberg controls the false discovery rate (less strict, more powerful). Both accept a vector of p-values and return adjusted p-values.

### Kaplan-Meier Estimation

The Kaplan-Meier estimator produces a step-function survival curve from censored data. Each event (death, relapse) causes a step down; censored observations (patients lost to follow-up) are accounted for without introducing bias. The result includes survival probabilities and confidence intervals at each time point.

### Tajima's D

Tajima's D compares two estimators of the population mutation rate: the number of segregating sites (S) and the average number of pairwise differences (π). Under neutrality they should be equal. Departures indicate selection, population expansion, or bottleneck.

## Code Examples

### Rust

```rust
use cyanea_stats::{describe, t_test, kaplan_meier};

let summary = describe(&data);
let test = t_test(&data, 0.0);
let km = kaplan_meier(&times, &status);
```

### Python

```python
import cyanea

summary = cyanea.describe([2.1, 3.4, 5.6, 1.2, 4.3])
km = cyanea.kaplan_meier(times=[1,2,3,4,5], status=[1,0,1,1,0])
```

### JavaScript (WASM)

```javascript
import { describe, t_test, kaplan_meier, benjamini_hochberg } from '/wasm/cyanea_wasm.js';

const summary = JSON.parse(describe(JSON.stringify([2.1, 3.4, 5.6, 1.2, 4.3])));
const km = JSON.parse(kaplan_meier(JSON.stringify(times), JSON.stringify(status)));
```

## Use Cases

- **Differential expression** — Test thousands of genes, correct with BH, filter by adjusted p-value.
- **Clinical trials** — Estimate survival curves and compare treatment arms with log-rank tests.
- **Metagenomics** — Compute Shannon diversity across samples to measure community richness.
- **Population genetics** — Simulate drift with Wright-Fisher and test for selection with Tajima's D.
