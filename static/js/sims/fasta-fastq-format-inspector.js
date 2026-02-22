import { initWasm, wasm, createSim, textarea, buttonGroup, setStatus, time, NT_COLORS } from '/js/cyanea-sim.js';
import { parse_fasta, parse_fastq, gc_content_json } from '/wasm/cyanea_wasm.js';

const FASTA_SAMPLE = `>seq1 Homo sapiens hemoglobin alpha
ATGGTGCTGTCTCCTGCCGACAAGACCAACGTCAAGGCCGCCTGGGGTAAGGTCGGCGCG
CACGCTGGCGAGTATGGTGCGGAGGCCCTGGAGAGGATGTTCCTGTCCTTCCCCACCACC
>seq2 Mus musculus hemoglobin beta
ATGGTGCACCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAAC
GTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGCTGCTGGTGGTCTACCCTTGGACCCAG`;

const FASTQ_SAMPLE = `@read1 length=60
ATGCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATC
+
IIIIIIIIIIHHHHHHGGGGGGFFFFFEEEEEDDDDDDCCCCCCBBBBBBAAAAAAA9999
@read2 length=60
GCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAG
+
IIIIIIIIIIIIIIHHHHHHHGGGGGGFFFFFFEEEEEEDDDDDDCCCCCCCBBBBBBAAA
@read3 length=60
TTTTAAAACCCCGGGGTTTTAAAACCCCGGGGTTTTAAAACCCCGGGGTTTTAAAACCCCGG
+
HHHHHGGGGGGFFFFFEEEEEDDDDDDCCCCCCBBBBBBAAAAAAA99999888887777`;

const PAIRED_SAMPLE = `@read1/1
ATGCGATCGATCGATCGATCGATCGATCGATCGATCGATCG
+
IIIIIIIIIIHHHHHHGGGGGGFFFFFEEEEEDDDDDDCCCC
@read1/2
CGATCGATCGATCGATCGATCGATCGATCGATCGATCGATG
+
IIIIIIIIIIIIIIHHHHHHHGGGGGGFFFFFFEEEEEEDDDD`;

async function init() {
    await initWasm();
    const container = document.getElementById('sim-container');
    const sim = createSim(container);

    const { element: taEl, textarea: ta } = textarea('File Content', 'Paste FASTA or FASTQ content...', FASTA_SAMPLE);
    sim.controls.appendChild(taEl);

    sim.controls.appendChild(buttonGroup([
        ['FASTA', () => { ta.value = FASTA_SAMPLE; update(); }],
        ['FASTQ', () => { ta.value = FASTQ_SAMPLE; update(); }],
        ['Paired', () => { ta.value = PAIRED_SAMPLE; update(); }],
    ]));

    ta.addEventListener('input', update);

    function update() {
        const content = ta.value.trim();
        if (!content) {
            sim.display.innerHTML = '<div style="padding:2rem;color:#94a3b8;text-align:center">Paste file content above</div>';
            setStatus(sim.status, '');
            return;
        }

        // Auto-detect format
        const firstChar = content.charAt(0);
        const isFastq = firstChar === '@';
        const isFasta = firstChar === '>';

        try {
            const { result: _, ms } = time(() => {
                let html = '';

                // Format badge
                const format = isFastq ? 'FASTQ' : isFasta ? 'FASTA' : 'Unknown';
                html += `<div style="padding:0.5rem 1rem;display:flex;align-items:center;gap:0.5rem">`;
                html += `<span class="sim-badge sim-badge-info">${format}</span>`;
                html += '</div>';

                if (isFasta) {
                    html += renderFasta(content);
                } else if (isFastq) {
                    html += renderFastq(content);
                } else {
                    html += '<div style="padding:1rem;color:#EF4444">Unknown format. File should start with > (FASTA) or @ (FASTQ)</div>';
                }

                sim.display.innerHTML = html;
            });

            setStatus(sim.status, `Parsed in ${ms.toFixed(1)} ms`, 'success');
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    function renderFasta(content) {
        const records = wasm(parse_fasta, content);
        let totalBases = 0;
        let totalGC = 0;

        let html = '<div style="padding:0 1rem">';

        records.forEach(rec => {
            const name = rec.name || rec.id || 'unnamed';
            const seq = rec.sequence || rec.seq || '';
            totalBases += seq.length;

            let gc = 0;
            try { gc = wasm(gc_content_json, seq); } catch {}
            totalGC += gc * seq.length;

            html += '<div class="sim-highlighted-record">';
            html += `<div style="color:#06B6D4;font-weight:600;font-size:0.8125rem">&gt;${escapeHtml(name)}</div>`;
            html += '<div style="font-family:var(--font-mono,monospace);font-size:0.75rem;word-break:break-all;line-height:1.8">';
            for (const base of seq) {
                const color = NT_COLORS[base] || '#94a3b8';
                html += `<span style="color:${color}">${base}</span>`;
            }
            html += '</div></div>';
        });

        // Stats
        const avgLen = records.length > 0 ? (totalBases / records.length).toFixed(0) : 0;
        const avgGC = totalBases > 0 ? ((totalGC / totalBases) * 100).toFixed(1) : 0;
        html += '<div class="sim-stats-grid">';
        html += statCard('Records', records.length);
        html += statCard('Total Bases', totalBases.toLocaleString());
        html += statCard('Avg Length', avgLen);
        html += statCard('GC%', avgGC + '%');
        html += '</div></div>';

        return html;
    }

    function renderFastq(content) {
        const records = wasm(parse_fastq, content);
        let totalBases = 0;
        let totalQual = 0;
        let qualCount = 0;

        let html = '<div style="padding:0 1rem">';

        records.forEach(rec => {
            const name = rec.name || rec.id || 'unnamed';
            const seq = rec.sequence || rec.seq || '';
            const qual = rec.quality || rec.qual || '';
            totalBases += seq.length;

            html += '<div class="sim-highlighted-record">';
            html += `<div style="color:#06B6D4;font-weight:600;font-size:0.8125rem">@${escapeHtml(name)}</div>`;

            // Sequence with base colors
            html += '<div style="font-family:var(--font-mono,monospace);font-size:0.75rem;word-break:break-all;line-height:1.8">';
            for (const base of seq) {
                const color = NT_COLORS[base] || '#94a3b8';
                html += `<span style="color:${color}">${base}</span>`;
            }
            html += '</div>';

            // Quality scores with color gradient
            html += '<div style="font-family:var(--font-mono,monospace);font-size:0.75rem;word-break:break-all;line-height:1.8;margin-top:0.125rem">';
            for (const ch of qual) {
                const phred = ch.charCodeAt(0) - 33;
                totalQual += phred;
                qualCount++;
                const t = Math.min(phred / 40, 1);
                const r = Math.round(239 * (1 - t) + 34 * t);
                const g = Math.round(68 * (1 - t) + 197 * t);
                const b = Math.round(68 * (1 - t) + 94 * t);
                html += `<span style="color:rgb(${r},${g},${b})" title="Q${phred}">${ch}</span>`;
            }
            html += '</div>';
            html += '</div>';
        });

        // Stats
        let gcVal = 0;
        try {
            const allSeq = records.map(r => r.sequence || r.seq || '').join('');
            gcVal = wasm(gc_content_json, allSeq);
        } catch {}

        const avgLen = records.length > 0 ? (totalBases / records.length).toFixed(0) : 0;
        const avgQual = qualCount > 0 ? (totalQual / qualCount).toFixed(1) : '-';
        html += '<div class="sim-stats-grid">';
        html += statCard('Records', records.length);
        html += statCard('Total Bases', totalBases.toLocaleString());
        html += statCard('Avg Length', avgLen);
        html += statCard('GC%', (gcVal * 100).toFixed(1) + '%');
        html += statCard('Avg Quality', 'Q' + avgQual);
        html += '</div></div>';

        return html;
    }

    update();
}

function statCard(label, value) {
    return `<div class="sim-stat-card"><div class="sim-stat-label">${label}</div><div class="sim-stat-value">${value}</div></div>`;
}

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

init();
