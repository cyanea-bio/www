+++
title = "cyanea-wasm"
description = "WebAssembly bindings for browser-based bioinformatics. Powers Cyanea Spaces, Learn simulations, and Labs playgrounds with near-native performance."
weight = 12

[extra]
version = "0.3.1"
layer = "Platform"
badge = "popular"
tagline = "The meta-crate that brings the full ecosystem to the browser."
wasm_module = "cyanea_wasm"
has_playground = false
license = "Apache-2.0"
source_url = "https://github.com/cyanea-bio/labs/tree/main/cyanea-wasm"
docs_url = "https://docs.cyanea.bio/wasm/"
registry_url = "https://crates.io/crates/cyanea-wasm"
registry_name = "crates.io"
depends_on = ["cyanea-core", "cyanea-seq", "cyanea-io", "cyanea-align", "cyanea-omics", "cyanea-stats", "cyanea-ml", "cyanea-chem", "cyanea-struct", "cyanea-phylo"]
depended_by = []
tags = ["WASM", "WebAssembly", "Browser", "wasm-pack", "wasm-bindgen"]
functions = []
+++

## Overview

`cyanea-wasm` is the meta-crate that compiles the entire Cyanea ecosystem into a single WebAssembly module. It re-exports functions from every domain crate — sequence analysis, I/O parsing, alignment, statistics, machine learning, chemistry, structural biology, and phylogenetics — as `wasm-bindgen` exports callable from JavaScript.

Every interactive feature on cyanea.bio — Learn simulations, Labs playgrounds, and Spaces tools — is powered by this single WASM module.

## Key Concepts

### Architecture

```
┌─────────────────────────────────────┐
│           JavaScript UI             │
│  (cyanea-sim.js, playground JS)     │
├─────────────────────────────────────┤
│         cyanea_wasm.js              │
│   (auto-generated JS bindings)      │
├─────────────────────────────────────┤
│       cyanea_wasm_bg.wasm           │
│  (compiled Rust → WebAssembly)      │
├──────┬──────┬──────┬──────┬─────────┤
│ seq  │  io  │align │stats │  ...    │
│      │      │      │      │         │
└──────┴──────┴──────┴──────┴─────────┘
```

### JSON Envelope Convention

All WASM functions accept and return strings. Structured data is passed as JSON. Return values are wrapped in `{"ok": value}` on success or `{"error": "message"}` on failure. The `wasm()` helper in `cyanea-sim.js` unwraps this envelope automatically.

### Building

```bash
# Build the WASM module with wasm-pack
cd cyanea-wasm
wasm-pack build --target web --release

# Output: pkg/cyanea_wasm.js + cyanea_wasm_bg.wasm
```

### Loading in the Browser

```javascript
import init from '/wasm/cyanea_wasm.js';

// Initialize the WASM module (downloads + compiles the .wasm file)
await init();

// Now all exported functions are available
import { transcribe, translate } from '/wasm/cyanea_wasm.js';
const mrna = transcribe("ATGATGATG");
```

## Installation

### From npm

```bash
npm install @cyanea/wasm
```

### From CDN

```html
<script type="module">
  import init from 'https://cdn.cyanea.bio/wasm/cyanea_wasm.js';
  await init();
</script>
```

### Self-hosted

Copy `cyanea_wasm.js` and `cyanea_wasm_bg.wasm` to your static file server. The JS module fetches the WASM binary relative to its own URL.

## Use Cases

- **Interactive tools** — Build browser-based bioinformatics tools with no backend.
- **Education** — Create interactive simulations for teaching molecular biology.
- **Prototyping** — Test analysis ideas in the browser before committing to a server pipeline.
