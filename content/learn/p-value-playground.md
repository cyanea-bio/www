+++
title = "p-value Playground"
description = "Simulate experiments and watch p-value distributions form. Explore the effects of sample size, effect size, and multiple testing on statistical significance."
weight = 7
template = "learn-page.html"

[extra]
difficulty = "Beginner"
difficulty_level = "beginner"
duration = "~10 min"
domain = "Statistics"
crates = ["cyanea-stats"]
papers = 2
badge = "Interactive"
badge_extra = "New"
preview_label = "Distribution tails"
tags = ["Statistics", "Hypothesis Testing"]
+++

## What Is a p-value?

A p-value is the probability of observing a test statistic as extreme as — or more extreme than — the one computed from your data, assuming the null hypothesis is true. It is *not* the probability that the null hypothesis is true, nor the probability that your result occurred by chance. This distinction is subtle but critical, and misinterpretation of p-values is one of the most persistent problems in scientific research.

This simulation lets you run thousands of virtual experiments and watch the resulting p-value distributions take shape, building intuition for what statistical significance actually means.

## What You'll Explore

- **Simulate under the null hypothesis.** When there is no real effect, p-values are uniformly distributed between 0 and 1. Run 10,000 simulations and watch the histogram flatten — about 5% of experiments will produce p < 0.05 by chance alone.
- **Simulate with a real effect.** Introduce a true difference between groups and observe how the p-value distribution shifts leftward. The proportion of p-values below 0.05 is the statistical power of the test.
- **Adjust sample size.** Increase the number of observations per group and watch power climb. Small samples make it nearly impossible to detect modest effects; large samples can detect effects so tiny they are biologically meaningless.
- **Explore multiple testing.** Run 20 simultaneous tests under the null and see how often at least one produces p < 0.05 (spoiler: about 64% of the time). Then apply Bonferroni and Benjamini-Hochberg corrections and compare the results.

## Key Concepts

### Null Hypothesis Significance Testing

The framework is straightforward: state a null hypothesis (e.g., "the two group means are equal"), collect data, compute a test statistic, and convert it to a p-value. If *p < α* (typically 0.05), reject the null. The test does not tell you the size of the effect or whether it matters — only whether the data are surprising under the null.

### Statistical Power

Power is the probability of correctly rejecting the null hypothesis when a real effect exists. It depends on three factors: the effect size (larger effects are easier to detect), the sample size (more data means more precision), and the significance threshold α (more lenient thresholds increase power but also increase false positives).

A commonly cited target is 80% power, meaning you will detect the effect in 4 out of 5 experiments.

### The Multiple Testing Problem

If you test 20 independent hypotheses at α = 0.05, the probability of at least one false positive is 1 − 0.95²⁰ ≈ 0.64. Corrections address this:

- **Bonferroni** divides α by the number of tests. It is conservative — it controls the family-wise error rate but reduces power.
- **Benjamini-Hochberg** controls the false discovery rate (FDR) — the expected proportion of rejected hypotheses that are false positives. It is less conservative and widely used in genomics, where thousands of genes are tested simultaneously.

## Background Reading

1. Wasserstein, R. L. & Lazar, N. A. (2016). The ASA statement on p-values: context, process, and purpose. *The American Statistician*, 70(2), 129–133.
2. Benjamini, Y. & Hochberg, Y. (1995). Controlling the false discovery rate: a practical and powerful approach to multiple testing. *Journal of the Royal Statistical Society B*, 57(1), 289–300.
