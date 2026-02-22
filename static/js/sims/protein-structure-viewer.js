import { initWasm, wasm, createSim, textarea, select, tabs, buttonGroup, setStatus, time, drawHeatmap, drawScatter, PALETTE, FONT_MATH } from '/js/cyanea-sim.js';
import { pdb_info, pdb_secondary_structure, contact_map, ramachandran_analysis } from '/wasm/cyanea_wasm.js';

const SAMPLE_PDB = `HEADER    SAMPLE PROTEIN
ATOM      1  N   ALA A   1       1.000   1.000   1.000  1.00  0.00           N
ATOM      2  CA  ALA A   1       2.000   1.000   1.000  1.00  0.00           C
ATOM      3  C   ALA A   1       3.000   1.000   1.000  1.00  0.00           C
ATOM      4  O   ALA A   1       3.500   2.000   1.000  1.00  0.00           O
ATOM      5  N   GLY A   2       3.500   0.000   1.000  1.00  0.00           N
ATOM      6  CA  GLY A   2       4.500   0.000   1.000  1.00  0.00           C
ATOM      7  C   GLY A   2       5.500   0.000   1.000  1.00  0.00           C
ATOM      8  O   GLY A   2       6.000   1.000   1.000  1.00  0.00           O
ATOM      9  N   VAL A   3       6.000  -1.000   1.000  1.00  0.00           N
ATOM     10  CA  VAL A   3       7.000  -1.000   1.000  1.00  0.00           C
ATOM     11  C   VAL A   3       8.000  -1.000   1.000  1.00  0.00           C
ATOM     12  O   VAL A   3       8.500   0.000   1.000  1.00  0.00           O
ATOM     13  N   LEU A   4       8.500  -2.000   1.000  1.00  0.00           N
ATOM     14  CA  LEU A   4       9.500  -2.000   1.000  1.00  0.00           C
ATOM     15  C   LEU A   4      10.500  -2.000   1.000  1.00  0.00           C
ATOM     16  O   LEU A   4      11.000  -1.000   1.000  1.00  0.00           O
ATOM     17  N   SER A   5      11.000  -3.000   1.000  1.00  0.00           N
ATOM     18  CA  SER A   5      12.000  -3.000   1.000  1.00  0.00           C
ATOM     19  C   SER A   5      13.000  -3.000   1.000  1.00  0.00           C
ATOM     20  O   SER A   5      13.500  -2.000   1.000  1.00  0.00           O
ATOM     21  N   PRO A   6      13.500  -4.000   1.500  1.00  0.00           N
ATOM     22  CA  PRO A   6      14.500  -4.000   2.000  1.00  0.00           C
ATOM     23  C   PRO A   6      15.500  -4.000   2.500  1.00  0.00           C
ATOM     24  O   PRO A   6      16.000  -3.000   2.500  1.00  0.00           O
ATOM     25  N   ASP A   7      16.000  -5.000   3.000  1.00  0.00           N
ATOM     26  CA  ASP A   7      17.000  -5.000   3.500  1.00  0.00           C
ATOM     27  C   ASP A   7      18.000  -5.000   4.000  1.00  0.00           C
ATOM     28  O   ASP A   7      18.500  -4.000   4.000  1.00  0.00           O
ATOM     29  N   GLU A   8      18.500  -6.000   4.500  1.00  0.00           N
ATOM     30  CA  GLU A   8      19.500  -6.000   5.000  1.00  0.00           C
ATOM     31  C   GLU A   8      20.500  -6.000   5.500  1.00  0.00           C
ATOM     32  O   GLU A   8      21.000  -5.000   5.500  1.00  0.00           O
END`;

async function init() {
    await initWasm();
    const container = document.getElementById('sim-container');
    const sim = createSim(container);

    const { element: taEl, textarea: ta } = textarea('PDB Data', 'Paste PDB file content...', SAMPLE_PDB);
    sim.controls.appendChild(taEl);

    sim.controls.appendChild(buttonGroup([
        ['Sample', () => { ta.value = SAMPLE_PDB; update(); }],
    ]));

    let currentTab = '3D View';

    const tabBar = tabs(['3D View', 'Secondary Structure', 'Contact Map', 'Ramachandran'], (t) => {
        currentTab = t;
        update();
    });
    sim.display.parentElement.insertBefore(tabBar, sim.display);

    ta.addEventListener('input', update);

    function update() {
        const pdb = ta.value.trim();
        if (!pdb) {
            sim.display.innerHTML = '<div style="padding:2rem;color:#94a3b8;text-align:center">Paste PDB data above</div>';
            return;
        }

        try {
            const { result: _, ms } = time(() => {
                const info = wasm(pdb_info, pdb);
                let html = '';

                // Info bar (always shown)
                html += '<div class="sim-info-bar">';
                html += `<span>Chains: ${info.n_chains ?? info.chains ?? '-'}</span>`;
                html += `<span>Residues: ${info.n_residues ?? info.residues ?? '-'}</span>`;
                html += `<span>Atoms: ${info.n_atoms ?? info.atoms ?? '-'}</span>`;
                html += '</div>';

                if (currentTab === '3D View') {
                    html += render3D(pdb);
                } else if (currentTab === 'Secondary Structure') {
                    html += renderSS(pdb);
                } else if (currentTab === 'Contact Map') {
                    html += renderContactMap(pdb);
                } else if (currentTab === 'Ramachandran') {
                    html += renderRamachandran(pdb);
                }

                sim.display.innerHTML = html;

                // Initialize 3Dmol if on that tab
                if (currentTab === '3D View' && typeof $3Dmol !== 'undefined') {
                    const viewerDiv = sim.display.querySelector('#viewer-3d');
                    if (viewerDiv) {
                        const viewer = $3Dmol.createViewer(viewerDiv, { backgroundColor: '#f8fafc' });
                        viewer.addModel(pdb, 'pdb');
                        viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
                        viewer.zoomTo();
                        viewer.render();
                    }
                }
            });

            setStatus(sim.status, `Parsed in ${ms.toFixed(1)} ms`, 'success');
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    function render3D(pdb) {
        if (typeof $3Dmol !== 'undefined') {
            return '<div id="viewer-3d" class="sim-3d-viewer"></div>';
        }
        return '<div style="padding:2rem;color:#94a3b8;text-align:center">3Dmol.js loading... Refresh if needed.</div>';
    }

    function renderSS(pdb) {
        try {
            const ss = wasm(pdb_secondary_structure, pdb);
            const residues = ss.residues || ss;
            if (!Array.isArray(residues) || residues.length === 0) {
                return '<div style="padding:1rem;color:#94a3b8">No secondary structure data</div>';
            }

            let html = '<div style="padding:1rem">';
            html += '<div class="sim-section-label">Secondary Structure</div>';
            html += '<div style="display:flex;flex-wrap:wrap;gap:1px;margin:0.5rem 0">';
            const ssColors = { H: '#EF4444', E: '#3B82F6', C: '#94A3B8', T: '#F59E0B', S: '#22C55E', G: '#EC4899', I: '#8B5CF6', B: '#6366F1' };

            residues.forEach(r => {
                const ss_type = r.ss || r.structure || 'C';
                const color = ssColors[ss_type] || ssColors.C;
                const name = r.name || r.residue || '?';
                html += `<div style="width:18px;height:24px;background:${color};border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:0.5rem;color:white;font-weight:600" title="${name} ${r.index || ''}: ${ss_type}">${name.charAt(0)}</div>`;
            });
            html += '</div>';

            // Legend
            html += '<div style="display:flex;gap:1rem;margin-top:0.75rem;font-size:0.75rem;color:#64748b">';
            html += '<span><span style="display:inline-block;width:10px;height:10px;background:#EF4444;border-radius:2px;margin-right:4px"></span>Helix</span>';
            html += '<span><span style="display:inline-block;width:10px;height:10px;background:#3B82F6;border-radius:2px;margin-right:4px"></span>Sheet</span>';
            html += '<span><span style="display:inline-block;width:10px;height:10px;background:#94A3B8;border-radius:2px;margin-right:4px"></span>Coil</span>';
            html += '</div>';
            html += '</div>';
            return html;
        } catch (e) {
            return `<div style="padding:1rem;color:#EF4444">SS Error: ${e.message}</div>`;
        }
    }

    function renderContactMap(pdb) {
        try {
            const contacts = wasm(contact_map, pdb, 8.0);
            const contactList = contacts.contacts || contacts;
            if (!Array.isArray(contactList)) {
                return '<div style="padding:1rem;color:#94a3b8">No contact data available</div>';
            }

            const maxIdx = contactList.reduce((m, c) => Math.max(m, c.i || c[0] || 0, c.j || c[1] || 0), 0) + 1;
            const size = Math.min(maxIdx, 100);

            let html = '<div style="padding:1rem">';
            html += '<div class="sim-section-label">Contact Map (<span class="sim-math">C<sub>&alpha;</sub>&ndash;C<sub>&alpha;</sub> &le; 8.0 &Aring;</span>)</div>';
            html += `<canvas id="contact-canvas" width="${size * 4}" height="${size * 4}" style="width:${Math.min(size * 4, 400)}px;image-rendering:pixelated"></canvas>`;
            html += `<div style="font-size:0.75rem;color:#64748b;margin-top:0.5rem">${contactList.length} contacts</div>`;
            html += '</div>';
            return html;
        } catch (e) {
            return `<div style="padding:1rem;color:#EF4444">Contact map error: ${e.message}</div>`;
        }
    }

    function renderRamachandran(pdb) {
        try {
            const rama = wasm(ramachandran_analysis, pdb);
            const angles = rama.angles || rama.residues || rama;
            if (!Array.isArray(angles) || angles.length === 0) {
                return '<div style="padding:1rem;color:#94a3b8">No Ramachandran data available</div>';
            }

            let html = '<div style="padding:1rem">';
            html += '<div class="sim-section-label">Ramachandran Plot</div>';
            html += '<canvas id="rama-canvas" width="400" height="400" style="max-width:100%;aspect-ratio:1"></canvas>';
            html += `<div style="font-size:0.75rem;color:#64748b;margin-top:0.5rem">${angles.length} residues plotted</div>`;
            html += '</div>';

            // We'll draw after innerHTML is set
            requestAnimationFrame(() => {
                const canvas = document.getElementById('rama-canvas');
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                const w = 400, h = 400;
                const pad = 40;

                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(0, 0, w, h);

                // Axes
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(pad, pad);
                ctx.lineTo(pad, h - pad);
                ctx.lineTo(w - pad, h - pad);
                ctx.stroke();

                // Grid lines at -180, -90, 0, 90, 180
                ctx.strokeStyle = '#f1f5f9';
                [-180, -90, 0, 90, 180].forEach(v => {
                    const x = pad + ((v + 180) / 360) * (w - 2 * pad);
                    const y = h - pad - ((v + 180) / 360) * (h - 2 * pad);
                    ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, h - pad); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke();
                });

                // Points
                angles.forEach(a => {
                    const phi = a.phi ?? a[0];
                    const psi = a.psi ?? a[1];
                    if (phi == null || psi == null) return;
                    const x = pad + ((phi + 180) / 360) * (w - 2 * pad);
                    const y = h - pad - ((psi + 180) / 360) * (h - 2 * pad);
                    ctx.fillStyle = 'rgba(6,182,212,0.6)';
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fill();
                });

                // Labels
                ctx.fillStyle = '#64748b';
                ctx.font = `italic 13px ${FONT_MATH}`;
                ctx.textAlign = 'center';
                ctx.fillText('\u03C6 (Phi)', w / 2, h - 8);
                ctx.save();
                ctx.translate(12, h / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.fillText('\u03C8 (Psi)', 0, 0);
                ctx.restore();
            });

            return html;
        } catch (e) {
            return `<div style="padding:1rem;color:#EF4444">Ramachandran error: ${e.message}</div>`;
        }
    }

    update();
}

init();
