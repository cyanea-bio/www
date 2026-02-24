import { initWasm, wasm, createSim, tabs, slider, setStatus, time, drawScatter, CLUSTER_COLORS, PALETTE } from '/js/cyanea-sim.js';
import { kmer_count, euclidean_distance, pca, umap, tsne, kmeans, random_forest_classify, confusion_matrix, roc_curve } from '/wasm/cyanea_wasm.js';

function generateBlobs(nPerCluster, nClusters, dim) {
    const data = [];
    const labels = [];
    for (let c = 0; c < nClusters; c++) {
        const center = Array.from({ length: dim }, () => (Math.random() - 0.5) * 10);
        for (let i = 0; i < nPerCluster; i++) {
            const point = center.map(v => v + (Math.random() - 0.5) * 3);
            data.push(...point);
            labels.push(c);
        }
    }
    return { data, labels, n: nPerCluster * nClusters, dim };
}

async function init() {
    await initWasm();
    const container = document.getElementById('playground-container');
    const sim = createSim(container, { canvas: true });

    let currentTab = 'PCA';
    let nPoints = 50;
    let nClusters = 3;

    const tabBar = tabs(['PCA', 'UMAP', 'K-means'], (name) => {
        currentTab = name;
        run();
    });
    sim.controls.appendChild(tabBar);
    sim.controls.appendChild(slider('Points per cluster', 20, 200, nPoints, v => { nPoints = v; }));
    sim.controls.appendChild(slider('Clusters', 2, 6, nClusters, v => { nClusters = v; }));

    const runBtn = document.createElement('button');
    runBtn.className = 'sim-btn sim-btn-primary';
    runBtn.textContent = 'Run';
    runBtn.addEventListener('click', run);
    sim.controls.appendChild(runBtn);

    function run() {
        try {
            const { data, labels, n, dim } = generateBlobs(nPoints, nClusters, 10);
            const dataJSON = JSON.stringify(data);

            if (currentTab === 'PCA') {
                const { result, ms } = time(() => wasm(pca, dataJSON, dim, 2));
                const coords = result.coordinates || result.components || result;
                drawResult(coords, labels, n, 'PCA', ms);
            } else if (currentTab === 'UMAP') {
                const { result, ms } = time(() => wasm(umap, dataJSON, dim, 2, 15, 0.1, 200, 'euclidean'));
                const coords = result.coordinates || result.embedding || result;
                drawResult(coords, labels, n, 'UMAP', ms);
            } else {
                const { result: clust, ms } = time(() => wasm(kmeans, dataJSON, dim, nClusters, 100, 42));
                const assignments = clust.assignments || clust.labels || clust;
                // PCA for visualization
                const pcaResult = wasm(pca, dataJSON, dim, 2);
                const coords = pcaResult.coordinates || pcaResult.components || pcaResult;
                drawResult(coords, Array.isArray(assignments) ? assignments : labels, n, 'K-means (PCA view)', ms);
            }
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    function drawResult(coords, labels, n, title, ms) {
        const flat = Array.isArray(coords) ? coords : [];
        const points = [];
        const colors = [];
        for (let i = 0; i < n; i++) {
            const x = flat[i * 2] ?? 0;
            const y = flat[i * 2 + 1] ?? 0;
            points.push([x, y]);
            colors.push(CLUSTER_COLORS[(labels[i] || 0) % CLUSTER_COLORS.length]);
        }

        const canvas = sim.display;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;

        drawScatter(ctx, points, {
            width: w,
            height: h,
            colors,
            title,
            labels: ['Component 1', 'Component 2'],
            radius: 4,
        });
        setStatus(sim.status, `${n} points in ${ms.toFixed(0)} ms`, 'success');
    }

    run();
}

init();
