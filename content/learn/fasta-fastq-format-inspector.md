+++
title = "FASTA/FASTQ Format Inspector"
description = "Dissect bioinformatics file formats byte by byte. Learn how headers, sequences, and quality scores are structured, and validate files against the specification."
weight = 9
template = "learn-page.html"

[extra]
difficulty = "Beginner"
difficulty_level = "beginner"
duration = "~5 min"
domain = "Data Formats"
crates = ["cyanea-io"]
papers = 1
badge = "Interactive"
preview_label = "Format anatomy"
tags = ["Data Formats", "Parsing"]
+++

## The Languages of Sequence Data

Before you can align, assemble, or analyse a genome, you need to read the data. FASTA and FASTQ are the two most common file formats in bioinformatics — nearly every sequencing instrument, database, and analysis tool reads or writes one of them. Understanding their structure is a prerequisite for debugging pipelines, writing parsers, and catching data corruption.

This simulation lets you paste or upload a file and see its anatomy highlighted byte by byte.

## What You'll Explore

- **FASTA anatomy.** Each record starts with a header line beginning with `>`, followed by one or more lines of sequence. The header typically contains an identifier and an optional description separated by a space. There is no formal specification for what goes in the header — different tools and databases use different conventions.
- **FASTQ anatomy.** Each record has exactly four lines: a header starting with `@`, a sequence line, a separator line starting with `+`, and a quality line. The quality line encodes a per-base quality score as an ASCII character. Each character maps to a Phred score: *Q = −10 log₁₀(P)*, where *P* is the probability that the base call is wrong.
- **Quality score encoding.** Toggle between Phred+33 (Sanger/Illumina 1.8+) and Phred+64 (older Illumina) and see how the same ASCII characters map to different quality values. A Phred score of 30 means a 1 in 1,000 chance of error; 40 means 1 in 10,000.
- **Validate a file.** The inspector checks for common problems: inconsistent line lengths, invalid characters in the sequence, quality lines that don't match the sequence length, and mixed line endings.

## Key Concepts

### FASTA Format

FASTA is the simpler of the two formats. A minimal record looks like this:

```
>seq1 Human hemoglobin alpha
MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSH
```

Sequences can span multiple lines (typically wrapped at 60 or 80 characters). Multi-FASTA files contain multiple records concatenated together. The format is used for both nucleotide and protein sequences — the alphabet is the only difference.

### FASTQ Format

FASTQ extends FASTA by adding per-base quality scores. A single record:

```
@SEQ_ID
GATTTGGGGTTCAAAGCAGTATCGATCAAATAGTAAATCCATTTGTTCAACTCACAGTTT
+
!''*((((***+))%%%++)(%%%%).1***-+*''))**55CCF>>>>>>CCCCCCC65
```

The `+` line can optionally repeat the sequence identifier but is usually left bare. The quality string must be exactly the same length as the sequence string.

### Phred Quality Scores

Phred scores are the universal language of base-call confidence. The mapping is logarithmic:

| Phred score | Error probability | Accuracy |
|-------------|-------------------|----------|
| 10          | 1 in 10           | 90%      |
| 20          | 1 in 100          | 99%      |
| 30          | 1 in 1,000        | 99.9%    |
| 40          | 1 in 10,000       | 99.99%   |

Modern Illumina instruments typically produce reads with average Phred scores between 30 and 40. Long-read platforms (PacBio HiFi, Oxford Nanopore) have different error profiles and quality distributions.

## Background Reading

1. Cock, P. J. A. et al. (2010). The Sanger FASTQ file format for sequences with quality scores, and the Solexa/Illumina FASTQ variants. *Nucleic Acids Research*, 38(6), 1767–1771.
