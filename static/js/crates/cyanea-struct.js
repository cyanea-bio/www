import { initWasm, wasm, createSim, textarea, tabs, setStatus, time, drawScatter, drawHeatmap, PALETTE } from '/js/cyanea-sim.js';
import { pdb_info, pdb_secondary_structure, rmsd, contact_map, ramachandran_analysis, parse_mmcif, kabsch_align } from '/wasm/cyanea_wasm.js';

const SAMPLE_PDB = `HEADER    UBIQUITIN
ATOM      1  N   MET A   1       1.000   1.000   1.000  1.00  0.00
ATOM      2  CA  MET A   1       2.000   1.000   1.000  1.00  0.00
ATOM      3  C   MET A   1       2.500   2.000   1.000  1.00  0.00
ATOM      4  O   MET A   1       2.000   3.000   1.000  1.00  0.00
ATOM      5  N   GLN A   2       3.500   2.000   1.000  1.00  0.00
ATOM      6  CA  GLN A   2       4.000   3.000   1.000  1.00  0.00
ATOM      7  C   GLN A   2       5.000   3.000   2.000  1.00  0.00
ATOM      8  O   GLN A   2       5.000   3.000   3.000  1.00  0.00
ATOM      9  N   ILE A   3       6.000   3.000   1.500  1.00  0.00
ATOM     10  CA  ILE A   3       7.000   3.500   2.000  1.00  0.00
ATOM     11  C   ILE A   3       8.000   3.000   2.500  1.00  0.00
ATOM     12  O   ILE A   3       8.000   2.000   3.000  1.00  0.00
ATOM     13  N   PHE A   4       9.000   3.500   2.500  1.00  0.00
ATOM     14  CA  PHE A   4      10.000   3.000   3.000  1.00  0.00
ATOM     15  C   PHE A   4      11.000   3.500   3.500  1.00  0.00
ATOM     16  O   PHE A   4      11.000   4.500   4.000  1.00  0.00
ATOM     17  N   VAL A   5      12.000   2.500   3.500  1.00  0.00
ATOM     18  CA  VAL A   5      13.000   2.500   4.000  1.00  0.00
ATOM     19  C   VAL A   5      14.000   3.000   4.500  1.00  0.00
ATOM     20  O   VAL A   5      14.000   4.000   5.000  1.00  0.00
END`;

async function init() {
    await initWasm();
    const container = document.getElementById('playground-container');
    const sim = createSim(container);

    let currentTab = 'PDB Info';

    const tabBar = tabs(['PDB Info', 'Secondary Str', 'Contact Map', 'Ramachandran'], (name) => {
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

    let ta;

    function buildUI() {
        inputWrap.innerHTML = '';
        btnWrap.innerHTML = '';

        const lbl = document.createElement('label');
        lbl.className = 'sim-label';
        lbl.textContent = 'PDB Text';
        ta = document.createElement('textarea');
        ta.className = 'sim-textarea';
        ta.spellcheck = false;
        ta.value = SAMPLE_PDB;
        ta.style.minHeight = '100px';
        inputWrap.appendChild(lbl);
        inputWrap.appendChild(ta);

        const runBtn = document.createElement('button');
        runBtn.className = 'sim-btn sim-btn-primary';
        runBtn.textContent = 'Analyze';
        runBtn.addEventListener('click', run);
        btnWrap.appendChild(runBtn);

        run();
    }

    function run() {
        const pdb = ta.value.trim();
        if (!pdb) { sim.display.innerHTML = msg('Paste PDB text above'); return; }
        try {
            if (currentTab === 'PDB Info') {
                const { result, ms } = time(() => wasm(pdb_info, pdb));
                let html = '<div class="sim-stats-grid">';
                for (const [k, v] of Object.entries(result)) {
                    if (typeof v !== 'object') html += stat(formatKey(k), v);
                }
                html += '</div>';
                if (result.chains) {
                    html += '<div style="padding:1rem"><div class="sim-section-label">Chains</div>';
                    html += renderJSON(result.chains);
                    html += '</div>';
                }
                sim.display.innerHTML = html;
                setStatus(sim.status, `Parsed in ${ms.toFixed(1)} ms`, 'success');
            } else if (currentTab === 'Secondary Str') {
                const { result, ms } = time(() => wasm(pdb_secondary_structure, pdb));
                const residues = result.residues || result.assignments || result;
                let html = '<div style="padding:1rem"><div class="sim-section-label">Secondary Structure</div>';
                html += '<div style="font-family:var(--font-mono,monospace);font-size:0.8125rem;display:flex;flex-wrap:wrap;gap:2px">';
                const arr = Array.isArray(residues) ? residues : [];
                arr.forEach(r => {
                    const type = r.ss || r.type || r.structure || 'C';
                    const color = type === 'H' ? '#EF4444' : type === 'E' ? '#3B82F6' : '#94A3B8';
                    const label = type === 'H' ? 'Helix' : type === 'E' ? 'Sheet' : 'Coil';
                    html += `<span title="${label}" style="display:inline-block;width:16px;height:20px;background:${color};border-radius:2px"></span>`;
                });
                html += '</div>';
                html += '<div style="margin-top:0.5rem;font-size:0.75rem;color:#64748b">';
                html += '<span style="color:#EF4444">&#9632;</span> Helix &nbsp; <span style="color:#3B82F6">&#9632;</span> Sheet &nbsp; <span style="color:#94A3B8">&#9632;</span> Coil';
                html += '</div></div>';
                sim.display.innerHTML = html;
                setStatus(sim.status, `Assigned in ${ms.toFixed(1)} ms`, 'success');
            } else if (currentTab === 'Contact Map') {
                const { result, ms } = time(() => wasm(contact_map, pdb, 8.0));
                const matrix = result.matrix || result.contacts || result;
                let html = '<div style="padding:1rem"><div class="sim-section-label">Contact Map (8 \u00C5 cutoff)</div>';
                if (Array.isArray(matrix) && matrix.length > 0) {
                    html += renderJSON(matrix);
                } else {
                    html += renderJSON(result);
                }
                html += '</div>';
                sim.display.innerHTML = html;
                setStatus(sim.status, `Computed in ${ms.toFixed(1)} ms`, 'success');
            } else {
                const { result, ms } = time(() => wasm(ramachandran_analysis, pdb));
                const angles = result.residues || result.angles || result;
                let html = '<div style="padding:1rem"><div class="sim-section-label">Ramachandran Angles (phi, psi)</div>';
                html += renderJSON(angles);
                html += '</div>';
                sim.display.innerHTML = html;
                setStatus(sim.status, `Analyzed in ${ms.toFixed(1)} ms`, 'success');
            }
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    buildUI();
}

function renderJSON(data) {
    return `<pre style="font-family:var(--font-mono,monospace);font-size:0.75rem;color:#475569;max-height:300px;overflow-y:auto;white-space:pre-wrap">${JSON.stringify(data, null, 2)}</pre>`;
}
function formatKey(k) { return k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
function msg(t) { return `<div style="padding:2rem;color:#94a3b8;text-align:center">${t}</div>`; }
function stat(l, v) { return `<div class="sim-stat-card"><div class="sim-stat-label">${l}</div><div class="sim-stat-value">${v}</div></div>`; }

init();
