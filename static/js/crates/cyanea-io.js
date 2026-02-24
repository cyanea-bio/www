import { initWasm, wasm, createSim, textarea, tabs, setStatus, time } from '/js/cyanea-sim.js';
import { parse_fasta, parse_fastq, parse_vcf_text, parse_bed_text, parse_gff3_text, pileup_from_sam, parse_blast_xml, parse_gfa } from '/wasm/cyanea_wasm.js';

const SAMPLES = {
    FASTA: `>seq1 Human beta-globin
MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPKVKAHGKKVLG
>seq2 Mouse beta-globin
MVHLTDAEKAAVNGLWGKVNPDDVGGEALGRLLVVYPWTQRYFDSFGDLSSASAIMGNPKVKAHGKKVIN`,
    FASTQ: `@read1
ACGTACGTACGTACGTACGT
+
IIIIIIIIIIIIIIIIIII!
@read2
TGCATGCATGCATGCATGCA
+
IIIIIIIIIIIIIIIIIIII`,
    VCF: `##fileformat=VCFv4.2
##INFO=<ID=DP,Number=1,Type=Integer,Description="Depth">
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
chr1\t10000\trs1\tA\tG\t100\tPASS\tDP=50
chr1\t20000\trs2\tC\tT\t95\tPASS\tDP=42
chr2\t30000\trs3\tG\tA\t80\tPASS\tDP=38`,
    BED: `chr1\t100\t200\tpeak1\t500\t+
chr1\t300\t400\tpeak2\t350\t+
chr2\t500\t700\tpeak3\t800\t-
chr3\t1000\t1500\tpeak4\t120\t+`,
    GFF3: `##gff-version 3
chr1\tensembl\tgene\t1000\t9000\t.\t+\t.\tID=gene1;Name=BRCA1
chr1\tensembl\tmRNA\t1000\t9000\t.\t+\t.\tID=mrna1;Parent=gene1
chr1\tensembl\texon\t1000\t1200\t.\t+\t.\tID=exon1;Parent=mrna1`,
};

const PARSERS = {
    FASTA: parse_fasta,
    FASTQ: parse_fastq,
    VCF: parse_vcf_text,
    BED: parse_bed_text,
    GFF3: parse_gff3_text,
};

async function init() {
    await initWasm();
    const container = document.getElementById('playground-container');
    const sim = createSim(container);

    let currentTab = 'FASTA';
    const formats = Object.keys(SAMPLES);

    const tabBar = tabs(formats, (name) => {
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
        lbl.textContent = currentTab + ' Input';
        inputWrap.appendChild(lbl);

        ta = document.createElement('textarea');
        ta.className = 'sim-textarea';
        ta.spellcheck = false;
        ta.value = SAMPLES[currentTab];
        ta.style.minHeight = '120px';
        inputWrap.appendChild(ta);

        const runBtn = document.createElement('button');
        runBtn.className = 'sim-btn sim-btn-primary';
        runBtn.textContent = 'Parse';
        runBtn.addEventListener('click', run);
        btnWrap.appendChild(runBtn);

        run();
    }

    function run() {
        const input = ta.value.trim();
        if (!input) {
            sim.display.innerHTML = msg('Paste ' + currentTab + ' content above');
            return;
        }
        try {
            const parser = PARSERS[currentTab];
            const { result, ms } = time(() => wasm(parser, input));
            const records = Array.isArray(result) ? result : (result.records || result.variants || [result]);

            let html = `<div class="sim-stats-grid">`;
            html += stat('Format', currentTab);
            html += stat('Records', records.length);
            html += `</div>`;

            html += '<div style="padding:0 1rem 1rem;overflow-x:auto">';
            if (records.length > 0) {
                html += renderTable(records.slice(0, 50));
            }
            html += '</div>';

            sim.display.innerHTML = html;
            setStatus(sim.status, `Parsed ${records.length} records in ${ms.toFixed(1)} ms`, 'success');
        } catch (e) {
            setStatus(sim.status, 'Error: ' + e.message, 'error');
        }
    }

    buildUI();
}

function renderTable(records) {
    if (!records.length) return '';
    const keys = Object.keys(records[0]).filter(k => typeof records[0][k] !== 'object' || records[0][k] === null).slice(0, 8);
    let html = '<table style="width:100%;border-collapse:collapse;font-size:0.75rem;margin-top:0.5rem">';
    html += '<thead><tr>';
    for (const k of keys) html += `<th style="text-align:left;padding:0.375rem 0.5rem;border-bottom:2px solid #e2e8f0;color:#64748b;font-weight:600;white-space:nowrap">${k}</th>`;
    html += '</tr></thead><tbody>';
    for (const rec of records) {
        html += '<tr>';
        for (const k of keys) {
            let val = rec[k];
            if (typeof val === 'string' && val.length > 60) val = val.slice(0, 60) + '...';
            html += `<td style="padding:0.375rem 0.5rem;border-bottom:1px solid #f1f5f9;font-family:var(--font-mono,'JetBrains Mono',monospace);white-space:nowrap">${val ?? ''}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody></table>';
    return html;
}

function msg(text) {
    return `<div style="padding:2rem;color:#94a3b8;text-align:center">${text}</div>`;
}

function stat(label, value) {
    return `<div class="sim-stat-card"><div class="sim-stat-label">${label}</div><div class="sim-stat-value">${value}</div></div>`;
}

init();
