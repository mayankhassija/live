(function() {
  // DOM elements
  const editorTextarea = document.getElementById('codeEditor');
  const previewIframe = document.getElementById('livePreview');
  const runBtn = document.getElementById('runBtn');
  const resetBtn = document.getElementById('resetDefaultBtn');
  const clearBtn = document.getElementById('clearBtn');

  // Default demo: beautiful interactive card with counter
  const DEFAULT_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <title>Live Preview Demo | Interactive Card</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background: linear-gradient(145deg, #f5f7fe 0%, #e9eef9 100%);
      font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .glass-card {
      max-width: 550px;
      width: 100%;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(2px);
      border-radius: 2rem;
      box-shadow: 0 25px 45px -12px rgba(0,0,0,0.25), 0 2px 5px rgba(0,0,0,0.05);
      padding: 2rem 2rem 2.2rem;
      transition: all 0.2s ease;
      border: 1px solid rgba(255,255,255,0.6);
    }
    h1 {
      font-size: 1.9rem;
      font-weight: 700;
      background: linear-gradient(120deg, #1e2b6e, #4c3b9e);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      letter-spacing: -0.3px;
      margin-bottom: 1rem;
    }
    .badge {
      background: #e0e7ff;
      color: #2d3a8c;
      display: inline-block;
      padding: 0.2rem 0.8rem;
      border-radius: 30px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 1.2rem;
    }
    p {
      color: #2c3a5e;
      line-height: 1.5;
      margin: 1rem 0 1rem 0;
      font-weight: 500;
    }
    .counter-area {
      background: #f0f3fd;
      border-radius: 1.5rem;
      padding: 1rem 1.2rem;
      margin: 1.5rem 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .counter-value {
      font-size: 2.6rem;
      font-weight: 800;
      font-family: monospace;
      background: #fff;
      padding: 0.2rem 1rem;
      border-radius: 2rem;
      color: #2c3e66;
      box-shadow: inset 0 1px 3px #0001, 0 2px 3px white;
    }
    button {
      background: #2b3b6e;
      border: none;
      color: white;
      font-weight: 600;
      font-size: 1rem;
      padding: 0.6rem 1.2rem;
      border-radius: 40px;
      cursor: pointer;
      transition: 0.15s;
      font-family: inherit;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    button:hover {
      background: #1f2d58;
      transform: scale(0.98);
    }
    .reset-btn {
      background: #6c5b7b;
    }
    .reset-btn:hover {
      background: #4f3e63;
    }
    footer {
      margin-top: 1.5rem;
      font-size: 0.7rem;
      text-align: center;
      color: #7d8bb6;
      border-top: 1px solid #cfdbf5;
      padding-top: 1rem;
    }
    @media (max-width: 480px) {
      .glass-card { padding: 1.5rem; }
      h1 { font-size: 1.5rem; }
    }
  </style>
</head>
<body>
<div class="glass-card">
  <span class="badge">✨ LIVE PREVIEW SANDBOX</span>
  <h1>Interactive playground</h1>
  <p>Write HTML, CSS, JavaScript in the editor → click <strong>Run & Preview</strong>. This demo shows a reactive counter and dynamic styles.</p>
  <div class="counter-area">
    <span style="font-weight: 600;">❤️ Counter:</span>
    <span class="counter-value" id="counterDisplay">0</span>
    <div>
      <button id="incBtn">+ Increase</button>
      <button id="resetCounter" class="reset-btn">↺ Reset</button>
    </div>
  </div>
  <footer>⚡ Live preview updates instantly | built‑in sandbox</footer>
</div>
<script>
  let count = 0;
  const displaySpan = document.getElementById('counterDisplay');
  const incButton = document.getElementById('incBtn');
  const resetCounterBtn = document.getElementById('resetCounter');
  
  function updateUI() {
    if(displaySpan) displaySpan.innerText = count;
  }
  if(incButton) {
    incButton.addEventListener('click', () => {
      count++;
      updateUI();
    });
  }
  if(resetCounterBtn) {
    resetCounterBtn.addEventListener('click', () => {
      count = 0;
      updateUI();
    });
  }
  updateUI();
<\/script>
</body>
</html>`;

  // Helper: show floating message
  function showMessage(text, duration = 1800) {
    const existingToast = document.querySelector('.toast-msg');
    if(existingToast) existingToast.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerText = text;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Render code to iframe
  function renderPreview(htmlCode) {
    if (!previewIframe) return;
    try {
      let finalDoc = htmlCode;
      const hasDocType = /<!DOCTYPE\s+html/i.test(finalDoc);
      const hasHtmlTag = /<\s*html[\s>]/i.test(finalDoc);
      
      if (!hasDocType && !hasHtmlTag) {
        finalDoc = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Live Preview Snippet</title><style>body { margin: 1rem; font-family: system-ui; background: #fff; }</style></head>
<body>
${finalDoc}
</body>
</html>`;
      }
      
      previewIframe.srcdoc = finalDoc;
      showMessage('✓ Preview updated', 1000);
    } catch (err) {
      console.warn(err);
      showMessage('⚠️ Error rendering preview — check console', 2000);
      previewIframe.srcdoc = '<body style="background:#fff;font-family:monospace;padding:2rem;"><h3>❌ Render error</h3><p>Invalid HTML/CSS/JS syntax? Check your code.</p></body>';
    }
  }

  // Run preview with current editor content
  function runPreview() {
    const code = editorTextarea.value;
    renderPreview(code);
  }

  // Reset to default interactive demo
  function resetToDefault() {
    editorTextarea.value = DEFAULT_CODE;
    runPreview();
    showMessage('🔄 Reset to interactive demo', 1200);
  }

  // Clear editor with placeholder
  function clearEditor() {
    editorTextarea.value = `<!-- Paste your HTML/CSS/JS code here -->
<div style="font-family: system-ui; max-width: 600px; margin: 2rem auto; text-align: center; padding: 2rem; border-radius: 24px; background: #f3f4ff;">
  <h2>✨ Empty Sandbox</h2>
  <p>Write your own HTML/CSS/JS in the left panel and click "Run & Preview"</p>
  <button style="background:#5f4bdb; color:white; border:none; border-radius:40px; padding:8px 20px;">Example button</button>
</div>`;
    runPreview();
    showMessage('🗑️ Editor cleared — ready for your code', 1200);
  }

  // Initialize the application
  function init() {
    editorTextarea.value = DEFAULT_CODE;
    runPreview();
    
    runBtn.addEventListener('click', runPreview);
    resetBtn.addEventListener('click', resetToDefault);
    clearBtn.addEventListener('click', clearEditor);
    
    // Keyboard shortcut: Ctrl+Enter / Cmd+Enter
    editorTextarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runPreview();
      }
    });
  }

  init();
})();
