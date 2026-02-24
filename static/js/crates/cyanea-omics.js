import { initWasm, wasm, createSim, textarea, tabs, setStatus, time } from '/js/cyanea-sim.js';
import { merge_intervals, intersect_intervals, subtract_intervals, jaccard_intervals, make_windows, cbs_segment, find_cpg_islands, morans_i } from '/wasm/cyanea_wasm.js';

const SAMPLE_INTERVALS_A = JSON.stringify([
    { chrom: 'chr1', start: 100, end: 300 },
    { chrom: 'chr1', start: 250, end: 500 },
    { chrom: 'chr1', start: 700, end: 900 },
    { chrom: 'chr2', start: 100, end: 400 },
]);

const SAMPLE_INTERVALS_B = JSON.stringify([
    { chrom: 'chr1', start: 200, end: 400 },
    { chrom: 'chr1', start: 800, end: 1000 },
    { chrom: 'chr2', start: 300, end: 600 },
]);

const SAMPLE_DNA = 'GCGCGCGCGATCGATCGCGCGCGCGCGCGCGCGATCGATCGATCGATCGCGCGCGCGCGATCGATCGATCGATCGATCGCGCGCGCGCGCGCGATCGATCGATCGATCGATCGATCGCGCGCGCGCGCGCGCGATCGATCGATCGATCGATCGCGCGCGCGCGATCGATCGATCGATCGATCGATCGATCGATCGCGCGCGCGATCGATCGATCGCGCGCGCGATCGATCGATCGCGCG';

async function init() {
    await initWasm();
    const container = document.getElementById('playground-container');
    const sim = createSim(container);

    let currentTab = 'Merge';

    const tabBar = tabs(['Merge', 'Intersect', 'Jaccard', 'CpG Islands'], (name) => {
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

        if (currentTab === 'CpG Islands') {
            addTA('DNA Sequence', SAMPLE_DNA);
        } else {
            addTA('Intervals A (JSON)', SAMPLE_INTERVALS_A);
            if (currentTab !== 'Merge') {
                const lbl2 = document.createElement('label');
                lbl2.className = 'sim-label';
                lbl2.textContent = 'Intervals B (JSON)';
                ta2 = document.createElement('textarea');
                ta2.className = 'sim-textarea';
                ta2.spellcheck = false;
                ta2.value = SAMPLE_INTERVALS_B;
                inputWrap.appendChild(lbl2);
                inputWrap.appendChild(ta2);
            }
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
            if (currentTab === 'CpG Islands') {
                const seq = ta.value.trim().toUpperCase().replace(/[^ATCG]/g, '');
                if (!seq) { sim.display.innerHTML = msg('Enter a DNA sequence'); return; }
                const { result, ms } = time(() => wasm(find_cpg_islands, seq, 'chr1'));
                const islands = Array.isArray(result) ? result : (result.islands || []);
                let html = stat_row('Sequence Length', seq.length + ' bp') + stat_row('Islands Found', islands.length);
                html += renderJSON(islands);
                sim.display.innerHTML = html;
                setStatus(sim.status, `Found ${islands.length} CpG islands in ${ms.toFixed(1)} ms`, 'success');
            } else if (currentTab === 'Merge') {
                const { result, ms } = time(() => wasm(merge_intervals, ta.value.trim()));
                const merged = Array.isArray(result) ? result : (result.intervals || []);
                sim.display.innerHTML = stat_row('Input', JSON.parse(ta.value.trim()).length + ' intervals') + stat_row('Merged', merged.length + ' intervals') + renderJSON(merged);
                setStatus(sim.status, `Merged in ${ms.toFixed(1)} ms`, 'success');
            } else if (currentTab === 'Intersect') {
                const { result, ms } = time(() => wasm(intersect_intervals, ta.value.trim(), ta2.value.trim()));
                const hits = Array.isArray(result) ? result : (result.intervals || []);
                sim.display.innerHTML = stat_row('Intersections', hits.length) + renderJSON(hits);
                setStatus(sim.status, `Intersected in ${ms.toFixed(1)} ms`, 'success');
            } else {
                const { result, ms } = time(() => wasm(jaccard_intervals, ta.value.trim(), ta2.value.trim()));
                const jac = typeof result === 'number' ? result : (result.jaccard ?? result);
                sim.display.innerHTML = `<div class="sim-stats-grid">${stat('Jaccard Index', typeof jac === 'number' ? jac.toFixed(4) : jac)}</div>`;
                setStatus(sim.status, `Computed in ${ms.toFixed(1)} ms`, 'success');
            }
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    buildUI();
}

function renderJSON(data) {
    return `<div style="padding:1rem"><pre style="font-family:var(--font-mono,monospace);font-size:0.75rem;color:#475569;max-height:300px;overflow-y:auto;white-space:pre-wrap">${JSON.stringify(data, null, 2)}</pre></div>`;
}
function msg(t) { return `<div style="padding:2rem;color:#94a3b8;text-align:center">${t}</div>`; }
function stat(l, v) { return `<div class="sim-stat-card"><div class="sim-stat-label">${l}</div><div class="sim-stat-value">${v}</div></div>`; }
function stat_row(l, v) { return `<div class="sim-stats-grid">${stat(l, v)}</div>`; }

init();
