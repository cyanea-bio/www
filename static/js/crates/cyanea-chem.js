import { initWasm, wasm, createSim, textarea, tabs, setStatus, time } from '/js/cyanea-sim.js';
import { smiles_properties, canonical, smiles_fingerprint, tanimoto, smiles_substructure, parse_sdf, maccs_fingerprint } from '/wasm/cyanea_wasm.js';

const MOLECULES = {
    'Aspirin': 'CC(=O)Oc1ccccc1C(=O)O',
    'Caffeine': 'Cn1c(=O)c2c(ncn2C)n(C)c1=O',
    'Ibuprofen': 'CC(C)Cc1ccc(cc1)C(C)C(=O)O',
    'Benzene': 'c1ccccc1',
    'Ethanol': 'CCO',
};

async function init() {
    await initWasm();
    const container = document.getElementById('playground-container');
    const sim = createSim(container);

    let currentTab = 'Properties';

    const tabBar = tabs(['Properties', 'Tanimoto', 'Substructure', 'Canonical'], (name) => {
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

        if (currentTab === 'Properties' || currentTab === 'Canonical') {
            addTA('SMILES', MOLECULES['Aspirin']);
        } else if (currentTab === 'Tanimoto') {
            addTA('Molecule 1 (SMILES)', MOLECULES['Aspirin']);
            const lbl2 = document.createElement('label');
            lbl2.className = 'sim-label';
            lbl2.textContent = 'Molecule 2 (SMILES)';
            ta2 = document.createElement('textarea');
            ta2.className = 'sim-textarea';
            ta2.spellcheck = false;
            ta2.value = MOLECULES['Ibuprofen'];
            inputWrap.appendChild(lbl2);
            inputWrap.appendChild(ta2);
        } else {
            addTA('Molecule (SMILES)', MOLECULES['Aspirin']);
            const lbl2 = document.createElement('label');
            lbl2.className = 'sim-label';
            lbl2.textContent = 'SMARTS Pattern';
            ta2 = document.createElement('textarea');
            ta2.className = 'sim-textarea';
            ta2.spellcheck = false;
            ta2.value = '[CX3](=O)[OX2H1]';
            ta2.placeholder = 'e.g., [CX3](=O)[OX2H1] for carboxylic acid';
            inputWrap.appendChild(lbl2);
            inputWrap.appendChild(ta2);
        }

        // Preset buttons
        const presets = document.createElement('div');
        presets.className = 'sim-btn-group';
        for (const [name, smi] of Object.entries(MOLECULES)) {
            const btn = document.createElement('button');
            btn.className = 'sim-btn';
            btn.textContent = name;
            btn.addEventListener('click', () => { ta.value = smi; run(); });
            presets.appendChild(btn);
        }
        inputWrap.appendChild(presets);

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
        ta.style.minHeight = '40px';
        inputWrap.appendChild(lbl);
        inputWrap.appendChild(ta);
    }

    function run() {
        try {
            if (currentTab === 'Properties') {
                const smi = ta.value.trim();
                if (!smi) { sim.display.innerHTML = msg('Enter a SMILES string'); return; }
                const { result, ms } = time(() => wasm(smiles_properties, smi));
                let html = '<div class="sim-stats-grid">';
                for (const [k, v] of Object.entries(result)) {
                    html += stat(formatKey(k), typeof v === 'number' ? v.toFixed(3) : v);
                }
                html += '</div>';
                sim.display.innerHTML = html;
                setStatus(sim.status, `Computed in ${ms.toFixed(1)} ms`, 'success');
            } else if (currentTab === 'Tanimoto') {
                const smi1 = ta.value.trim();
                const smi2 = ta2.value.trim();
                if (!smi1 || !smi2) { sim.display.innerHTML = msg('Enter two SMILES strings'); return; }
                const { result, ms } = time(() => wasm(tanimoto, smi1, smi2));
                const val = typeof result === 'number' ? result : (result.similarity ?? result.tanimoto ?? result);
                sim.display.innerHTML = `
                    <div class="sim-stats-grid">
                        ${stat('Tanimoto Similarity', typeof val === 'number' ? val.toFixed(4) : val)}
                        ${stat('Molecule 1', smi1.length > 30 ? smi1.slice(0, 30) + '...' : smi1)}
                        ${stat('Molecule 2', smi2.length > 30 ? smi2.slice(0, 30) + '...' : smi2)}
                    </div>`;
                setStatus(sim.status, `Computed in ${ms.toFixed(1)} ms`, 'success');
            } else if (currentTab === 'Substructure') {
                const mol = ta.value.trim();
                const pattern = ta2.value.trim();
                if (!mol || !pattern) { sim.display.innerHTML = msg('Enter molecule and pattern'); return; }
                const { result, ms } = time(() => wasm(smiles_substructure, mol, pattern));
                const match = typeof result === 'boolean' ? result : (result.match ?? result.found ?? result);
                sim.display.innerHTML = `
                    <div class="sim-stats-grid">
                        ${stat('Match', match ? 'Yes' : 'No')}
                        ${stat('Molecule', mol)}
                        ${stat('Pattern', pattern)}
                    </div>`;
                setStatus(sim.status, `Searched in ${ms.toFixed(1)} ms`, 'success');
            } else {
                const smi = ta.value.trim();
                if (!smi) { sim.display.innerHTML = msg('Enter a SMILES string'); return; }
                const { result, ms } = time(() => wasm(canonical, smi));
                sim.display.innerHTML = `
                    <div style="padding:1rem">
                        <div class="sim-section-label">Input</div>
                        <div style="font-family:var(--font-mono,monospace);font-size:0.875rem;color:#64748b;margin-bottom:1rem">${smi}</div>
                        <div class="sim-section-label">Canonical</div>
                        <div style="font-family:var(--font-mono,monospace);font-size:0.875rem;color:#1e293b">${result}</div>
                    </div>`;
                setStatus(sim.status, `Canonicalized in ${ms.toFixed(1)} ms`, 'success');
            }
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    buildUI();
}

function formatKey(k) {
    return k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
function msg(t) { return `<div style="padding:2rem;color:#94a3b8;text-align:center">${t}</div>`; }
function stat(l, v) { return `<div class="sim-stat-card"><div class="sim-stat-label">${l}</div><div class="sim-stat-value">${v}</div></div>`; }

init();
