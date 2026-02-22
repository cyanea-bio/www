import { initWasm, wasm, createSim, textarea, buttonGroup, setStatus, time, randomDNA, NT_COLORS, AA_COLORS } from '/js/cyanea-sim.js';
import { transcribe, translate, gc_content_json, codon_usage } from '/wasm/cyanea_wasm.js';

const SAMPLE_GENE = 'ATGGCTAGCAAAGACTTCACCGAGTACCTGCAGAACCTGATCGGCAAAGCCTTCGACTTTAAACAGATCGAAAACGCCCTGGAATGA';

async function init() {
    await initWasm();
    const container = document.getElementById('sim-container');
    const sim = createSim(container);

    const { element: taEl, textarea: ta } = textarea('DNA Sequence', 'ATGAAACCCGGG...', SAMPLE_GENE);
    sim.controls.appendChild(taEl);
    sim.controls.appendChild(buttonGroup([
        ['Random', () => { ta.value = 'ATG' + randomDNA(87); update(); }],
        ['Sample gene', () => { ta.value = SAMPLE_GENE; update(); }],
        ['Clear', () => { ta.value = ''; update(); }],
    ]));

    ta.addEventListener('input', update);

    function update() {
        const seq = ta.value.trim().toUpperCase().replace(/[^ATCG]/g, '');
        if (!seq) {
            sim.display.innerHTML = '<div style="padding:2rem;color:#94a3b8;text-align:center">Enter a DNA sequence above</div>';
            setStatus(sim.status, '');
            return;
        }

        try {
            const t0 = performance.now();
            const mrna = wasm(transcribe, seq);
            const protein = wasm(translate, seq);
            const gc = wasm(gc_content_json, seq);
            const ms = performance.now() - t0;

            let html = '';

            // DNA row
            html += '<div class="sim-section-label">DNA</div>';
            html += '<div class="sim-codon-display">';
            for (let i = 0; i < seq.length; i += 3) {
                const codon = seq.slice(i, i + 3);
                html += '<span class="sim-codon" style="background:rgba(30,41,59,0.06)">';
                for (const base of codon) {
                    html += `<span style="color:${NT_COLORS[base] || '#94a3b8'}">${base}</span>`;
                }
                html += '</span>';
            }
            html += '</div>';

            // mRNA row
            const mrnaStr = String(mrna);
            html += '<div class="sim-section-label">mRNA</div>';
            html += '<div class="sim-codon-display">';
            for (let i = 0; i < mrnaStr.length; i += 3) {
                const codon = mrnaStr.slice(i, i + 3);
                html += '<span class="sim-codon" style="background:rgba(6,182,212,0.08)">';
                for (const base of codon) {
                    html += `<span style="color:${NT_COLORS[base] || '#94a3b8'}">${base}</span>`;
                }
                html += '</span>';
            }
            html += '</div>';

            // Protein row
            const proteinStr = String(protein);
            html += '<div class="sim-section-label">Protein</div>';
            html += '<div class="sim-codon-display">';
            for (const aa of proteinStr) {
                const color = AA_COLORS[aa] || '#94a3b8';
                html += `<span class="sim-codon" style="background:${color}22;color:${color};font-weight:700">${aa}</span>`;
            }
            html += '</div>';

            // Stats
            const stopCount = (proteinStr.match(/\*/g) || []).length;
            html += '<div class="sim-stats-grid">';
            html += statCard('Length', seq.length + ' bp');
            html += statCard('GC Content', (gc * 100).toFixed(1) + '%');
            html += statCard('Amino Acids', proteinStr.replace(/\*/g, '').length);
            html += statCard('Stop Codons', stopCount);
            html += '</div>';

            sim.display.innerHTML = html;
            setStatus(sim.status, `Computed in ${ms.toFixed(1)} ms`, 'success');
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    update();
}

function statCard(label, value) {
    return `<div class="sim-stat-card"><div class="sim-stat-label">${label}</div><div class="sim-stat-value">${value}</div></div>`;
}

init();
