import { initWasm, wasm, createSim, textarea, select, buttonGroup, setStatus, time, PALETTE, CLUSTER_COLORS, FONT_MATH, parseFasta } from '/js/cyanea-sim.js';
import { evolutionary_distance, build_upgma, build_nj, newick_info } from '/wasm/cyanea_wasm.js';

const SAMPLE_FASTA = `>Human
ATGCGATCGATCGATCGATCGATCGATCG
>Chimp
ATGCGATCGATCAATCGATCGATCGATCG
>Gorilla
ATGCGATCAATCGATCAATCGATCGATCG
>Orangutan
ATGCAATCGATCGATCAATCAATCGATCG
>Mouse
ATGCAATCAATCAATCAATCAATCGATCG`;

async function init() {
    await initWasm();
    const container = document.getElementById('sim-container');
    const sim = createSim(container, { canvas: true });

    const { element: taEl, textarea: ta } = textarea('FASTA Sequences', 'Paste FASTA sequences...', SAMPLE_FASTA);
    sim.controls.appendChild(taEl);

    const distSel = select('Distance', [
        { value: 'p', label: 'p-distance' },
        { value: 'jc', label: 'Jukes-Cantor' },
        { value: 'k2p', label: 'Kimura 2P' },
    ], () => update());
    sim.controls.appendChild(distSel);

    const methodSel = select('Method', [
        { value: 'upgma', label: 'UPGMA' },
        { value: 'nj', label: 'Neighbor-Joining' },
    ], () => update());
    sim.controls.appendChild(methodSel);

    sim.controls.appendChild(buttonGroup([
        ['Sample', () => { ta.value = SAMPLE_FASTA; update(); }],
    ]));

    ta.addEventListener('input', update);

    function update() {
        const fasta = ta.value.trim();
        if (!fasta) {
            setStatus(sim.status, 'Enter FASTA sequences above');
            return;
        }

        const model = sim.controls.querySelectorAll('.sim-select')[0].value;
        const method = sim.controls.querySelectorAll('.sim-select')[1].value;

        try {
            const { result: _, ms } = time(() => {
                const records = parseFasta(fasta);
                if (records.length < 3) throw new Error('Need at least 3 sequences');

                const labels = records.map(r => r.name);
                const seqs = records.map(r => r.seq);
                const n = labels.length;

                // Build distance matrix
                const matrix = [];
                for (let i = 0; i < n; i++) {
                    const row = [];
                    for (let j = 0; j < n; j++) {
                        if (i === j) {
                            row.push(0);
                        } else {
                            const d = wasm(evolutionary_distance, seqs[i], seqs[j], model);
                            row.push(typeof d === 'number' ? d : d.distance || 0);
                        }
                    }
                    matrix.push(row);
                }

                const labelsJson = JSON.stringify(labels);
                const matrixJson = JSON.stringify(matrix);

                let newick;
                if (method === 'upgma') {
                    newick = wasm(build_upgma, labelsJson, matrixJson);
                } else {
                    newick = wasm(build_nj, labelsJson, matrixJson);
                }

                const newickStr = typeof newick === 'string' ? newick : newick.newick || newick;

                // Draw tree on canvas
                const canvas = sim.display;
                const ctx = canvas.getContext('2d');
                const dpr = window.devicePixelRatio || 1;
                const w = canvas.width / dpr;
                const h = canvas.height / dpr;

                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(0, 0, w, h);

                drawNewickTree(ctx, newickStr, labels, w, h);
            });

            setStatus(sim.status, `Tree built in ${ms.toFixed(1)} ms`, 'success');
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    update();
}

function parseNewick(s) {
    s = s.replace(/;$/, '').trim();
    let pos = 0;

    function parse() {
        const node = { children: [], length: 0, name: '' };
        if (s[pos] === '(') {
            pos++; // skip (
            node.children.push(parse());
            while (s[pos] === ',') {
                pos++; // skip ,
                node.children.push(parse());
            }
            pos++; // skip )
        }
        // Read name
        let name = '';
        while (pos < s.length && s[pos] !== ':' && s[pos] !== ',' && s[pos] !== ')' && s[pos] !== ';') {
            name += s[pos++];
        }
        node.name = name.trim();
        // Read branch length
        if (pos < s.length && s[pos] === ':') {
            pos++; // skip :
            let num = '';
            while (pos < s.length && '0123456789.eE-+'.includes(s[pos])) {
                num += s[pos++];
            }
            node.length = parseFloat(num) || 0;
        }
        return node;
    }

    return parse();
}

function layoutTree(node, depth = 0) {
    if (node.children.length === 0) {
        return { ...node, x: depth + node.length, y: 0, leaves: 1 };
    }
    const children = node.children.map(c => layoutTree(c, depth + node.length));
    let leafCount = 0;
    let yPos = 0;
    children.forEach((c, i) => {
        c.y = leafCount;
        leafCount += c.leaves;
        yPos += c.y + c.leaves / 2;
    });
    return { ...node, children, x: depth + node.length, y: yPos / children.length - 0.5, leaves: leafCount };
}

function getLeaves(node) {
    if (node.children.length === 0) return [node];
    return node.children.flatMap(getLeaves);
}

function drawNewickTree(ctx, newickStr, labels, w, h) {
    const tree = parseNewick(newickStr);
    const layout = layoutTree(tree);
    const leaves = getLeaves(layout);
    const numLeaves = leaves.length;

    // Assign y positions to leaves
    let leafIdx = 0;
    function assignY(node) {
        if (node.children.length === 0) {
            node.yPos = leafIdx++;
            return;
        }
        node.children.forEach(assignY);
        node.yPos = node.children.reduce((s, c) => s + c.yPos, 0) / node.children.length;
    }
    assignY(layout);

    // Find max depth
    function maxDepth(node, d = 0) {
        const nd = d + node.length;
        if (node.children.length === 0) return nd;
        return Math.max(...node.children.map(c => maxDepth(c, nd)));
    }
    const maxD = maxDepth(layout) || 1;

    const pad = { left: 40, right: 120, top: 30, bottom: 30 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    function toX(depth) { return pad.left + (depth / maxD) * plotW; }
    function toY(leafPos) { return pad.top + (leafPos / (numLeaves - 1 || 1)) * plotH; }

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;

    function drawNode(node, parentDepth) {
        const depth = parentDepth + node.length;
        const x = toX(depth);
        const y = toY(node.yPos);

        if (node.children.length > 0) {
            // Draw vertical line connecting children
            const ys = node.children.map(c => toY(c.yPos));
            ctx.beginPath();
            ctx.moveTo(x, Math.min(...ys));
            ctx.lineTo(x, Math.max(...ys));
            ctx.stroke();

            // Draw horizontal lines to children
            node.children.forEach(c => {
                const cx = toX(depth + c.length);
                const cy = toY(c.yPos);
                ctx.beginPath();
                ctx.moveTo(x, cy);
                ctx.lineTo(cx, cy);
                ctx.stroke();
                drawNode(c, depth);
            });
        } else {
            // Leaf label
            ctx.fillStyle = '#1e293b';
            ctx.font = `italic 12px ${FONT_MATH}`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.name, x + 8, y);

            // Leaf dot
            const idx = labels.indexOf(node.name);
            ctx.fillStyle = CLUSTER_COLORS[idx % CLUSTER_COLORS.length];
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Root connection
    const rootX = toX(0);
    const rootY = toY(layout.yPos);
    const rootEndX = toX(layout.length);
    ctx.beginPath();
    ctx.moveTo(rootX, rootY);
    ctx.lineTo(rootEndX, rootY);
    ctx.stroke();

    drawNode(layout, 0);

    // Title
    ctx.fillStyle = '#1e293b';
    ctx.font = `600 14px ${FONT_MATH}`;
    ctx.textAlign = 'center';
    ctx.fillText('Phylogenetic Tree', w / 2, 18);
}

init();
