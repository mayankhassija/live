(function() {
  // DOM Elements
  const singleModeBtn = document.getElementById('singleModeBtn');
  const splitModeBtn = document.getElementById('splitModeBtn');
  const singleMode = document.getElementById('singleMode');
  const splitMode = document.getElementById('splitMode');
  const runBtn = document.getElementById('runBtn');
  const resetDefaultBtn = document.getElementById('resetDefaultBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const previewIframe = document.getElementById('livePreview');
  
  // Editor elements
  const singleEditor = document.getElementById('singleEditor');
  const htmlEditor = document.getElementById('htmlEditor');
  const cssEditor = document.getElementById('cssEditor');
  const jsEditor = document.getElementById('jsEditor');
  
  let currentMode = 'single'; // 'single' or 'split'
  
  // Example code for split mode (empty but informative)
  const EXAMPLE_SPLIT_HTML = `<div class="modern-card">
  <h1>✨ Interactive Demo</h1>
  <p>This is a split-mode example. Edit HTML, CSS, and JavaScript separately!</p>
  <button id="actionBtn">Click Me</button>
  <div id="result" style="margin-top: 1rem; font-weight: bold;"></div>
</div>`;
  
  const EXAMPLE_SPLIT_CSS = `.modern-card {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  font-family: system-ui, -apple-system, sans-serif;
}
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
p {
  line-height: 1.5;
  opacity: 0.95;
}
button {
  background: white;
  color: #764ba2;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
#result {
  margin-top: 1rem;
  font-size: 1.1rem;
}`;
  
  const EXAMPLE_SPLIT_JS = `document.getElementById('actionBtn')?.addEventListener('click', function() {
  const resultDiv = document.getElementById('result');
  const clicks = (window.clickCount || 0) + 1;
  window.clickCount = clicks;
  resultDiv.innerHTML = '🎉 Button clicked ' + clicks + ' time' + (clicks === 1 ? '' : 's') + '!';
  console.log('Button clicked', clicks);
});`;
  
  // Example for single mode (complete HTML document)
  const EXAMPLE_SINGLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Single HTML Example</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      max-width: 500px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    h1 {
      color: #764ba2;
      margin-bottom: 1rem;
    }
    p {
      color: #666;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }
    button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 50px;
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.2s;
    }
    button:hover {
      transform: scale(1.05);
    }
    .counter {
      margin-top: 1rem;
      font-size: 1.2rem;
      color: #764ba2;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>🎨 Single HTML Mode</h1>
    <p>This is a complete HTML document with embedded CSS and JavaScript.</p>
    <button id="magicBtn">Click for Magic</button>
    <div class="counter" id="counterDisplay">✨ Ready</div>
  </div>
  <script>
    let count = 0;
    const btn = document.getElementById('magicBtn');
    const display = document.getElementById('counterDisplay');
    
    btn.addEventListener('click', () => {
      count++;
      display.innerHTML = '🎉 Clicked ' + count + ' time' + (count === 1 ? '' : 's') + '!';
      if (count % 5 === 0) {
        display.style.transform = 'scale(1.1)';
        setTimeout(() => display.style.transform = 'scale(1)', 300);
      }
    });
  </script>
</body>
</html>`;
  
  // Helper: show toast message
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
  
  // Build full HTML document from split pieces
  function buildFromSplit(htmlContent, cssContent, jsContent) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <title>Live Preview - Split Mode</title>
  <style>
    /* Reset & base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
      background: #f5f7fa;
      min-height: 100vh;
    }
    /* User CSS */
    ${cssContent}
  </style>
</head>
<body>
  ${htmlContent}
  <script>
    // User JavaScript
    (function() {
      try {
        ${jsContent}
      } catch(e) {
        console.error('Error in user script:', e);
      }
    })();
  <\/script>
</body>
</html>`;
  }
  
  // Render preview based on current mode
  function renderPreview() {
    let fullHtml = '';
    
    if (currentMode === 'single') {
      fullHtml = singleEditor.value;
      // If it doesn't look like a full document, wrap it
      const hasDocType = /<!DOCTYPE\s+html/i.test(fullHtml);
      const hasHtmlTag = /<\s*html[\s>]/i.test(fullHtml);
      if (!hasDocType && !hasHtmlTag) {
        fullHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Live Preview</title><style>body { margin: 1rem; font-family: system-ui; }</style></head>
<body>
${fullHtml}
</body>
</html>`;
      }
    } else {
      // Split mode: combine HTML, CSS, JS
      const htmlContent = htmlEditor.value || '<div style="padding:2rem; text-align:center;">✨ Enter HTML content</div>';
      const cssContent = cssEditor.value || '';
      const jsContent = jsEditor.value || '';
      fullHtml = buildFromSplit(htmlContent, cssContent, jsContent);
    }
    
    try {
      previewIframe.srcdoc = fullHtml;
      showMessage('✓ Preview updated', 1000);
    } catch (err) {
      console.error(err);
      showMessage('⚠️ Error rendering preview', 2000);
      previewIframe.srcdoc = '<body style="background:#fff;padding:2rem;"><h3>❌ Render Error</h3><p>Check your code syntax</p></body>';
    }
  }
  
  // Switch between single and split modes
  function setMode(mode) {
    currentMode = mode;
    
    if (mode === 'single') {
      singleMode.classList.add('active');
      splitMode.classList.remove('active');
      singleModeBtn.classList.add('active');
      splitModeBtn.classList.remove('active');
    } else {
      singleMode.classList.remove('active');
      splitMode.classList.add('active');
      singleModeBtn.classList.remove('active');
      splitModeBtn.classList.add('active');
    }
    
    renderPreview();
  }
  
  // Load example based on current mode
  function loadExample() {
    if (currentMode === 'single') {
      singleEditor.value = EXAMPLE_SINGLE_HTML;
      showMessage('📚 Loaded single HTML example', 1200);
    } else {
      htmlEditor.value = EXAMPLE_SPLIT_HTML;
      cssEditor.value = EXAMPLE_SPLIT_CSS;
      jsEditor.value = EXAMPLE_SPLIT_JS;
      showMessage('📚 Loaded split-mode example (HTML+CSS+JS)', 1200);
    }
    renderPreview();
  }
  
  // Clear all editors based on current mode
  function clearAll() {
    if (currentMode === 'single') {
      singleEditor.value = '';
      showMessage('🗑️ Editor cleared', 1000);
    } else {
      htmlEditor.value = '';
      cssEditor.value = '';
      jsEditor.value = '';
      showMessage('🗑️ HTML, CSS, and JS cleared', 1000);
    }
    renderPreview();
  }
  
  // Initialize empty state
  function init() {
    // Start empty in single mode
    singleEditor.value = '';
    htmlEditor.value = '';
    cssEditor.value = '';
    jsEditor.value = '';
    
    // Set initial mode
    setMode('single');
    
    // Event listeners
    singleModeBtn.addEventListener('click', () => setMode('single'));
    splitModeBtn.addEventListener('click', () => setMode('split'));
    runBtn.addEventListener('click', renderPreview);
    resetDefaultBtn.addEventListener('click', loadExample);
    clearAllBtn.addEventListener('click', clearAll);
    
    // Keyboard shortcut: Ctrl+Enter / Cmd+Enter
    const editors = [singleEditor, htmlEditor, cssEditor, jsEditor];
    editors.forEach(editor => {
      if (editor) {
        editor.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            renderPreview();
          }
        });
      }
    });
    
    // Initial empty preview
    renderPreview();
    showMessage('✨ Ready! Choose mode and paste your code', 2000);
  }
  
  init();
})();
