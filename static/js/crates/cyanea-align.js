import { initWasm, wasm, createSim, textarea, tabs, select, setStatus, time, randomDNA, NT_COLORS } from '/js/cyanea-sim.js';
import { align_dna_custom, align_protein, align_banded, progressive_msa, poa_consensus, cigar_stats, parse_cigar } from '/wasm/cyanea_wasm.js';

async function init() {
    await initWasm();
    const container = document.getElementById('playground-container');
    const sim = createSim(container);

    let currentTab = 'DNA Align';
    let mode = 'global';

    const tabBar = tabs(['DNA Align', 'Protein Align', 'MSA', 'CIGAR'], (name) => {
        currentTab = name;
        buildUI();
    });
    sim.controls.appendChild(tabBar);

    const inputWrap = document.createElement('div');
    inputWrap.className = 'sim-control-group sim-control-wide';
    sim.controls.appendChild(inputWrap);

    const optWrap = document.createElement('div');
    optWrap.style.display = 'flex';
    optWrap.style.gap = '0.5rem';
    optWrap.style.flexWrap = 'wrap';
    sim.controls.appendChild(optWrap);

    const btnWrap = document.createElement('div');
    btnWrap.className = 'sim-btn-group';
    sim.controls.appendChild(btnWrap);

    let ta, ta2;

    function buildUI() {
        inputWrap.innerHTML = '';
        optWrap.innerHTML = '';
        btnWrap.innerHTML = '';
        ta2 = null;

        if (currentTab === 'DNA Align' || currentTab === 'Protein Align') {
            addTextarea('Query', currentTab === 'Protein Align' ? 'HEAGAWGHEE' : 'ACGTACGTACGT');
            const lbl2 = document.createElement('label');
            lbl2.className = 'sim-label';
            lbl2.textContent = 'Target';
            ta2 = document.createElement('textarea');
            ta2.className = 'sim-textarea';
            ta2.spellcheck = false;
            ta2.value = currentTab === 'Protein Align' ? 'PAWHEAE' : 'ACGACGTACG';
            inputWrap.appendChild(lbl2);
            inputWrap.appendChild(ta2);

            const modeSel = select('Mode', ['global', 'local', 'semiglobal'], v => { mode = v; });
            optWrap.appendChild(modeSel);
        } else if (currentTab === 'MSA') {
            addTextarea('Sequences (one per line)', 'ACGTACGTAC\nACGACGTACG\nACGTACGTCG\nACGTCGTACG');
        } else {
            addTextarea('CIGAR String', '8M2I4M1D3M');
        }

        const runBtn = document.createElement('button');
        runBtn.className = 'sim-btn sim-btn-primary';
        runBtn.textContent = 'Run';
        runBtn.addEventListener('click', run);
        btnWrap.appendChild(runBtn);

        run();
    }

    function addTextarea(label, value) {
        const lbl = document.createElement('label');
        lbl.className = 'sim-label';
        lbl.textContent = label;
        ta = document.createElement('textarea');
        ta.className = 'sim-textarea';
        ta.spellcheck = false;
        ta.value = value;
        inputWrap.appendChild(lbl);
        inputWrap.appendChild(ta);
    }

    function run() {
        try {
            if (currentTab === 'DNA Align') {
                const q = ta.value.trim().toUpperCase().replace(/[^ATCG]/g, '');
                const t = ta2.value.trim().toUpperCase().replace(/[^ATCG]/g, '');
                if (!q || !t) { sim.display.innerHTML = msg('Enter query and target sequences'); return; }
                const { result, ms } = time(() => wasm(align_dna_custom, q, t, mode, 2, -1, -5, -2));
                renderAlignment(result, ms);
            } else if (currentTab === 'Protein Align') {
                const q = ta.value.trim().toUpperCase();
                const t = ta2.value.trim().toUpperCase();
                if (!q || !t) { sim.display.innerHTML = msg('Enter query and target sequences'); return; }
                const { result, ms } = time(() => wasm(align_protein, q, t, mode, 'BLOSUM62'));
                renderAlignment(result, ms);
            } else if (currentTab === 'MSA') {
                const seqs = ta.value.trim().split('\n').map(s => s.trim().toUpperCase()).filter(Boolean);
                if (seqs.length < 2) { sim.display.innerHTML = msg('Enter at least 2 sequences'); return; }
                const { result, ms } = time(() => wasm(progressive_msa, JSON.stringify(seqs), 2, -1, -5, -2));
                const aligned = result.alignment || result.sequences || result;
                let html = '<div style="padding:1rem"><div class="sim-section-label">Multiple Sequence Alignment</div>';
                html += '<div style="font-family:var(--font-mono,monospace);font-size:0.8125rem;line-height:1.8">';
                const arr = Array.isArray(aligned) ? aligned : [aligned];
                arr.forEach((s, i) => {
                    html += `<div><span style="color:#94a3b8;min-width:60px;display:inline-block">seq${i + 1}</span> `;
                    const str = typeof s === 'string' ? s : (s.sequence || s);
                    for (const ch of String(str)) {
                        html += `<span style="color:${NT_COLORS[ch] || '#94a3b8'}">${ch}</span>`;
                    }
                    html += '</div>';
                });
                html += '</div></div>';
                sim.display.innerHTML = html;
                setStatus(sim.status, `Aligned ${seqs.length} sequences in ${ms.toFixed(1)} ms`, 'success');
            } else {
                const cigar = ta.value.trim();
                if (!cigar) { sim.display.innerHTML = msg('Enter a CIGAR string'); return; }
                const { result: stats, ms } = time(() => wasm(cigar_stats, cigar));
                const ops = wasm(parse_cigar, cigar);
                let html = '<div class="sim-stats-grid">';
                for (const [k, v] of Object.entries(stats)) {
                    html += stat(k, v);
                }
                html += '</div>';
                html += '<div style="padding:1rem"><div class="sim-section-label">Operations</div>';
                html += '<div style="font-family:var(--font-mono,monospace);font-size:0.8125rem">';
                const opsArr = Array.isArray(ops) ? ops : (ops.operations || []);
                opsArr.forEach(op => {
                    const label = op.op || op.operation || op[1] || '';
                    const len = op.len || op.length || op[0] || '';
                    html += `<span style="display:inline-block;padding:0.125rem 0.375rem;margin:0.125rem;border-radius:4px;background:rgba(6,182,212,0.1);color:#0891b2">${len}${label}</span>`;
                });
                html += '</div></div>';
                sim.display.innerHTML = html;
                setStatus(sim.status, `Parsed in ${ms.toFixed(1)} ms`, 'success');
            }
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    function renderAlignment(result, ms) {
        const score = result.score ?? 0;
        const cigar = result.cigar || '';
        const qAlign = result.query_aligned || result.aligned_query || '';
        const tAlign = result.target_aligned || result.aligned_target || '';

        let html = `<div class="sim-stats-grid">`;
        html += stat('Score', score);
        html += stat('CIGAR', cigar);
        html += stat('Mode', mode);
        html += `</div>`;

        if (qAlign && tAlign) {
            html += '<div style="padding:1rem"><div class="sim-section-label">Alignment</div>';
            html += '<div style="font-family:var(--font-mono,monospace);font-size:0.8125rem;line-height:1.8">';
            html += `<div>Query  ${colorSeq(String(qAlign))}</div>`;
            html += `<div>       ${matchLine(String(qAlign), String(tAlign))}</div>`;
            html += `<div>Target ${colorSeq(String(tAlign))}</div>`;
            html += '</div></div>';
        }
        sim.display.innerHTML = html;
        setStatus(sim.status, `Aligned in ${ms.toFixed(1)} ms`, 'success');
    }

    function colorSeq(seq) {
        return [...seq].map(c => `<span style="color:${NT_COLORS[c] || AA_COLORS[c] || '#94a3b8'}">${c}</span>`).join('');
    }

    function matchLine(q, t) {
        return [...q].map((c, i) => c === t[i] ? '|' : (c === '-' || t[i] === '-' ? ' ' : '.')).join('');
    }

    buildUI();
}

function msg(text) {
    return `<div style="padding:2rem;color:#94a3b8;text-align:center">${text}</div>`;
}

function stat(label, value) {
    return `<div class="sim-stat-card"><div class="sim-stat-label">${label}</div><div class="sim-stat-value">${value}</div></div>`;
}

init();
