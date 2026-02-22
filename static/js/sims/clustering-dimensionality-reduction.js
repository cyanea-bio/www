import { initWasm, wasm, createSim, select, slider, checkbox, button, setStatus, time, drawScatter, CLUSTER_COLORS, FONT_MATH } from '/js/cyanea-sim.js';
import { pca, tsne, umap, kmeans } from '/wasm/cyanea_wasm.js';

// Synthetic Iris-like dataset: 3 clusters, 4 features, 50 samples each
function generateIrisLike(seed) {
    const rng = mulberry32(seed);
    const data = [];
    const labels = [];
    const centers = [[5.0, 3.4, 1.5, 0.2], [5.9, 2.8, 4.3, 1.3], [6.6, 3.0, 5.6, 2.0]];
    const spread = [0.4, 0.5, 0.5];
    const names = ['Setosa', 'Versicolor', 'Virginica'];

    centers.forEach((c, ci) => {
        for (let i = 0; i < 50; i++) {
            const point = c.map((v, fi) => v + (rng() - 0.5) * 2 * spread[ci]);
            data.push(...point);
            labels.push(ci);
        }
    });

    return { data, labels, names, nFeatures: 4, nSamples: 150 };
}

// Gene expression-like: 4 clusters, 10 features
function generateGeneExpr(seed) {
    const rng = mulberry32(seed);
    const data = [];
    const labels = [];
    const centers = [
        [8, 2, 1, 9, 3, 1, 7, 2, 8, 1],
        [2, 8, 7, 1, 8, 6, 2, 7, 1, 8],
        [5, 5, 8, 5, 2, 9, 5, 5, 5, 5],
        [1, 1, 2, 2, 9, 2, 1, 9, 2, 9],
    ];
    const names = ['Cluster A', 'Cluster B', 'Cluster C', 'Cluster D'];

    centers.forEach((c, ci) => {
        for (let i = 0; i < 40; i++) {
            const point = c.map(v => v + (rng() - 0.5) * 3);
            data.push(...point);
            labels.push(ci);
        }
    });

    return { data, labels, names, nFeatures: 10, nSamples: 160 };
}

function mulberry32(a) {
    return function() {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

async function init() {
    await initWasm();
    const container = document.getElementById('sim-container');
    const sim = createSim(container, { canvas: true });

    let dataset = 'iris';
    let algorithm = 'pca';
    let useKmeans = false;
    let kVal = 3;
    let perplexity = 30;
    let nNeighbors = 15;
    let minDist = 0.1;

    sim.controls.appendChild(select('Dataset', [
        { value: 'iris', label: 'Iris-like (3 clusters)' },
        { value: 'gene', label: 'Gene expression (4 clusters)' },
    ], v => { dataset = v; run(); }));

    sim.controls.appendChild(select('Algorithm', [
        { value: 'pca', label: 'PCA' },
        { value: 'tsne', label: 't-SNE' },
        { value: 'umap', label: 'UMAP' },
    ], v => { algorithm = v; run(); }));

    sim.controls.appendChild(slider('Perplexity', 5, 50, perplexity, v => { perplexity = v; }));
    sim.controls.appendChild(slider('n_neighbors', 5, 50, nNeighbors, v => { nNeighbors = v; }));
    sim.controls.appendChild(slider('min_dist', 0.01, 1.0, minDist, v => { minDist = v; }, 0.01));
    sim.controls.appendChild(checkbox('K-means', false, v => { useKmeans = v; run(); }));
    sim.controls.appendChild(slider('k', 2, 8, kVal, v => { kVal = v; if (useKmeans) run(); }));
    sim.controls.appendChild(button('Run', run, 'sim-btn-primary'));

    function run() {
        const ds = dataset === 'iris' ? generateIrisLike(42) : generateGeneExpr(42);

        try {
            const { result: _, ms } = time(() => {
                const dataJson = JSON.stringify(ds.data);
                let embedded;

                if (algorithm === 'pca') {
                    const result = wasm(pca, dataJson, ds.nFeatures, 2);
                    embedded = result.projected || result.coordinates || result;
                } else if (algorithm === 'tsne') {
                    const result = wasm(tsne, dataJson, ds.nFeatures, 2, perplexity, 200, 500, BigInt(42));
                    embedded = result.embedding || result.coordinates || result;
                } else {
                    const result = wasm(umap, dataJson, ds.nFeatures, 2, nNeighbors, minDist, 200, 'euclidean');
                    embedded = result.embedding || result.coordinates || result;
                }

                // Parse embedded points
                let points;
                if (Array.isArray(embedded) && embedded.length === ds.nSamples * 2) {
                    points = [];
                    for (let i = 0; i < ds.nSamples; i++) {
                        points.push([embedded[i * 2], embedded[i * 2 + 1]]);
                    }
                } else if (Array.isArray(embedded) && Array.isArray(embedded[0])) {
                    points = embedded;
                } else {
                    points = [];
                    for (let i = 0; i < ds.nSamples; i++) {
                        points.push([embedded[i * 2] || 0, embedded[i * 2 + 1] || 0]);
                    }
                }

                // Get colors based on labels or k-means
                let colorLabels = ds.labels;

                if (useKmeans) {
                    try {
                        const kmResult = wasm(kmeans, dataJson, ds.nFeatures, kVal, 100, BigInt(42));
                        colorLabels = kmResult.assignments || kmResult.labels || kmResult.clusters || ds.labels;
                    } catch {}
                }

                const colors = colorLabels.map(l => CLUSTER_COLORS[l % CLUSTER_COLORS.length]);

                // Draw
                const canvas = sim.display;
                const ctx = canvas.getContext('2d');
                const dpr = window.devicePixelRatio || 1;
                const w = canvas.width / dpr;
                const h = canvas.height / dpr;

                let axLabels;
                if (algorithm === 'pca') {
                    axLabels = ['PC1', 'PC2'];
                } else if (algorithm === 'tsne') {
                    axLabels = ['t-SNE 1', 't-SNE 2'];
                } else {
                    axLabels = ['UMAP 1', 'UMAP 2'];
                }

                drawScatter(ctx, points, {
                    width: w,
                    height: h,
                    colors,
                    labels: axLabels,
                    title: `${algorithm.toUpperCase()} — ${dataset === 'iris' ? 'Iris-like' : 'Gene Expression'}${useKmeans ? ` (k=${kVal})` : ''}`,
                    radius: 5,
                });

                // Legend
                const legendNames = useKmeans
                    ? Array.from({ length: kVal }, (_, i) => `Cluster ${i + 1}`)
                    : ds.names;

                ctx.font = `11px ${FONT_MATH}`;
                ctx.textAlign = 'left';
                legendNames.forEach((name, i) => {
                    const lx = w - 140;
                    const ly = 40 + i * 18;
                    ctx.fillStyle = CLUSTER_COLORS[i % CLUSTER_COLORS.length];
                    ctx.beginPath();
                    ctx.arc(lx, ly, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#475569';
                    ctx.fillText(name, lx + 10, ly + 4);
                });
            });

            setStatus(sim.status, `${algorithm.toUpperCase()} computed in ${ms.toFixed(0)} ms | ${dataset === 'iris' ? '150' : '160'} samples`, 'success');
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    run();
}

init();
