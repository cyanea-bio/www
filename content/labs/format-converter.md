+++
title = "format-converter"
description = "Convert between bioinformatics file formats in your browser. Supports FASTA, FASTQ, SAM, VCF, BED, GFF3, and more."
weight = 25
template = "tool-page.html"

[extra]
org = "cyanea"
badge = ""
status = "Stable"
likes = 234
updated = "4d ago"
powered_by = ["cyanea-wasm", "cyanea-io"]
tags = ["Converter", "Formats", "Browser Tool"]
format_tags = ["FASTA", "FASTQ", "SAM", "VCF", "BED", "GFF3", "GTF", "GenBank", "EMBL", "TSV"]
+++

## Overview

Format Converter transforms bioinformatics files between formats directly in the browser. Select a source format, pick a target, drop your file, and download the result — all processed locally via WebAssembly. No upload, no file size limits beyond your browser's memory.

## Features

- **Wide format support** — Convert between FASTA, FASTQ, SAM, VCF, BED, GFF3, GTF, GenBank, EMBL, and tab-delimited formats.
- **Batch conversion** — Drop multiple files to convert them all at once.
- **Field mapping** — Configure which fields map to the target format when conversions are not 1:1.
- **Validation** — Input files are validated during parsing; errors are reported with line numbers.
- **Compression** — Output can be gzipped automatically for large files.
- **Preview** — See the first 100 lines of the converted output before downloading.

## How It Works

All conversions are powered by `cyanea-io`'s comprehensive parser/writer suite compiled to WASM. The tool parses the input into an internal representation, validates the data, applies any field mappings, and serializes to the target format. Processing runs in a Web Worker to keep the UI responsive.

## Use Cases

- **Pipeline prep** — Convert a GFF3 to BED for use with bedtools without installing anything.
- **Quick reformatting** — Turn a GenBank file into FASTA for BLAST input.
- **Data exchange** — Convert between formats when collaborators use different tools.
- **Validation** — Use the converter as a format validator — if it parses cleanly, the file is well-formed.
