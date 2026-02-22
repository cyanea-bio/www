import { initWasm, wasm, createSim, select, slider, button, setStatus, time, PALETTE, CLUSTER_COLORS, FONT_MATH } from '/js/cyanea-sim.js';
import { kmer_count } from '/wasm/cyanea_wasm.js';

const PATTERNS = {
    Map: {
        desc: 'Each thread processes one element independently',
        animate(cells, frame, size) {
            const idx = frame % size;
            return cells.map((_, i) => i <= idx ? 'done' : i === idx + 1 ? 'active' : 'idle');
        },
        parallel: true,
    },
    Reduce: {
        desc: 'Tree-based merge: pairs combine until one result remains',
        animate(cells, frame, size) {
            const levels = Math.ceil(Math.log2(size));
            const level = Math.min(frame, levels);
            const stride = Math.pow(2, level);
            return cells.map((_, i) => {
                if (level === 0) return 'active';
                if (i % stride === 0 && i + stride / 2 < size) return 'active';
                if (i % stride === stride / 2) return 'merging';
                const prevStride = stride / 2;
                if (i % prevStride === 0 && i + prevStride / 2 < size) return 'done';
                return 'idle';
            });
        },
        parallel: false,
    },
    Scatter: {
        desc: 'Threads write to varying output positions',
        animate(cells, frame, size) {
            const f = frame % size;
            return cells.map((_, i) => {
                const target = (i * 7 + 3) % size;
                if (i < f) return target === i ? 'done' : 'idle';
                if (i === f) return 'active';
                return 'idle';
            });
        },
        parallel: false,
    },
    Stencil: {
        desc: 'Each output depends on a neighborhood of inputs',
        animate(cells, frame, size) {
            const idx = frame % size;
            return cells.map((_, i) => {
                if (i < idx - 1) return 'done';
                if (i >= idx - 1 && i <= idx + 1) return 'active';
                return 'idle';
            });
        },
        parallel: false,
    },
};

async function init() {
    await initWasm();
    const container = document.getElementById('sim-container');
    const sim = createSim(container, { canvas: true });

    let pattern = 'Map';
    let arraySize = 32;
    let speed = 5;
    let playing = false;
    let frame = 0;
    let animId = null;

    sim.controls.appendChild(select('Pattern', Object.keys(PATTERNS), v => { pattern = v; reset(); }));
    sim.controls.appendChild(slider('Array size', 16, 256, arraySize, v => { arraySize = v; reset(); }));
    sim.controls.appendChild(slider('Speed', 1, 20, speed, v => { speed = v; }));
    sim.controls.appendChild(button('Play', () => { playing = true; animate(); }, 'sim-btn-primary'));
    sim.controls.appendChild(button('Pause', () => { playing = false; if (animId) cancelAnimationFrame(animId); }));
    sim.controls.appendChild(button('Reset', reset));

    function reset() {
        frame = 0;
        playing = false;
        if (animId) cancelAnimationFrame(animId);
        draw();
    }

    function animate() {
        if (!playing) return;
        frame++;
        draw();
        setTimeout(() => { animId = requestAnimationFrame(animate); }, 1000 / speed);
    }

    function draw() {
        const canvas = sim.display;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        const pat = PATTERNS[pattern];

        // Title
        ctx.fillStyle = '#1e293b';
        ctx.font = `600 14px ${FONT_MATH}`;
        ctx.textAlign = 'center';
        ctx.fillText(`${pattern} Pattern`, w / 2, 22);

        // Description
        ctx.fillStyle = '#64748b';
        ctx.font = `12px ${FONT_MATH}`;
        ctx.fillText(pat.desc, w / 2, 40);

        // Grid area
        const gridTop = 60;
        const gridLeft = 30;
        const gridRight = pat.parallel ? w - 30 : w * 0.65;
        const gridW = gridRight - gridLeft;
        const cols = Math.ceil(Math.sqrt(arraySize));
        const rows = Math.ceil(arraySize / cols);
        const cellSize = Math.min(gridW / cols, (h - gridTop - 80) / rows, 30);

        const cells = new Array(arraySize).fill(0);
        const states = pat.animate(cells, frame, arraySize);

        const stateColors = {
            idle: '#e2e8f0',
            active: '#06B6D4',
            done: '#22C55E',
            merging: '#8B5CF6',
        };

        for (let i = 0; i < arraySize; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = gridLeft + col * (cellSize + 2);
            const y = gridTop + row * (cellSize + 2);

            ctx.fillStyle = stateColors[states[i]] || stateColors.idle;
            ctx.fillRect(x, y, cellSize, cellSize);

            if (cellSize > 12) {
                ctx.fillStyle = states[i] === 'idle' ? '#94a3b8' : '#ffffff';
                ctx.font = `${Math.min(cellSize * 0.4, 10)}px "JetBrains Mono", monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(i, x + cellSize / 2, y + cellSize / 2);
            }
        }

        // Legend
        const legendY = gridTop + rows * (cellSize + 2) + 15;
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'left';
        let lx = gridLeft;
        Object.entries(stateColors).forEach(([state, color]) => {
            ctx.fillStyle = color;
            ctx.fillRect(lx, legendY, 12, 12);
            ctx.fillStyle = '#475569';
            ctx.fillText(state.charAt(0).toUpperCase() + state.slice(1), lx + 16, legendY + 10);
            lx += 80;
        });

        // Frame counter
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`Frame: ${frame}`, w - 30, legendY + 10);

        // Benchmark sidebar (right side)
        if (!pat.parallel) {
            drawBenchmark(ctx, w * 0.68, gridTop, w * 0.3, h - gridTop - 60);
        }

        setStatus(sim.status, `${pattern} | Array: ${arraySize} | Frame: ${frame}${playing ? ' (playing)' : ''}`, playing ? 'success' : '');
    }

    function drawBenchmark(ctx, x, y, w, h) {
        ctx.fillStyle = '#1e293b';
        ctx.font = `600 12px ${FONT_MATH}`;
        ctx.textAlign = 'left';
        ctx.fillText('K-mer Benchmark', x, y + 12);

        ctx.fillStyle = '#64748b';
        ctx.font = `11px ${FONT_MATH}`;
        ctx.fillText('Real compute time (WASM)', x, y + 28);

        const sizes = [100, 500, 1000, 5000];
        const bases = 'ATCG';
        const times = [];

        sizes.forEach(sz => {
            let seq = '';
            for (let i = 0; i < sz; i++) seq += bases[Math.floor(Math.random() * 4)];
            const t0 = performance.now();
            try { wasm(kmer_count, seq, 4); } catch {}
            times.push(performance.now() - t0);
        });

        const maxTime = Math.max(...times, 0.1);
        const barH = 18;
        const gap = 8;

        sizes.forEach((sz, i) => {
            const by = y + 45 + i * (barH + gap);
            const barW = (times[i] / maxTime) * (w - 80);

            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(x, by, w - 60, barH);

            ctx.fillStyle = CLUSTER_COLORS[i % CLUSTER_COLORS.length];
            ctx.fillRect(x, by, Math.max(barW, 2), barH);

            ctx.fillStyle = '#475569';
            ctx.font = `10px ${FONT_MATH}`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${sz} bp`, x + w - 55, by + barH / 2);

            ctx.textAlign = 'right';
            ctx.fillText(`${times[i].toFixed(2)} ms`, x + w - 0, by + barH / 2);
        });
    }

    draw();
}

init();
