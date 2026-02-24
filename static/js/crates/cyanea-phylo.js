import { initWasm, wasm, createSim, textarea, tabs, setStatus, time } from '/js/cyanea-sim.js';
import { newick_info, evolutionary_distance, build_upgma, build_nj, rf_distance, simulate_evolution, simulate_coalescent } from '/wasm/cyanea_wasm.js';

const SAMPLE_NEWICK = '((Human:0.1,Chimp:0.12):0.08,(Gorilla:0.17,(Orangutan:0.19,Gibbon:0.25):0.04):0.06);';

const SAMPLE_LABELS = ['Human', 'Chimp', 'Gorilla', 'Orangutan'];
const SAMPLE_MATRIX = [
    [0.0, 0.12, 0.18, 0.22],
    [0.12, 0.0, 0.17, 0.21],
    [0.18, 0.17, 0.0, 0.15],
    [0.22, 0.21, 0.15, 0.0],
];

async function init() {
    await initWasm();
    const container = document.getElementById('playground-container');
    const sim = createSim(container);

    let currentTab = 'Parse Newick';

    const tabBar = tabs(['Parse Newick', 'Build Tree', 'RF Distance', 'Simulate'], (name) => {
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

        if (currentTab === 'Parse Newick') {
            addTA('Newick Tree', SAMPLE_NEWICK);
        } else if (currentTab === 'Build Tree') {
            addTA('Labels (JSON array)', JSON.stringify(SAMPLE_LABELS));
            const lbl2 = document.createElement('label');
            lbl2.className = 'sim-label';
            lbl2.textContent = 'Distance Matrix (JSON)';
            ta2 = document.createElement('textarea');
            ta2.className = 'sim-textarea';
            ta2.spellcheck = false;
            ta2.value = JSON.stringify(SAMPLE_MATRIX);
            inputWrap.appendChild(lbl2);
            inputWrap.appendChild(ta2);
        } else if (currentTab === 'RF Distance') {
            addTA('Tree 1 (Newick)', '((A,B),(C,D));');
            const lbl2 = document.createElement('label');
            lbl2.className = 'sim-label';
            lbl2.textContent = 'Tree 2 (Newick)';
            ta2 = document.createElement('textarea');
            ta2.className = 'sim-textarea';
            ta2.spellcheck = false;
            ta2.value = '((A,C),(B,D));';
            inputWrap.appendChild(lbl2);
            inputWrap.appendChild(ta2);
        } else {
            addTA('Guide Tree (Newick)', '((A:0.1,B:0.1):0.05,C:0.15);');
        }

        const runBtn = document.createElement('button');
        runBtn.className = 'sim-btn sim-btn-primary';
        runBtn.textContent = 'Run';
        runBtn.addEventListener('click', run);
        btnWrap.appendChild(runBtn);

        run();
    }

    function addTA(label, value) {
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
            if (currentTab === 'Parse Newick') {
                const newick = ta.value.trim();
                if (!newick) { sim.display.innerHTML = msg('Enter a Newick tree'); return; }
                const { result, ms } = time(() => wasm(newick_info, newick));
                let html = '<div class="sim-stats-grid">';
                for (const [k, v] of Object.entries(result)) {
                    if (typeof v !== 'object' || v === null) html += stat(formatKey(k), v);
                }
                html += '</div>';
                if (result.taxa || result.leaves) {
                    html += '<div style="padding:1rem"><div class="sim-section-label">Taxa</div>';
                    const taxa = result.taxa || result.leaves;
                    html += '<div style="display:flex;flex-wrap:wrap;gap:0.375rem">';
                    (Array.isArray(taxa) ? taxa : []).forEach(t => {
                        const name = typeof t === 'string' ? t : (t.name || t);
                        html += `<span style="padding:0.25rem 0.625rem;background:#f1f5f9;border-radius:100px;font-family:var(--font-mono,monospace);font-size:0.75rem;color:#475569">${name}</span>`;
                    });
                    html += '</div></div>';
                }
                sim.display.innerHTML = html;
                setStatus(sim.status, `Parsed in ${ms.toFixed(1)} ms`, 'success');
            } else if (currentTab === 'Build Tree') {
                const labels = ta.value.trim();
                const matrix = ta2.value.trim();
                if (!labels || !matrix) { sim.display.innerHTML = msg('Enter labels and distance matrix'); return; }
                const { result: upgma, ms: ms1 } = time(() => wasm(build_upgma, labels, matrix));
                const { result: nj, ms: ms2 } = time(() => wasm(build_nj, labels, matrix));
                const upgmaTree = typeof upgma === 'string' ? upgma : (upgma.newick || upgma.tree || JSON.stringify(upgma));
                const njTree = typeof nj === 'string' ? nj : (nj.newick || nj.tree || JSON.stringify(nj));
                sim.display.innerHTML = `
                    <div style="padding:1rem">
                        <div class="sim-section-label">UPGMA Tree</div>
                        <div style="font-family:var(--font-mono,monospace);font-size:0.8125rem;color:#1e293b;word-break:break-all;margin-bottom:1.5rem">${upgmaTree}</div>
                        <div class="sim-section-label">Neighbor-Joining Tree</div>
                        <div style="font-family:var(--font-mono,monospace);font-size:0.8125rem;color:#1e293b;word-break:break-all">${njTree}</div>
                    </div>`;
                setStatus(sim.status, `UPGMA: ${ms1.toFixed(1)} ms, NJ: ${ms2.toFixed(1)} ms`, 'success');
            } else if (currentTab === 'RF Distance') {
                const tree1 = ta.value.trim();
                const tree2 = ta2.value.trim();
                if (!tree1 || !tree2) { sim.display.innerHTML = msg('Enter two Newick trees'); return; }
                const { result, ms } = time(() => wasm(rf_distance, tree1, tree2));
                const dist = typeof result === 'number' ? result : (result.distance ?? result.rf ?? result);
                sim.display.innerHTML = `
                    <div class="sim-stats-grid">
                        ${stat('RF Distance', dist)}
                        ${stat('Tree 1', tree1.length > 40 ? tree1.slice(0, 40) + '...' : tree1)}
                        ${stat('Tree 2', tree2.length > 40 ? tree2.slice(0, 40) + '...' : tree2)}
                    </div>`;
                setStatus(sim.status, `Computed in ${ms.toFixed(1)} ms`, 'success');
            } else {
                const newick = ta.value.trim();
                if (!newick) { sim.display.innerHTML = msg('Enter a guide tree'); return; }
                const { result, ms } = time(() => wasm(simulate_evolution, newick, 50, 'jc69', 42));
                const seqs = result.sequences || result.alignment || result;
                let html = '<div style="padding:1rem"><div class="sim-section-label">Simulated Sequences</div>';
                html += '<div style="font-family:var(--font-mono,monospace);font-size:0.8125rem;line-height:1.8">';
                if (typeof seqs === 'object' && !Array.isArray(seqs)) {
                    for (const [name, seq] of Object.entries(seqs)) {
                        html += `<div><span style="color:#94a3b8;min-width:80px;display:inline-block">${name}</span> ${seq}</div>`;
                    }
                } else if (Array.isArray(seqs)) {
                    seqs.forEach(s => {
                        const name = s.name || s.taxon || '';
                        const seq = s.sequence || s.seq || s;
                        html += `<div><span style="color:#94a3b8;min-width:80px;display:inline-block">${name}</span> ${seq}</div>`;
                    });
                }
                html += '</div></div>';
                sim.display.innerHTML = html;
                setStatus(sim.status, `Simulated in ${ms.toFixed(1)} ms`, 'success');
            }
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    buildUI();
}

function formatKey(k) { return k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
function msg(t) { return `<div style="padding:2rem;color:#94a3b8;text-align:center">${t}</div>`; }
function stat(l, v) { return `<div class="sim-stat-card"><div class="sim-stat-label">${l}</div><div class="sim-stat-value">${v}</div></div>`; }

init();
