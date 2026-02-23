+++
title = "Ensembl Release 112"
description = "Gene annotations for 300+ vertebrate genomes from the Ensembl project."
template = "dataset-page.html"

[extra]
demo = true
org = "ensembl"
downloads = "27.4k"
likes = "724"
size = "45 GB"
organism = "Multi-species (300+)"
format_tags = ["FASTA", "GTF", "GFF3", "MySQL dumps"]
tags = ["gene annotation", "vertebrate", "reference", "transcriptome"]
updated = "3 weeks ago"
license = "Apache 2.0"
version = "112"
files = [
    { name = "homo_sapiens/Homo_sapiens.GRCh38.112.gtf.gz", size = "48 MB" },
    { name = "homo_sapiens/Homo_sapiens.GRCh38.dna.primary_assembly.fa.gz", size = "880 MB" },
    { name = "mus_musculus/Mus_musculus.GRCm39.112.gtf.gz", size = "38 MB" },
    { name = "danio_rerio/Danio_rerio.GRCz11.112.gtf.gz", size = "22 MB" },
    { name = "README.md", size = "4.8 KB" },
]
+++

Ensembl Release 112 provides comprehensive gene annotations for over **300 vertebrate genomes**. This includes gene models, transcript structures, regulatory features, and comparative genomics data produced by the Ensembl annotation pipeline.

## What's included

- **Gene models** with protein-coding, lncRNA, and pseudogene annotations
- **Transcript sequences** (cDNA, CDS, protein) for all annotated genes
- **Regulatory features** including promoters, enhancers, and CTCF sites
- **Comparative genomics** with gene trees and whole-genome alignments

## Use cases

Ensembl annotations are the standard reference for RNA-seq alignment, gene expression quantification, and variant annotation. The data is used by virtually every genomics pipeline for mapping reads to gene models.
