import { initWasm, wasm, createSim, textarea, tabs, slider, setStatus, time, drawBarChart, PALETTE, FONT_MATH } from '/js/cyanea-sim.js';
import { describe, pearson, spearman, t_test, mann_whitney_u, bonferroni, benjamini_hochberg, kaplan_meier, wright_fisher, shannon_index, tajimas_d } from '/wasm/cyanea_wasm.js';

function randomNormal(mean, sd) {
    const u1 = Math.random(), u2 = Math.random();
    return mean + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

async function init() {
    await initWasm();
    const container = document.getElementById('playground-container');
    const sim = createSim(container);

    let currentTab = 'Describe';

    const tabBar = tabs(['Describe', 'T-test', 'Correlation', 'Survival', 'Diversity'], (name) => {
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
        ta = document.createElement('textarea');
        ta.className = 'sim-textarea';
        ta.spellcheck = false;

        if (currentTab === 'Describe') {
            lbl.textContent = 'Data (comma-separated)';
            ta.value = Array.from({ length: 50 }, () => randomNormal(5, 2).toFixed(2)).join(', ');
        } else if (currentTab === 'T-test') {
            lbl.textContent = 'Data (comma-separated)';
            ta.value = Array.from({ length: 30 }, () => randomNormal(5.5, 1.5).toFixed(2)).join(', ');
        } else if (currentTab === 'Correlation') {
            lbl.textContent = 'X values (comma-separated)';
            ta.value = Array.from({ length: 20 }, (_, i) => (i + randomNormal(0, 2)).toFixed(2)).join(', ');
        } else if (currentTab === 'Survival') {
            lbl.textContent = 'Times (comma-separated)';
            ta.value = '1, 2, 3, 4, 5, 6, 8, 10, 12, 15';
        } else {
            lbl.textContent = 'Species counts (comma-separated)';
            ta.value = '45, 23, 12, 8, 5, 3, 2, 1, 1';
        }

        inputWrap.appendChild(lbl);
        inputWrap.appendChild(ta);

        if (currentTab === 'Correlation') {
            const lbl2 = document.createElement('label');
            lbl2.className = 'sim-label';
            lbl2.textContent = 'Y values (comma-separated)';
            const ta2 = document.createElement('textarea');
            ta2.className = 'sim-textarea';
            ta2.id = 'y-values';
            ta2.spellcheck = false;
            ta2.value = Array.from({ length: 20 }, (_, i) => (i * 1.5 + randomNormal(0, 3)).toFixed(2)).join(', ');
            inputWrap.appendChild(lbl2);
            inputWrap.appendChild(ta2);
        }

        if (currentTab === 'Survival') {
            const lbl2 = document.createElement('label');
            lbl2.className = 'sim-label';
            lbl2.textContent = 'Status (1=event, 0=censored)';
            const ta2 = document.createElement('textarea');
            ta2.className = 'sim-textarea';
            ta2.id = 'status-values';
            ta2.spellcheck = false;
            ta2.value = '1, 1, 0, 1, 1, 0, 1, 1, 0, 1';
            inputWrap.appendChild(lbl2);
            inputWrap.appendChild(ta2);
        }

        const runBtn = document.createElement('button');
        runBtn.className = 'sim-btn sim-btn-primary';
        runBtn.textContent = 'Run';
        runBtn.addEventListener('click', run);
        btnWrap.appendChild(runBtn);

        run();
    }

    function parseCSV(text) {
        return text.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    }

    function run() {
        try {
            if (currentTab === 'Describe') {
                const data = parseCSV(ta.value);
                if (!data.length) { sim.display.innerHTML = msg('Enter numeric data'); return; }
                const { result, ms } = time(() => wasm(describe, JSON.stringify(data)));
                let html = '<div class="sim-stats-grid">';
                for (const [k, v] of Object.entries(result)) {
                    html += stat(k, typeof v === 'number' ? v.toFixed(4) : v);
                }
                html += '</div>';
                sim.display.innerHTML = html;
                setStatus(sim.status, `Computed in ${ms.toFixed(1)} ms`, 'success');
            } else if (currentTab === 'T-test') {
                const data = parseCSV(ta.value);
                if (!data.length) { sim.display.innerHTML = msg('Enter numeric data'); return; }
                const { result, ms } = time(() => wasm(t_test, JSON.stringify(data), 5.0));
                let html = '<div class="sim-stats-grid">';
                for (const [k, v] of Object.entries(result)) {
                    html += stat(k, typeof v === 'number' ? v.toFixed(4) : v);
                }
                html += '</div>';
                sim.display.innerHTML = html;
                setStatus(sim.status, `T-test in ${ms.toFixed(1)} ms`, 'success');
            } else if (currentTab === 'Correlation') {
                const x = parseCSV(ta.value);
                const yEl = document.getElementById('y-values');
                const y = yEl ? parseCSV(yEl.value) : [];
                if (!x.length || !y.length) { sim.display.innerHTML = msg('Enter X and Y values'); return; }
                const { result: pear, ms } = time(() => wasm(pearson, JSON.stringify(x), JSON.stringify(y)));
                const spear = wasm(spearman, JSON.stringify(x), JSON.stringify(y));
                let html = '<div class="sim-stats-grid">';
                html += stat('Pearson r', (pear.r ?? pear.coefficient ?? pear).toFixed(4));
                html += stat('Pearson p', (pear.p_value ?? pear.p ?? 0).toFixed(4));
                html += stat('Spearman rho', (spear.rho ?? spear.coefficient ?? spear).toFixed(4));
                html += stat('Spearman p', (spear.p_value ?? spear.p ?? 0).toFixed(4));
                html += '</div>';
                sim.display.innerHTML = html;
                setStatus(sim.status, `Computed in ${ms.toFixed(1)} ms`, 'success');
            } else if (currentTab === 'Survival') {
                const times = parseCSV(ta.value);
                const statusEl = document.getElementById('status-values');
                const status = statusEl ? parseCSV(statusEl.value).map(v => v === 1 ? true : false) : [];
                if (!times.length) { sim.display.innerHTML = msg('Enter times and status'); return; }
                const { result, ms } = time(() => wasm(kaplan_meier, JSON.stringify(times), JSON.stringify(status)));
                const curve = result.curve || result.steps || result;
                let html = '<div style="padding:1rem"><div class="sim-section-label">Kaplan-Meier Curve</div>';
                html += '<table style="width:100%;border-collapse:collapse;font-size:0.75rem">';
                html += '<tr><th style="text-align:left;padding:0.375rem;border-bottom:2px solid #e2e8f0;color:#64748b">Time</th><th style="text-align:left;padding:0.375rem;border-bottom:2px solid #e2e8f0;color:#64748b">Survival</th></tr>';
                const arr = Array.isArray(curve) ? curve : [];
                arr.forEach(step => {
                    const t = step.time ?? step.t ?? step[0] ?? 0;
                    const s = step.survival ?? step.s ?? step[1] ?? 0;
                    html += `<tr><td style="padding:0.375rem;border-bottom:1px solid #f1f5f9;font-family:var(--font-mono,monospace)">${typeof t === 'number' ? t.toFixed(1) : t}</td><td style="padding:0.375rem;border-bottom:1px solid #f1f5f9;font-family:var(--font-mono,monospace)">${typeof s === 'number' ? s.toFixed(4) : s}</td></tr>`;
                });
                html += '</table></div>';
                sim.display.innerHTML = html;
                setStatus(sim.status, `KM in ${ms.toFixed(1)} ms`, 'success');
            } else {
                const counts = parseCSV(ta.value);
                if (!counts.length) { sim.display.innerHTML = msg('Enter species counts'); return; }
                const { result: shannon, ms } = time(() => wasm(shannon_index, JSON.stringify(counts)));
                const total = counts.reduce((a, b) => a + b, 0);
                const richness = counts.filter(c => c > 0).length;
                const shannonVal = typeof shannon === 'number' ? shannon : (shannon.index ?? shannon);
                let html = '<div class="sim-stats-grid">';
                html += stat('Shannon H\'', typeof shannonVal === 'number' ? shannonVal.toFixed(4) : shannonVal);
                html += stat('Richness', richness);
                html += stat('Total Count', total);
                html += stat('Evenness', richness > 1 ? (shannonVal / Math.log(richness)).toFixed(4) : 'N/A');
                html += '</div>';
                sim.display.innerHTML = html;
                setStatus(sim.status, `Computed in ${ms.toFixed(1)} ms`, 'success');
            }
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    buildUI();
}

function msg(t) { return `<div style="padding:2rem;color:#94a3b8;text-align:center">${t}</div>`; }
function stat(l, v) { return `<div class="sim-stat-card"><div class="sim-stat-label">${l}</div><div class="sim-stat-value">${v}</div></div>`; }

init();
