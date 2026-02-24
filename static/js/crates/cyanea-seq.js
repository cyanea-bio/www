import { initWasm, wasm, createSim, textarea, buttonGroup, tabs, setStatus, time, randomDNA, NT_COLORS, AA_COLORS } from '/js/cyanea-sim.js';
import { transcribe, translate, gc_content_json, reverse_complement, validate, rna_fold_nussinov, protein_props, codon_usage, minhash_compare, assembly_stats_json } from '/wasm/cyanea_wasm.js';

const SAMPLE_GENE = 'ATGGCTAGCAAAGACTTCACCGAGTACCTGCAGAACCTGATCGGCAAAGCCTTCGACTTTAAACAGATCGAAAACGCCCTGGAATGA';

async function init() {
    await initWasm();
    const container = document.getElementById('playground-container');
    const sim = createSim(container);

    let currentTab = 'Transcribe';

    const tabBar = tabs(['Transcribe', 'RNA Fold', 'MinHash', 'Protein Props'], (name) => {
        currentTab = name;
        buildUI();
    });
    sim.controls.appendChild(tabBar);

    const inputWrap = document.createElement('div');
    inputWrap.className = 'sim-control-group sim-control-wide';
    sim.controls.appendChild(inputWrap);

    const btnWrap = document.createElement('div');
    btnWrap.className = 'sim-btn-group';
    sim.controls.appendChild(btnWrap);

    let ta, ta2;

    function buildUI() {
        inputWrap.innerHTML = '';
        btnWrap.innerHTML = '';
        ta2 = null;

        const lbl = document.createElement('label');
        lbl.className = 'sim-label';

        ta = document.createElement('textarea');
        ta.className = 'sim-textarea';
        ta.spellcheck = false;

        if (currentTab === 'Transcribe') {
            lbl.textContent = 'DNA Sequence';
            ta.placeholder = 'ATGAAACCCGGG...';
            ta.value = SAMPLE_GENE;
        } else if (currentTab === 'RNA Fold') {
            lbl.textContent = 'RNA Sequence';
            ta.placeholder = 'GGGAAACCC...';
            ta.value = 'GGGAAAUCCCGGGAAAUCCC';
        } else if (currentTab === 'MinHash') {
            lbl.textContent = 'Sequence A';
            ta.placeholder = 'First DNA sequence...';
            ta.value = randomDNA(200);
            const lbl2 = document.createElement('label');
            lbl2.className = 'sim-label';
            lbl2.textContent = 'Sequence B';
            ta2 = document.createElement('textarea');
            ta2.className = 'sim-textarea';
            ta2.spellcheck = false;
            ta2.placeholder = 'Second DNA sequence...';
            ta2.value = randomDNA(200);
            inputWrap.appendChild(lbl);
            inputWrap.appendChild(ta);
            inputWrap.appendChild(lbl2);
            inputWrap.appendChild(ta2);
        } else {
            lbl.textContent = 'Protein Sequence';
            ta.placeholder = 'MASKDFTE...';
            ta.value = 'MASKDFTEYLQNLIGKAFDFFKQIENALE';
        }

        if (currentTab !== 'MinHash') {
            inputWrap.appendChild(lbl);
            inputWrap.appendChild(ta);
        }

        const runBtn = document.createElement('button');
        runBtn.className = 'sim-btn sim-btn-primary';
        runBtn.textContent = 'Run';
        runBtn.addEventListener('click', run);
        btnWrap.appendChild(runBtn);

        if (currentTab === 'Transcribe') {
            const randomBtn = document.createElement('button');
            randomBtn.className = 'sim-btn';
            randomBtn.textContent = 'Random';
            randomBtn.addEventListener('click', () => { ta.value = 'ATG' + randomDNA(87); run(); });
            btnWrap.appendChild(randomBtn);
        }

        run();
    }

    function run() {
        try {
            if (currentTab === 'Transcribe') {
                const seq = ta.value.trim().toUpperCase().replace(/[^ATCG]/g, '');
                if (!seq) { sim.display.innerHTML = msg('Enter a DNA sequence'); return; }
                const t0 = performance.now();
                const mrna = wasm(transcribe, seq);
                const protein = wasm(translate, seq);
                const gc = wasm(gc_content_json, seq);
                const rc = wasm(reverse_complement, seq);
                const ms = performance.now() - t0;

                let html = codonRow('DNA', seq, NT_COLORS, 'rgba(30,41,59,0.06)');
                html += codonRow('mRNA', String(mrna), NT_COLORS, 'rgba(6,182,212,0.08)');
                html += aaRow('Protein', String(protein));
                html += `<div class="sim-stats-grid">`;
                html += stat('Length', seq.length + ' bp');
                html += stat('GC Content', (gc * 100).toFixed(1) + '%');
                html += stat('Amino Acids', String(protein).replace(/\*/g, '').length);
                html += stat('Rev Comp', String(rc).slice(0, 20) + '...');
                html += `</div>`;
                sim.display.innerHTML = html;
                setStatus(sim.status, `Computed in ${ms.toFixed(1)} ms`, 'success');
            } else if (currentTab === 'RNA Fold') {
                const seq = ta.value.trim().toUpperCase().replace(/[^AUCG]/g, '');
                if (!seq) { sim.display.innerHTML = msg('Enter an RNA sequence'); return; }
                const { result, ms } = time(() => wasm(rna_fold_nussinov, seq));
                const structure = result.structure || result;
                const pairs = result.pairs || 0;
                sim.display.innerHTML = `
                    <div style="padding:1rem">
                        <div class="sim-section-label">Sequence</div>
                        <div style="font-family:var(--font-mono,'JetBrains Mono',monospace);font-size:0.8125rem;letter-spacing:0.05em;color:#1e293b;word-break:break-all">${seq}</div>
                        <div class="sim-section-label" style="margin-top:1rem">Structure (dot-bracket)</div>
                        <div style="font-family:var(--font-mono,'JetBrains Mono',monospace);font-size:0.8125rem;letter-spacing:0.05em;color:#06B6D4;word-break:break-all">${structure}</div>
                    </div>
                    <div class="sim-stats-grid">
                        ${stat('Length', seq.length + ' nt')}
                        ${stat('Base Pairs', pairs)}
                    </div>`;
                setStatus(sim.status, `Folded in ${ms.toFixed(1)} ms`, 'success');
            } else if (currentTab === 'MinHash') {
                const seqA = ta.value.trim().toUpperCase().replace(/[^ATCG]/g, '');
                const seqB = ta2.value.trim().toUpperCase().replace(/[^ATCG]/g, '');
                if (!seqA || !seqB) { sim.display.innerHTML = msg('Enter two DNA sequences'); return; }
                const { result, ms } = time(() => wasm(minhash_compare, seqA, seqB, 11, 128));
                const sim_val = typeof result === 'object' ? (result.similarity ?? result.jaccard ?? result) : result;
                sim.display.innerHTML = `
                    <div class="sim-stats-grid">
                        ${stat('Sequence A', seqA.length + ' bp')}
                        ${stat('Sequence B', seqB.length + ' bp')}
                        ${stat('k', '11')}
                        ${stat('Jaccard Similarity', typeof sim_val === 'number' ? sim_val.toFixed(4) : sim_val)}
                    </div>`;
                setStatus(sim.status, `MinHash in ${ms.toFixed(1)} ms`, 'success');
            } else {
                const seq = ta.value.trim().toUpperCase().replace(/[^ACDEFGHIKLMNPQRSTVWY]/g, '');
                if (!seq) { sim.display.innerHTML = msg('Enter a protein sequence'); return; }
                const { result, ms } = time(() => wasm(protein_props, seq));
                const p = result;
                sim.display.innerHTML = `
                    <div class="sim-stats-grid">
                        ${stat('Length', p.length || seq.length)}
                        ${stat('Mol. Weight', (p.molecular_weight || 0).toFixed(1) + ' Da')}
                        ${stat('Isoelectric Pt', (p.isoelectric_point || 0).toFixed(2))}
                        ${stat('Charge (pH 7)', (p.charge_at_ph7 || 0).toFixed(1))}
                        ${stat('Aromaticity', ((p.aromaticity || 0) * 100).toFixed(1) + '%')}
                        ${stat('Instability', (p.instability_index || 0).toFixed(1))}
                    </div>`;
                setStatus(sim.status, `Computed in ${ms.toFixed(1)} ms`, 'success');
            }
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    buildUI();
}

function msg(text) {
    return `<div style="padding:2rem;color:#94a3b8;text-align:center">${text}</div>`;
}

function stat(label, value) {
    return `<div class="sim-stat-card"><div class="sim-stat-label">${label}</div><div class="sim-stat-value">${value}</div></div>`;
}

function codonRow(label, seq, colors, bg) {
    let html = `<div class="sim-section-label">${label}</div><div class="sim-codon-display">`;
    for (let i = 0; i < seq.length; i += 3) {
        const codon = seq.slice(i, i + 3);
        html += `<span class="sim-codon" style="background:${bg}">`;
        for (const base of codon) html += `<span style="color:${colors[base] || '#94a3b8'}">${base}</span>`;
        html += '</span>';
    }
    return html + '</div>';
}

function aaRow(label, seq) {
    let html = `<div class="sim-section-label">${label}</div><div class="sim-codon-display">`;
    for (const aa of seq) {
        const c = AA_COLORS[aa] || '#94a3b8';
        html += `<span class="sim-codon" style="background:${c}22;color:${c};font-weight:700">${aa}</span>`;
    }
    return html + '</div>';
}

init();
