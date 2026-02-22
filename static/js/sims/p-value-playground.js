import { initWasm, wasm, createSim, slider, button, checkbox, setStatus, time, drawBarChart, PALETTE, FONT_MATH } from '/js/cyanea-sim.js';
import { t_test_two_sample, bonferroni, benjamini_hochberg } from '/wasm/cyanea_wasm.js';

function randomNormal(mean, sd) {
    const u1 = Math.random();
    const u2 = Math.random();
    return mean + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function generateSample(n, mean, sd) {
    return Array.from({ length: n }, () => randomNormal(mean, sd));
}

async function init() {
    await initWasm();
    const container = document.getElementById('sim-container');
    const sim = createSim(container, { canvas: true });

    let params = { n: 30, effect: 0.5, alpha: 0.05, nSims: 1000, correction: 'none', nTests: 1 };

    sim.controls.appendChild(slider('Sample size', 10, 500, params.n, v => { params.n = v; }));
    sim.controls.appendChild(slider('Effect size', 0, 2, params.effect, v => { params.effect = v; }, 0.1));
    sim.controls.appendChild(slider('Alpha', 0.01, 0.10, params.alpha, v => { params.alpha = v; }, 0.01));
    sim.controls.appendChild(slider('Simulations', 100, 10000, params.nSims, v => { params.nSims = v; }, 100));

    const corrSel = document.createElement('div');
    corrSel.className = 'sim-control-group';
    const corrLabel = document.createElement('label');
    corrLabel.className = 'sim-label';
    corrLabel.textContent = 'Correction';
    const corrSelect = document.createElement('select');
    corrSelect.className = 'sim-select';
    ['none', 'bonferroni', 'bh'].forEach(v => {
        const o = document.createElement('option');
        o.value = v;
        o.textContent = v === 'bh' ? 'Benjamini-Hochberg' : v.charAt(0).toUpperCase() + v.slice(1);
        corrSelect.appendChild(o);
    });
    corrSelect.addEventListener('change', () => { params.correction = corrSelect.value; });
    corrSel.appendChild(corrLabel);
    corrSel.appendChild(corrSelect);
    sim.controls.appendChild(corrSel);

    sim.controls.appendChild(slider('# Tests', 1, 20, params.nTests, v => { params.nTests = v; }));
    sim.controls.appendChild(button('Run', run, 'sim-btn-primary'));

    function run() {
        try {
            const { result: _, ms } = time(() => {
                const pValues = [];

                for (let s = 0; s < params.nSims; s++) {
                    const testPvals = [];
                    for (let t = 0; t < params.nTests; t++) {
                        const group1 = generateSample(params.n, 0, 1);
                        const group2 = generateSample(params.n, params.effect, 1);
                        const result = wasm(t_test_two_sample,
                            JSON.stringify(group1),
                            JSON.stringify(group2),
                            false
                        );
                        testPvals.push(result.p_value ?? result.p ?? 0);
                    }

                    // Apply correction if multiple tests
                    let corrected = testPvals;
                    if (params.nTests > 1 && params.correction !== 'none') {
                        try {
                            if (params.correction === 'bonferroni') {
                                corrected = wasm(bonferroni, JSON.stringify(testPvals));
                                if (corrected.corrected) corrected = corrected.corrected;
                            } else if (params.correction === 'bh') {
                                corrected = wasm(benjamini_hochberg, JSON.stringify(testPvals));
                                if (corrected.corrected) corrected = corrected.corrected;
                            }
                        } catch {
                            corrected = testPvals;
                        }
                    }

                    // Take the minimum p-value across tests for this simulation
                    pValues.push(Math.min(...(Array.isArray(corrected) ? corrected : [corrected])));
                }

                // Histogram
                const nBins = 20;
                const bins = new Array(nBins).fill(0);
                pValues.forEach(p => {
                    const bin = Math.min(Math.floor(p * nBins), nBins - 1);
                    bins[bin]++;
                });

                const canvas = sim.display;
                const ctx = canvas.getContext('2d');
                const dpr = window.devicePixelRatio || 1;
                const w = canvas.width / dpr;
                const h = canvas.height / dpr;

                // Draw bars
                const colors = bins.map((_, i) => {
                    const binEnd = (i + 1) / nBins;
                    return binEnd <= params.alpha ? '#EF4444' : '#06B6D4';
                });

                drawBarChart(ctx, bins, {
                    width: w,
                    height: h,
                    labels: bins.map((_, i) => ((i + 0.5) / nBins).toFixed(2)),
                    colors,
                    title: 'p-value Distribution',
                });

                // Draw alpha line
                const pad = { left: 55, right: 15, top: 35, bottom: 60 };
                const plotW = w - pad.left - pad.right;
                const alphaX = pad.left + params.alpha * plotW;
                ctx.strokeStyle = '#EF4444';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 3]);
                ctx.beginPath();
                ctx.moveTo(alphaX, pad.top);
                ctx.lineTo(alphaX, h - pad.bottom);
                ctx.stroke();
                ctx.setLineDash([]);

                // Alpha label
                ctx.fillStyle = '#EF4444';
                ctx.font = `italic 14px ${FONT_MATH}`;
                ctx.textAlign = 'left';
                ctx.fillText(`\u03B1 = ${params.alpha}`, alphaX + 4, pad.top + 10);

                // Stats
                const significant = pValues.filter(p => p < params.alpha).length;
                const power = significant / params.nSims;
                const expectedFP = params.effect === 0 ? params.alpha * params.nSims : '-';

                ctx.fillStyle = '#1e293b';
                ctx.font = `12px ${FONT_MATH}`;
                ctx.textAlign = 'left';
                const statsY = h - 15;
                ctx.fillText(`Significant: ${significant}/${params.nSims} (${(power * 100).toFixed(1)}%)`, pad.left, statsY);
                if (params.effect > 0) {
                    ctx.fillText(`Power: ${(power * 100).toFixed(1)}%`, pad.left + 220, statsY);
                } else {
                    ctx.fillText(`False positives: ${significant} (expected: ${(params.alpha * params.nSims).toFixed(0)})`, pad.left + 220, statsY);
                }
            });

            setStatus(sim.status, `${params.nSims} simulations in ${ms.toFixed(0)} ms`, 'success');
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    run();
}

init();
