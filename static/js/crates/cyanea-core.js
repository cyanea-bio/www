import { initWasm, wasm, createSim, textarea, buttonGroup, tabs, setStatus, time } from '/js/cyanea-sim.js';
import { sha256, compress, decompress } from '/wasm/cyanea_wasm.js';

async function init() {
    await initWasm();
    const container = document.getElementById('playground-container');
    const sim = createSim(container);

    let currentTab = 'SHA-256';

    const tabBar = tabs(['SHA-256', 'Compress', 'Decompress'], (name) => {
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
        lbl.textContent = currentTab === 'Decompress' ? 'Compressed Data' : 'Input Data';
        inputWrap.appendChild(lbl);

        ta = document.createElement('textarea');
        ta.className = 'sim-textarea';
        ta.spellcheck = false;

        if (currentTab === 'SHA-256') {
            ta.placeholder = 'Enter text to hash...';
            ta.value = 'ATCGATCGATCGATCG';
        } else if (currentTab === 'Compress') {
            ta.placeholder = 'Enter text to compress...';
            ta.value = 'ATCGATCG'.repeat(100);
        } else {
            ta.placeholder = 'Paste compressed data...';
            ta.value = '';
        }
        inputWrap.appendChild(ta);

        const runBtn = document.createElement('button');
        runBtn.className = 'sim-btn sim-btn-primary';
        runBtn.textContent = 'Run';
        runBtn.addEventListener('click', run);
        btnWrap.appendChild(runBtn);

        sim.display.innerHTML = '<div style="padding:2rem;color:#94a3b8;text-align:center">Click Run to execute</div>';
        setStatus(sim.status, '');
    }

    function run() {
        const input = ta.value;
        if (!input) {
            sim.display.innerHTML = '<div style="padding:2rem;color:#94a3b8;text-align:center">Enter some input above</div>';
            return;
        }
        try {
            if (currentTab === 'SHA-256') {
                const { result, ms } = time(() => wasm(sha256, input));
                sim.display.innerHTML = `
                    <div class="sim-stats-grid">
                        <div class="sim-stat-card"><div class="sim-stat-label">Input Length</div><div class="sim-stat-value">${input.length}</div></div>
                        <div class="sim-stat-card"><div class="sim-stat-label">Algorithm</div><div class="sim-stat-value">SHA-256</div></div>
                    </div>
                    <div style="padding:1rem"><div class="sim-section-label">Hash</div><div style="font-family:var(--font-mono,'JetBrains Mono',monospace);font-size:0.8125rem;word-break:break-all;color:#1e293b">${result}</div></div>`;
                setStatus(sim.status, `Hashed in ${ms.toFixed(1)} ms`, 'success');
            } else if (currentTab === 'Compress') {
                const { result: compressed, ms } = time(() => wasm(compress, input));
                const ratio = ((1 - compressed.length / input.length) * 100).toFixed(1);
                sim.display.innerHTML = `
                    <div class="sim-stats-grid">
                        <div class="sim-stat-card"><div class="sim-stat-label">Original</div><div class="sim-stat-value">${input.length} bytes</div></div>
                        <div class="sim-stat-card"><div class="sim-stat-label">Compressed</div><div class="sim-stat-value">${compressed.length} bytes</div></div>
                        <div class="sim-stat-card"><div class="sim-stat-label">Reduction</div><div class="sim-stat-value">${ratio}%</div></div>
                    </div>
                    <div style="padding:1rem"><div class="sim-section-label">Compressed Output (base64)</div><div style="font-family:var(--font-mono,'JetBrains Mono',monospace);font-size:0.75rem;word-break:break-all;color:#64748b;max-height:120px;overflow-y:auto">${compressed}</div></div>`;
                setStatus(sim.status, `Compressed in ${ms.toFixed(1)} ms`, 'success');
            } else {
                const { result: decompressed, ms } = time(() => wasm(decompress, input));
                sim.display.innerHTML = `
                    <div class="sim-stats-grid">
                        <div class="sim-stat-card"><div class="sim-stat-label">Compressed</div><div class="sim-stat-value">${input.length} bytes</div></div>
                        <div class="sim-stat-card"><div class="sim-stat-label">Decompressed</div><div class="sim-stat-value">${decompressed.length} bytes</div></div>
                    </div>
                    <div style="padding:1rem"><div class="sim-section-label">Output</div><div style="font-family:var(--font-mono,'JetBrains Mono',monospace);font-size:0.75rem;word-break:break-all;color:#1e293b;max-height:200px;overflow-y:auto">${decompressed}</div></div>`;
                setStatus(sim.status, `Decompressed in ${ms.toFixed(1)} ms`, 'success');
            }
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    buildUI();
}

init();
