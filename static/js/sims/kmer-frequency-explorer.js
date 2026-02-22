import { initWasm, wasm, createSim, textarea, slider, buttonGroup, setStatus, time, randomDNA, drawBarChart, PALETTE } from '/js/cyanea-sim.js';
import { kmer_count } from '/wasm/cyanea_wasm.js';

const ECOLI_SAMPLE = 'ATGAAACGCATTAGCACCACCATTACCACCACCATCACCATTACCACAGGTAACGGTGCGGGCTGACGCGTACAGGAAACACAGAAAAAAGCCCGCACCTGACAGTGCGGGCTTTTTTTTTCGACCAAAGGTAACGAGGTAACAACCATGCGAGTGTTGAAGTTCGGCGGTACATCAGTGGCAAATGCAGAACGTTTTCTGCGTGTTGCCGATATTCTGGAAAGCAATGCCAGGCAGGGGCAGGTGGCCACCGTCCTCTCTGCCCCCGCCAAAATCACCAACCACCTGGTGGCGATGATTGAAAAAACCATTAGCGGCCAGGATGCTTTACCCAATATCAGCGATGCCGAACGTATTTTTGCCGAACTTTTGACGGGACTCGCCGCCGCCCAGCCGGGGTTCCCGCTGGCGCAATTG';
const GC_RICH = 'GCGCGCGCCGGCCGCGCGCGCCGGCGCGCCGGCGCGCGCCGCGCGCGCCGGCCGCGCGCGCCGGCGCGCCGGCGCGCGCCGCGCGCGCCG';

async function init() {
    await initWasm();
    const container = document.getElementById('sim-container');
    const sim = createSim(container, { canvas: true });

    let currentK = 3;
    let currentSeq = ECOLI_SAMPLE;

    const { element: taEl, textarea: ta } = textarea('Sequence', 'Paste a DNA sequence...', ECOLI_SAMPLE);
    sim.controls.appendChild(taEl);

    const sl = slider('k', 1, 12, 3, v => { currentK = v; update(); });
    sim.controls.appendChild(sl);

    sim.controls.appendChild(buttonGroup([
        ['E. coli', () => { ta.value = ECOLI_SAMPLE; currentSeq = ECOLI_SAMPLE; update(); }],
        ['Random', () => { const s = randomDNA(300); ta.value = s; currentSeq = s; update(); }],
        ['GC-rich', () => { ta.value = GC_RICH; currentSeq = GC_RICH; update(); }],
    ]));

    ta.addEventListener('input', () => {
        currentSeq = ta.value.trim().toUpperCase().replace(/[^ATCG]/g, '');
        update();
    });

    function update() {
        const seq = currentSeq;
        if (!seq || seq.length < currentK) {
            setStatus(sim.status, seq ? 'Sequence shorter than k' : 'Enter a sequence', 'error');
            return;
        }

        try {
            const { result: res, ms } = time(() => wasm(kmer_count, seq, currentK));
            const counts = res.counts || res;
            const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            const top30 = entries.slice(0, 30);

            const canvas = sim.display;
            const ctx = canvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;

            drawBarChart(ctx, top30.map(e => e[1]), {
                width: w,
                height: h,
                labels: top30.map(e => e[0]),
                horizontal: true,
                title: `Top ${top30.length} ${currentK}-mers`,
                colors: top30.map((_, i) => {
                    const t = i / top30.length;
                    return `hsl(${185 + t * 80}, 70%, ${50 + t * 15}%)`;
                }),
            });

            const total = entries.reduce((s, e) => s + e[1], 0);
            setStatus(sim.status, `${entries.length} distinct ${currentK}-mers, ${total.toLocaleString()} total | ${ms.toFixed(1)} ms`, 'success');
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    sim.display.closest('.sim-canvas-wrap')?.addEventListener('resize', update);
    update();
}

init();
