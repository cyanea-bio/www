// Cyanea Simulation Framework
// Shared utilities for all Learn page simulations

import init from '/wasm/cyanea_wasm.js';

// ─── WASM Loader ─────────────────────────────────
let wasmReady = null;

export function initWasm() {
    if (!wasmReady) {
        wasmReady = Promise.all([
            init(),
            document.fonts.load("16px 'KaTeX_Main'").catch(() => {}),
        ]);
    }
    return wasmReady;
}

// Unwrap WASM JSON envelope: {"ok": value} → value, {"error": msg} → throw
export function wasm(fn, ...args) {
    const raw = fn(...args);
    const parsed = JSON.parse(raw);
    if (parsed != null && typeof parsed === 'object' && 'ok' in parsed) return parsed.ok;
    if (parsed != null && typeof parsed === 'object' && 'error' in parsed) throw new Error(parsed.error);
    return parsed;
}

// ─── Simulation Layout ──────────────────────────
export function createSim(container, options = {}) {
    container.innerHTML = '';
    container.classList.add('sim-active');

    const controls = document.createElement('div');
    controls.className = 'sim-controls';
    container.appendChild(controls);

    const body = document.createElement('div');
    body.className = 'sim-body';
    container.appendChild(body);

    let display;
    if (options.canvas) {
        const wrap = document.createElement('div');
        wrap.className = 'sim-canvas-wrap';
        const canvas = document.createElement('canvas');
        canvas.className = 'sim-canvas';
        wrap.appendChild(canvas);
        body.appendChild(wrap);
        display = canvas;

        const resize = () => {
            const rect = wrap.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            const ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);
            if (options.onResize) options.onResize(canvas, ctx, rect);
        };
        requestAnimationFrame(resize);
        window.addEventListener('resize', resize);
    } else {
        const output = document.createElement('div');
        output.className = 'sim-output';
        body.appendChild(output);
        display = output;
    }

    const status = document.createElement('div');
    status.className = 'sim-status';
    container.appendChild(status);

    return { controls, display, status, body, container };
}

// ─── UI Control Helpers ─────────────────────────

export function slider(label, min, max, value, onChange, step) {
    const group = document.createElement('div');
    group.className = 'sim-control-group';

    const lbl = document.createElement('label');
    lbl.className = 'sim-label';
    const valSpan = document.createElement('span');
    valSpan.className = 'sim-label-value';
    valSpan.textContent = value;
    lbl.textContent = label + ' ';
    lbl.appendChild(valSpan);

    const input = document.createElement('input');
    input.type = 'range';
    input.className = 'sim-slider';
    input.min = min;
    input.max = max;
    input.value = value;
    if (step !== undefined) input.step = step;

    input.addEventListener('input', () => {
        const v = Number(input.value);
        valSpan.textContent = v % 1 === 0 ? v : v.toFixed(2);
        onChange(v);
    });

    group.appendChild(lbl);
    group.appendChild(input);
    return group;
}

export function select(label, options, onChange) {
    const group = document.createElement('div');
    group.className = 'sim-control-group';

    const lbl = document.createElement('label');
    lbl.className = 'sim-label';
    lbl.textContent = label;

    const sel = document.createElement('select');
    sel.className = 'sim-select';
    options.forEach(opt => {
        const o = document.createElement('option');
        if (typeof opt === 'object') {
            o.value = opt.value;
            o.textContent = opt.label;
        } else {
            o.value = opt;
            o.textContent = opt;
        }
        sel.appendChild(o);
    });

    sel.addEventListener('change', () => onChange(sel.value));
    group.appendChild(lbl);
    group.appendChild(sel);
    return group;
}

export function button(label, onClick, cls) {
    const btn = document.createElement('button');
    btn.className = 'sim-btn' + (cls ? ' ' + cls : '');
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
}

export function textarea(label, placeholder, value) {
    const group = document.createElement('div');
    group.className = 'sim-control-group sim-control-wide';

    if (label) {
        const lbl = document.createElement('label');
        lbl.className = 'sim-label';
        lbl.textContent = label;
        group.appendChild(lbl);
    }

    const ta = document.createElement('textarea');
    ta.className = 'sim-textarea';
    ta.placeholder = placeholder || '';
    ta.value = value || '';
    ta.spellcheck = false;
    group.appendChild(ta);
    return { element: group, textarea: ta };
}

export function numberInput(label, value, min, max, step, onChange) {
    const group = document.createElement('div');
    group.className = 'sim-control-group';

    const lbl = document.createElement('label');
    lbl.className = 'sim-label';
    lbl.textContent = label;

    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'sim-input';
    input.value = value;
    if (min !== undefined) input.min = min;
    if (max !== undefined) input.max = max;
    if (step !== undefined) input.step = step;

    input.addEventListener('change', () => onChange(Number(input.value)));
    group.appendChild(lbl);
    group.appendChild(input);
    return group;
}

export function buttonGroup(buttons) {
    const group = document.createElement('div');
    group.className = 'sim-btn-group';
    buttons.forEach(([label, onClick]) => {
        group.appendChild(button(label, onClick));
    });
    return group;
}

export function tabs(tabDefs, onChange) {
    const bar = document.createElement('div');
    bar.className = 'sim-tabs';
    tabDefs.forEach((t, i) => {
        const btn = document.createElement('button');
        btn.className = 'sim-tab' + (i === 0 ? ' active' : '');
        btn.textContent = t;
        btn.addEventListener('click', () => {
            bar.querySelectorAll('.sim-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            onChange(t, i);
        });
        bar.appendChild(btn);
    });
    return bar;
}

export function checkbox(label, checked, onChange) {
    const group = document.createElement('div');
    group.className = 'sim-control-group sim-control-inline';

    const lbl = document.createElement('label');
    lbl.className = 'sim-label sim-check-label';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = checked;
    input.addEventListener('change', () => onChange(input.checked));

    lbl.appendChild(input);
    lbl.appendChild(document.createTextNode(' ' + label));
    group.appendChild(lbl);
    return group;
}

// ─── Canvas Drawing Helpers ─────────────────────

export function drawBarChart(ctx, data, options = {}) {
    const { width, height, labels, colors, horizontal, maxVal, title, xLabel, yLabel } = options;
    const w = width || ctx.canvas.width / (window.devicePixelRatio || 1);
    const h = height || ctx.canvas.height / (window.devicePixelRatio || 1);
    const pad = { top: title ? 35 : 15, right: 15, bottom: labels ? 60 : 30, left: horizontal ? 100 : 55 };

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    if (title) {
        ctx.fillStyle = '#1e293b';
        ctx.font = `600 14px ${FONT_MATH}`;
        ctx.textAlign = 'center';
        ctx.fillText(title, w / 2, 22);
    }

    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;
    const max = maxVal || Math.max(...data, 1);

    if (horizontal) {
        const barH = Math.min(plotH / data.length - 2, 20);
        data.forEach((val, i) => {
            const y = pad.top + i * (plotH / data.length) + (plotH / data.length - barH) / 2;
            const barW = (val / max) * plotW;
            ctx.fillStyle = colors ? colors[i % colors.length] : PALETTE.primary;
            ctx.fillRect(pad.left, y, barW, barH);

            if (labels && labels[i]) {
                ctx.fillStyle = '#64748b';
                ctx.font = '500 11px "JetBrains Mono", monospace';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                ctx.fillText(labels[i], pad.left - 6, y + barH / 2);
            }
            ctx.fillStyle = '#475569';
            ctx.font = `12px ${FONT_MATH}`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(val.toLocaleString(), pad.left + barW + 5, y + barH / 2);
        });
    } else {
        const barW = Math.min(plotW / data.length - 2, 40);
        data.forEach((val, i) => {
            const x = pad.left + i * (plotW / data.length) + (plotW / data.length - barW) / 2;
            const barH = (val / max) * plotH;
            ctx.fillStyle = colors ? colors[i % colors.length] : PALETTE.primary;
            ctx.fillRect(x, pad.top + plotH - barH, barW, barH);

            if (labels && labels[i]) {
                ctx.save();
                ctx.fillStyle = '#64748b';
                ctx.font = `10px ${FONT_MATH}`;
                ctx.textAlign = 'right';
                ctx.translate(x + barW / 2, h - pad.bottom + 8);
                ctx.rotate(-Math.PI / 4);
                ctx.fillText(labels[i], 0, 0);
                ctx.restore();
            }
        });
    }

    // Axes
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + plotH);
    ctx.lineTo(pad.left + plotW, pad.top + plotH);
    ctx.stroke();
}

export function drawScatter(ctx, points, options = {}) {
    const { width, height, colors, labels: axisLabels, title, xRange, yRange, radius: r } = options;
    const w = width || ctx.canvas.width / (window.devicePixelRatio || 1);
    const h = height || ctx.canvas.height / (window.devicePixelRatio || 1);
    const pad = { top: title ? 35 : 15, right: 15, bottom: axisLabels ? 40 : 20, left: 50 };

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    if (title) {
        ctx.fillStyle = '#1e293b';
        ctx.font = `600 14px ${FONT_MATH}`;
        ctx.textAlign = 'center';
        ctx.fillText(title, w / 2, 22);
    }

    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    const xs = points.map(p => p[0]);
    const ys = points.map(p => p[1]);
    const xMin = xRange ? xRange[0] : Math.min(...xs);
    const xMax = xRange ? xRange[1] : Math.max(...xs);
    const yMin = yRange ? yRange[0] : Math.min(...ys);
    const yMax = yRange ? yRange[1] : Math.max(...ys);
    const xSpan = xMax - xMin || 1;
    const ySpan = yMax - yMin || 1;

    // Grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = pad.top + (plotH * i) / 4;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(pad.left + plotW, y);
        ctx.stroke();
    }

    // Points
    const dotR = r || 4;
    points.forEach((p, i) => {
        const px = pad.left + ((p[0] - xMin) / xSpan) * plotW;
        const py = pad.top + plotH - ((p[1] - yMin) / ySpan) * plotH;
        const c = colors ? colors[i % colors.length] : PALETTE.primary;
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(px, py, dotR, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Axes
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + plotH);
    ctx.lineTo(pad.left + plotW, pad.top + plotH);
    ctx.stroke();

    if (axisLabels) {
        ctx.fillStyle = '#64748b';
        ctx.font = `italic 12px ${FONT_MATH}`;
        ctx.textAlign = 'center';
        ctx.fillText(axisLabels[0] || '', pad.left + plotW / 2, h - 8);
        ctx.save();
        ctx.translate(14, pad.top + plotH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(axisLabels[1] || '', 0, 0);
        ctx.restore();
    }
}

export function drawHeatmap(ctx, matrix, options = {}) {
    const { width, height, labels, title, colorScale } = options;
    const w = width || ctx.canvas.width / (window.devicePixelRatio || 1);
    const h = height || ctx.canvas.height / (window.devicePixelRatio || 1);
    const pad = { top: title ? 35 : 15, right: 15, bottom: labels ? 60 : 15, left: labels ? 60 : 15 };

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    if (title) {
        ctx.fillStyle = '#1e293b';
        ctx.font = `600 14px ${FONT_MATH}`;
        ctx.textAlign = 'center';
        ctx.fillText(title, w / 2, 22);
    }

    const rows = matrix.length;
    const cols = matrix[0] ? matrix[0].length : 0;
    if (!rows || !cols) return;

    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;
    const cellW = plotW / cols;
    const cellH = plotH / rows;

    const flat = matrix.flat();
    const min = Math.min(...flat);
    const max = Math.max(...flat);
    const range = max - min || 1;

    matrix.forEach((row, r) => {
        row.forEach((val, c) => {
            const t = (val - min) / range;
            ctx.fillStyle = colorScale ? colorScale(t) : heatColor(t);
            ctx.fillRect(pad.left + c * cellW, pad.top + r * cellH, cellW, cellH);
        });
    });

    if (labels) {
        ctx.fillStyle = '#64748b';
        ctx.font = '10px "JetBrains Mono", monospace';
        labels.forEach((lbl, i) => {
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(lbl, pad.left - 4, pad.top + i * cellH + cellH / 2);
            ctx.save();
            ctx.textAlign = 'right';
            ctx.translate(pad.left + i * cellW + cellW / 2, pad.top + plotH + 4);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(lbl, 0, 0);
            ctx.restore();
        });
    }
}

function heatColor(t) {
    // Blue (cold) to Red (hot) via white
    if (t < 0.5) {
        const s = t * 2;
        const r = Math.round(230 + (255 - 230) * s);
        const g = Math.round(240 + (255 - 240) * s);
        const b = 255;
        return `rgb(${r},${g},${b})`;
    } else {
        const s = (t - 0.5) * 2;
        const r = 255;
        const g = Math.round(255 * (1 - s));
        const b = Math.round(255 * (1 - s));
        return `rgb(${r},${g},${b})`;
    }
}

export function drawText(ctx, x, y, text, style = {}) {
    ctx.fillStyle = style.color || '#1e293b';
    ctx.font = style.font || `13px ${FONT_MATH}`;
    ctx.textAlign = style.align || 'left';
    ctx.textBaseline = style.baseline || 'top';
    ctx.fillText(text, x, y);
}

// ─── Math Font ──────────────────────────────────
// KaTeX_Main is web-optimized Latin Modern (the LaTeX typeface)
export const FONT_MATH = "'KaTeX_Main', 'Latin Modern Math', 'STIX Two Math', 'Cambria Math', serif";

// ─── Color Palettes ─────────────────────────────

export const PALETTE = {
    primary: '#06B6D4',
    accent: '#8B5CF6',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    gray: '#94A3B8',
};

export const NT_COLORS = {
    A: '#22C55E', // green
    T: '#EF4444', // red
    U: '#EF4444',
    C: '#3B82F6', // blue
    G: '#EAB308', // yellow
    '-': '#CBD5E1',
};

export const AA_COLORS = {
    // Hydrophobic
    A: '#FFD700', V: '#FFD700', I: '#FFD700', L: '#FFD700', M: '#FFD700',
    F: '#FFD700', W: '#FFD700', P: '#FFD700',
    // Polar
    S: '#22C55E', T: '#22C55E', N: '#22C55E', Q: '#22C55E', Y: '#22C55E', C: '#22C55E',
    // Positive
    K: '#3B82F6', R: '#3B82F6', H: '#3B82F6',
    // Negative
    D: '#EF4444', E: '#EF4444',
    // Special
    G: '#94A3B8', '*': '#1e293b', '-': '#CBD5E1',
};

export const CLUSTER_COLORS = [
    '#06B6D4', '#8B5CF6', '#22C55E', '#EF4444', '#F59E0B',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
    '#0EA5E9', '#D946EF', '#10B981', '#F43F5E', '#FBBF24',
];

export const DIFFICULTY_COLORS = {
    beginner: '#22C55E',
    intermediate: '#06B6D4',
    advanced: '#8B5CF6',
};

// ─── Utility Functions ──────────────────────────

export function setStatus(status, text, type) {
    status.textContent = text;
    status.className = 'sim-status' + (type ? ' sim-status-' + type : '');
}

export function time(fn) {
    const t0 = performance.now();
    const result = fn();
    const dt = performance.now() - t0;
    return { result, ms: dt };
}

export function randomDNA(len) {
    const bases = 'ATCG';
    let seq = '';
    for (let i = 0; i < len; i++) {
        seq += bases[Math.floor(Math.random() * 4)];
    }
    return seq;
}

export function formatNumber(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return n.toLocaleString();
}
