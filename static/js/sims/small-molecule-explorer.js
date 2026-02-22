import { initWasm, wasm, createSim, textarea, buttonGroup, setStatus, time, PALETTE } from '/js/cyanea-sim.js';
import { smiles_properties, canonical, smiles_fingerprint, tanimoto } from '/wasm/cyanea_wasm.js';

const MOLECULES = {
    Aspirin: 'CC(=O)OC1=CC=CC=C1C(=O)O',
    Caffeine: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
    Ibuprofen: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O',
    Benzene: 'C1=CC=CC=C1',
};

async function init() {
    await initWasm();
    const container = document.getElementById('sim-container');
    const sim = createSim(container);

    const { element: ta1El, textarea: ta1 } = textarea('Molecule A', 'Enter SMILES...', MOLECULES.Aspirin);
    const { element: ta2El, textarea: ta2 } = textarea('Molecule B', 'Enter SMILES...', MOLECULES.Caffeine);
    sim.controls.appendChild(ta1El);
    sim.controls.appendChild(ta2El);

    sim.controls.appendChild(buttonGroup(
        Object.entries(MOLECULES).map(([name, smi]) => [name, () => {
            if (!ta1.value.trim()) { ta1.value = smi; }
            else if (!ta2.value.trim() || ta2.value.trim() === ta1.value.trim()) { ta2.value = smi; }
            else { ta1.value = ta2.value; ta2.value = smi; }
            update();
        }])
    ));

    ta1.addEventListener('input', update);
    ta2.addEventListener('input', update);

    function update() {
        const smi1 = ta1.value.trim();
        const smi2 = ta2.value.trim();

        if (!smi1 && !smi2) {
            sim.display.innerHTML = '<div style="padding:2rem;color:#94a3b8;text-align:center">Enter SMILES strings above</div>';
            return;
        }

        try {
            const { result: _, ms } = time(() => {
                let html = '<div class="sim-split">';

                // Molecule A
                if (smi1) {
                    html += renderMolecule(smi1, 'Molecule A');
                } else {
                    html += '<div style="padding:1rem;color:#94a3b8">Enter Molecule A</div>';
                }

                // Molecule B
                if (smi2) {
                    html += renderMolecule(smi2, 'Molecule B');
                } else {
                    html += '<div style="padding:1rem;color:#94a3b8">Enter Molecule B</div>';
                }
                html += '</div>';

                // Similarity comparison
                if (smi1 && smi2) {
                    html += renderSimilarity(smi1, smi2);
                }

                sim.display.innerHTML = html;
            });

            setStatus(sim.status, `Computed in ${ms.toFixed(1)} ms`, 'success');
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    function renderMolecule(smi, title) {
        try {
            const props = wasm(smiles_properties, smi);
            const can = wasm(canonical, smi);

            let html = '<div style="padding:0.75rem">';
            html += `<div class="sim-section-label">${title}</div>`;

            // Property table
            html += '<table class="sim-property-table">';
            html += row('Formula', props.formula || '-');
            html += row('Mol. Weight', props.molecular_weight != null ? props.molecular_weight.toFixed(2) : '-');
            html += row('Atoms', props.atom_count ?? props.n_atoms ?? '-');
            html += row('Bonds', props.bond_count ?? props.n_bonds ?? '-');
            html += row('Rings', props.ring_count ?? props.n_rings ?? '-');
            html += row('HBD', props.hbd ?? props.h_bond_donors ?? '-');
            html += row('HBA', props.hba ?? props.h_bond_acceptors ?? '-');
            html += row('Rotatable', props.rotatable_bonds ?? '-');
            html += '</table>';

            // Lipinski
            const mw = props.molecular_weight ?? 0;
            const hbd = props.hbd ?? props.h_bond_donors ?? 0;
            const hba = props.hba ?? props.h_bond_acceptors ?? 0;
            const lipinski = mw <= 500 && hbd <= 5 && hba <= 10;
            html += `<div style="margin-top:0.5rem"><span class="sim-badge ${lipinski ? 'sim-badge-pass' : 'sim-badge-fail'}">${lipinski ? 'Lipinski Pass' : 'Lipinski Fail'}</span></div>`;

            // Canonical SMILES
            html += `<div style="margin-top:0.5rem;font-family:var(--font-mono,'JetBrains Mono',monospace);font-size:0.75rem;color:#475569;word-break:break-all">${can}</div>`;

            html += '</div>';
            return html;
        } catch (e) {
            return `<div style="padding:0.75rem"><div class="sim-section-label">${title}</div><div style="color:#EF4444;font-size:0.8125rem">Error: ${e.message}</div></div>`;
        }
    }

    function renderSimilarity(smi1, smi2) {
        try {
            const tanResult = wasm(tanimoto, smi1, smi2);
            const similarity = typeof tanResult === 'number' ? tanResult : tanResult.similarity ?? tanResult.tanimoto ?? 0;

            let html = '<div style="padding:0 0.75rem 0.75rem">';
            html += '<div class="sim-section-label">Fingerprint Similarity</div>';
            html += '<div class="sim-stats-grid">';
            html += statCard('Tanimoto', similarity.toFixed(4));
            html += statCard('Similar?', similarity > 0.7 ? 'Yes' : similarity > 0.4 ? 'Moderate' : 'No');
            html += '</div>';

            // Visual similarity bar
            const pct = Math.round(similarity * 100);
            html += '<div style="margin-top:0.5rem">';
            html += `<div style="background:#e2e8f0;border-radius:4px;height:8px;overflow:hidden">`;
            html += `<div style="background:${PALETTE.primary};width:${pct}%;height:100%;border-radius:4px;transition:width 0.3s"></div>`;
            html += '</div>';
            html += `<div style="font-size:0.75rem;color:#64748b;margin-top:0.25rem">${pct}% similar</div>`;
            html += '</div>';

            // Fingerprint bits
            try {
                const fp1 = wasm(smiles_fingerprint, smi1, 2, 256);
                const fp2 = wasm(smiles_fingerprint, smi2, 2, 256);
                const bits1 = new Set(fp1.set_bits || fp1.bits || []);
                const bits2 = new Set(fp2.set_bits || fp2.bits || []);

                html += '<div class="sim-section-label">Fingerprint Bits (256-bit)</div>';
                html += '<div style="display:flex;gap:0.5rem">';

                // Molecule A bits
                html += '<div style="flex:1"><div style="font-size:0.6875rem;color:#94a3b8;margin-bottom:0.25rem">A</div><div class="sim-fp-grid">';
                for (let i = 0; i < 256; i++) {
                    const on = bits1.has(i);
                    html += `<div class="sim-fp-bit" style="background:${on ? PALETTE.primary : '#e2e8f0'}"></div>`;
                }
                html += '</div></div>';

                // Molecule B bits
                html += '<div style="flex:1"><div style="font-size:0.6875rem;color:#94a3b8;margin-bottom:0.25rem">B</div><div class="sim-fp-grid">';
                for (let i = 0; i < 256; i++) {
                    const on = bits2.has(i);
                    html += `<div class="sim-fp-bit" style="background:${on ? PALETTE.accent : '#e2e8f0'}"></div>`;
                }
                html += '</div></div>';

                html += '</div>';
            } catch {}

            html += '</div>';
            return html;
        } catch (e) {
            return `<div style="padding:0.75rem;color:#EF4444">Similarity error: ${e.message}</div>`;
        }
    }

    update();
}

function row(label, value) {
    return `<tr><td style="color:#64748b;font-family:Inter,sans-serif">${label}</td><td>${value}</td></tr>`;
}

function statCard(label, value) {
    return `<div class="sim-stat-card"><div class="sim-stat-label">${label}</div><div class="sim-stat-value">${value}</div></div>`;
}

init();
