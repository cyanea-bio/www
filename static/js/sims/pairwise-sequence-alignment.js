import { initWasm, wasm, createSim, textarea, select, numberInput, buttonGroup, setStatus, NT_COLORS } from '/js/cyanea-sim.js';
import { align_dna_custom, cigar_stats } from '/wasm/cyanea_wasm.js';

const PAIRS = {
    'Similar': ['ATGCTAGCTACCGATCGATCGTACG', 'ATGCTAGCTACCAATCGATCGTACG'],
    'Divergent': ['ATGAAAGCCCGTTTAACCGGGTTT', 'ATGCCCAAAGGGTTTTCCCAAA'],
    'Gapped': ['ATGCGATCGATCGATCGATCGATCG', 'ATGCGATCGCGATCGATCG'],
};

async function init() {
    await initWasm();
    const container = document.getElementById('sim-container');
    const sim = createSim(container);

    const { element: ta1El, textarea: ta1 } = textarea('Query', 'Enter query sequence...', PAIRS.Similar[0]);
    const { element: ta2El, textarea: ta2 } = textarea('Target', 'Enter target sequence...', PAIRS.Similar[1]);
    sim.controls.appendChild(ta1El);
    sim.controls.appendChild(ta2El);

    const modeSel = select('Mode', ['global', 'local', 'semiglobal'], () => update());
    sim.controls.appendChild(modeSel);

    let params = { match: 2, mismatch: -1, gapOpen: -5, gapExtend: -2 };
    sim.controls.appendChild(numberInput('Match', params.match, -10, 10, 1, v => { params.match = v; update(); }));
    sim.controls.appendChild(numberInput('Mismatch', params.mismatch, -10, 10, 1, v => { params.mismatch = v; update(); }));
    sim.controls.appendChild(numberInput('Gap open', params.gapOpen, -20, 0, 1, v => { params.gapOpen = v; update(); }));
    sim.controls.appendChild(numberInput('Gap ext', params.gapExtend, -10, 0, 1, v => { params.gapExtend = v; update(); }));

    sim.controls.appendChild(buttonGroup(
        Object.entries(PAIRS).map(([name, [q, t]]) => [name, () => { ta1.value = q; ta2.value = t; update(); }])
    ));

    ta1.addEventListener('input', update);
    ta2.addEventListener('input', update);

    function update() {
        const query = ta1.value.trim().toUpperCase().replace(/[^ATCG]/g, '');
        const target = ta2.value.trim().toUpperCase().replace(/[^ATCG]/g, '');

        if (!query || !target) {
            sim.display.innerHTML = '<div style="padding:2rem;color:#94a3b8;text-align:center">Enter two sequences above</div>';
            return;
        }

        const mode = sim.controls.querySelector('.sim-select').value;

        try {
            const t0 = performance.now();
            const res = wasm(align_dna_custom, query, target, mode, params.match, params.mismatch, params.gapOpen, params.gapExtend);
            const ms = performance.now() - t0;

            const aq = res.aligned_query || res.query || '';
            const at = res.aligned_target || res.target || '';
            const score = res.score ?? 0;
            const cigar = res.cigar || '';

            let stats = {};
            try { stats = wasm(cigar_stats, cigar); } catch {}

            let html = '';

            // Alignment display
            html += '<div class="sim-section-label">Alignment</div>';
            html += '<div style="overflow-x:auto">';

            // Query row
            html += '<div class="sim-alignment-row">';
            html += '<span class="sim-alignment-char" style="color:#94a3b8;font-size:0.625rem;width:3rem">QRY</span>';
            for (let i = 0; i < aq.length; i++) {
                const c = aq[i];
                const match = c !== '-' && at[i] !== '-' && c === at[i];
                const mismatch = c !== '-' && at[i] !== '-' && c !== at[i];
                const bg = match ? 'rgba(34,197,94,0.12)' : mismatch ? 'rgba(239,68,68,0.12)' : 'rgba(148,163,184,0.1)';
                html += `<span class="sim-alignment-char" style="background:${bg};color:${NT_COLORS[c] || '#94a3b8'}">${c}</span>`;
            }
            html += '</div>';

            // Match indicator row
            html += '<div class="sim-alignment-row">';
            html += '<span class="sim-alignment-char" style="width:3rem"></span>';
            for (let i = 0; i < aq.length; i++) {
                const c = aq[i];
                const t = at[i];
                const sym = (c === '-' || t === '-') ? ' ' : c === t ? '|' : '.';
                html += `<span class="sim-alignment-char" style="color:#94a3b8">${sym}</span>`;
            }
            html += '</div>';

            // Target row
            html += '<div class="sim-alignment-row">';
            html += '<span class="sim-alignment-char" style="color:#94a3b8;font-size:0.625rem;width:3rem">TGT</span>';
            for (let i = 0; i < at.length; i++) {
                const c = at[i];
                const match = c !== '-' && aq[i] !== '-' && c === aq[i];
                const mismatch = c !== '-' && aq[i] !== '-' && c !== aq[i];
                const bg = match ? 'rgba(34,197,94,0.12)' : mismatch ? 'rgba(239,68,68,0.12)' : 'rgba(148,163,184,0.1)';
                html += `<span class="sim-alignment-char" style="background:${bg};color:${NT_COLORS[c] || '#94a3b8'}">${c}</span>`;
            }
            html += '</div>';
            html += '</div>';

            // Stats
            html += '<div class="sim-stats-grid">';
            html += statCard('Score', score);
            html += statCard('Identity', stats.identity != null ? (stats.identity * 100).toFixed(1) + '%' : '-');
            html += statCard('Gaps', stats.gap_count ?? '-');
            html += statCard('Length', aq.length);
            html += '</div>';

            if (cigar) {
                html += '<div class="sim-section-label">CIGAR</div>';
                html += `<div style="font-family:var(--font-mono,'JetBrains Mono',monospace);font-size:0.75rem;word-break:break-all;color:#475569">${cigar}</div>`;
            }

            sim.display.innerHTML = html;
            setStatus(sim.status, `Aligned in ${ms.toFixed(1)} ms | Mode: ${mode}`, 'success');
        } catch (err) {
            setStatus(sim.status, 'Error: ' + err.message, 'error');
        }
    }

    update();
}

function statCard(label, value) {
    return `<div class="sim-stat-card"><div class="sim-stat-label">${label}</div><div class="sim-stat-value">${value}</div></div>`;
}

init();
