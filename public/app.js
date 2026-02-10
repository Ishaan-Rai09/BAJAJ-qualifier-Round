// =============================================
// BFHL API Frontend — Interactive Logic
// =============================================

(function () {
    'use strict';

    // --- DOM Elements ---
    const opCards = document.querySelectorAll('.op-card');
    const inputFib = document.getElementById('input-fibonacci');
    const inputArr = document.getElementById('input-array');
    const inputAI = document.getElementById('input-AI');
    const fibInput = document.getElementById('fibInput');
    const arrayInput = document.getElementById('arrayInput');
    const aiInput = document.getElementById('aiInput');
    const requestPreview = document.getElementById('requestPreview');
    const responsePreview = document.getElementById('responsePreview');
    const sendBtn = document.getElementById('sendBtn');
    const sendLoader = document.getElementById('sendLoader');
    const responseStatus = document.getElementById('responseStatus');
    const resultVisual = document.getElementById('resultVisual');
    const resultBody = document.getElementById('resultBody');
    const responseMeta = document.getElementById('responseMeta');
    const responseTime = document.getElementById('responseTime');
    const responseSize = document.getElementById('responseSize');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const copyReqBtn = document.getElementById('copyReqBtn');
    const copyResBtn = document.getElementById('copyResBtn');
    const exampleChips = document.querySelectorAll('.example-chip');

    let currentOp = 'fibonacci';

    // --- Background Particles ---
    function createParticles() {
        const container = document.getElementById('particles');
        const colors = ['rgba(129,140,248,0.15)', 'rgba(192,132,252,0.12)', 'rgba(244,114,182,0.1)'];
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 4 + 1;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            p.style.animationDuration = (Math.random() * 15 + 10) + 's';
            p.style.animationDelay = (Math.random() * 10) + 's';
            container.appendChild(p);
        }
    }

    // --- Health Check ---
    async function checkHealth() {
        try {
            const res = await fetch('/health');
            if (res.ok) {
                statusDot.className = 'status-dot online';
                statusText.textContent = 'API Online';
            } else {
                throw new Error();
            }
        } catch {
            statusDot.className = 'status-dot offline';
            statusText.textContent = 'API Offline';
        }
    }

    // --- Operation Switching ---
    function switchOp(op) {
        currentOp = op;
        opCards.forEach(c => c.classList.toggle('active', c.dataset.op === op));

        inputFib.classList.toggle('hidden', op !== 'fibonacci');
        inputArr.classList.toggle('hidden', !['prime', 'lcm', 'hcf'].includes(op));
        inputAI.classList.toggle('hidden', op !== 'AI');

        // Update array label
        if (['prime', 'lcm', 'hcf'].includes(op)) {
            const labels = { prime: 'Enter comma-separated integers', lcm: 'Enter comma-separated positive integers', hcf: 'Enter comma-separated positive integers' };
            document.querySelector('#input-array .input-label').textContent = labels[op];
        }

        updatePreview();
    }

    // --- Build Request Body ---
    function getRequestBody() {
        switch (currentOp) {
            case 'fibonacci': {
                const val = parseInt(fibInput.value, 10);
                return isNaN(val) ? { fibonacci: 10 } : { fibonacci: val };
            }
            case 'prime':
            case 'lcm':
            case 'hcf': {
                const raw = arrayInput.value.trim();
                if (!raw) return { [currentOp]: [2, 3, 5] };
                const arr = raw.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
                return { [currentOp]: arr.length ? arr : [2, 3, 5] };
            }
            case 'AI': {
                const q = aiInput.value.trim();
                return { AI: q || 'What is 2+2?' };
            }
            default:
                return {};
        }
    }

    function updatePreview() {
        const body = getRequestBody();
        requestPreview.textContent = JSON.stringify(body, null, 2);
    }

    // --- Send Request ---
    async function sendRequest() {
        const body = getRequestBody();
        sendBtn.disabled = true;
        sendLoader.classList.remove('hidden');
        responsePreview.textContent = '// Loading...';
        responsePreview.className = 'code-content response-content';
        responseStatus.textContent = 'Loading...';
        responseStatus.className = 'panel-badge';
        resultVisual.classList.add('hidden');
        responseMeta.classList.add('hidden');

        const start = performance.now();

        try {
            const res = await fetch('/bfhl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const elapsed = Math.round(performance.now() - start);
            const data = await res.json();
            const jsonStr = JSON.stringify(data, null, 2);

            responsePreview.textContent = jsonStr;
            responseTime.textContent = elapsed + 'ms';
            responseSize.textContent = new Blob([jsonStr]).size + ' B';
            responseMeta.classList.remove('hidden');

            if (data.is_success) {
                responsePreview.className = 'code-content response-content success';
                responseStatus.textContent = '200 OK';
                responseStatus.className = 'panel-badge success';
                renderResult(data.data, currentOp);
            } else {
                responsePreview.className = 'code-content response-content error';
                responseStatus.textContent = res.status + ' Error';
                responseStatus.className = 'panel-badge error';
            }
        } catch (err) {
            responsePreview.textContent = JSON.stringify({ is_success: false, error: err.message }, null, 2);
            responsePreview.className = 'code-content response-content error';
            responseStatus.textContent = 'Network Error';
            responseStatus.className = 'panel-badge error';
        } finally {
            sendBtn.disabled = false;
            sendLoader.classList.add('hidden');
        }
    }

    // --- Result Visualization ---
    function renderResult(data, op) {
        resultBody.innerHTML = '';
        resultVisual.classList.remove('hidden');

        if (Array.isArray(data)) {
            data.forEach((val, i) => {
                const chip = document.createElement('span');
                chip.className = 'result-chip';
                chip.textContent = val;
                chip.style.animationDelay = (i * 0.04) + 's';
                resultBody.appendChild(chip);
            });
        } else if (op === 'AI') {
            const chip = document.createElement('span');
            chip.className = 'result-chip ai-answer';
            chip.textContent = data;
            resultBody.appendChild(chip);
        } else {
            const chip = document.createElement('span');
            chip.className = 'result-chip single';
            chip.textContent = data;
            resultBody.appendChild(chip);
        }
    }

    // --- Copy to Clipboard ---
    function copyToClipboard(text, btn) {
        navigator.clipboard.writeText(text).then(() => {
            const orig = btn.innerHTML;
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
            setTimeout(() => { btn.innerHTML = orig; }, 1500);
        });
    }

    // --- Event Listeners ---
    opCards.forEach(card => {
        card.addEventListener('click', () => switchOp(card.dataset.op));
    });

    fibInput.addEventListener('input', updatePreview);
    arrayInput.addEventListener('input', updatePreview);
    aiInput.addEventListener('input', updatePreview);

    sendBtn.addEventListener('click', sendRequest);

    // Enter key sends
    [fibInput, arrayInput, aiInput].forEach(input => {
        input.addEventListener('keydown', e => { if (e.key === 'Enter') sendRequest(); });
    });

    copyReqBtn.addEventListener('click', () => copyToClipboard(requestPreview.textContent, copyReqBtn));
    copyResBtn.addEventListener('click', () => copyToClipboard(responsePreview.textContent, copyResBtn));

    // Quick examples
    exampleChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const op = chip.dataset.op;
            const val = chip.dataset.value;
            switchOp(op);
            if (op === 'fibonacci') {
                fibInput.value = val;
            } else {
                arrayInput.value = val;
            }
            updatePreview();
            sendRequest();
        });
    });

    // --- Init ---
    createParticles();
    checkHealth();
    setInterval(checkHealth, 30000);
    updatePreview();
})();
