(function() {
  // DOM Elements
  const appView = document.getElementById('appView');
  const previewView = document.getElementById('previewView');
  const singleModeBtn = document.getElementById('singleModeBtn');
  const splitModeBtn = document.getElementById('splitModeBtn');
  const singleMode = document.getElementById('singleMode');
  const splitMode = document.getElementById('splitMode');
  const runFullscreenBtn = document.getElementById('runFullscreenBtn');
  const backToEditBtn = document.getElementById('backToEditBtn');
  const refreshPreviewBtn = document.getElementById('refreshPreviewBtn');
  const resetDefaultBtn = document.getElementById('resetDefaultBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const previewIframe = document.getElementById('livePreviewFull');
  
  // Editor elements
  const singleEditor = document.getElementById('singleEditor');
  const htmlEditor = document.getElementById('htmlEditor');
  const cssEditor = document.getElementById('cssEditor');
  const jsEditor = document.getElementById('jsEditor');
  
  let currentMode = 'single';
  let currentRenderedHTML = '';
  
  // Example code for split mode
  const EXAMPLE_SPLIT_HTML = `<div class="password-container">
  <input type="password" id="password" placeholder="Enter password">
  <i id="togglePassword" class="fa-solid fa-eye-slash"></i>
</div>`;
  
  const EXAMPLE_SPLIT_CSS = `.password-container {
  position: relative;
  width: 300px;
  margin: 50px auto;
}
#password {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
}
#password:focus {
  border-color: #667eea;
}
#togglePassword {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
}
#togglePassword:hover {
  color: #667eea;
}`;
  
  const EXAMPLE_SPLIT_JS = `const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

if (togglePassword && password) {
  togglePassword.addEventListener("click", function() {
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });
}`;
  
  // Example for single mode
  const EXAMPLE_SINGLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Toggle Demo</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
    }
    .password-container {
      position: relative;
      width: 320px;
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #764ba2;
    }
    #password {
      width: 100%;
      padding: 12px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.3s;
    }
    #password:focus {
      border-color: #667eea;
    }
    #togglePassword {
      position: absolute;
      right: 52px;
      top: 72px;
      cursor: pointer;
      color: #666;
    }
    #togglePassword:hover {
      color: #667eea;
    }
  </style>
</head>
<body>
  <div class="password-container">
    <h2>Password Toggle</h2>
    <input type="password" id="password" placeholder="Enter password">
    <i id="togglePassword" class="fas fa-eye-slash"></i>
  </div>
  <script>
    const togglePassword = document.getElementById("togglePassword");
    const password = document.getElementById("password");
    
    togglePassword.addEventListener("click", function() {
      const type = password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", type);
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  <\/script>
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
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    ${cssContent}
  </style>
</head>
<body>
  ${htmlContent}
  <script>
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
  
  // Generate HTML from current mode
  function generateHTML() {
    if (currentMode === 'single') {
      let html = singleEditor.value;
      const hasDocType = /<!DOCTYPE\s+html/i.test(html);
      const hasHtmlTag = /<\s*html[\s>]/i.test(html);
      if (!hasDocType && !hasHtmlTag && html.trim().length > 0) {
        html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Preview</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <style>body { margin: 0; font-family: system-ui; }</style>
</head>
<body>
${html}
</body>
</html>`;
      }
      return html;
    } else {
      const htmlContent = htmlEditor.value || '<div style="padding:2rem; text-align:center;">✨ Enter HTML content</div>';
      const cssContent = cssEditor.value || '';
      const jsContent = jsEditor.value || '';
      return buildFromSplit(htmlContent, cssContent, jsContent);
    }
  }
  
  // Run preview and switch to fullscreen view
  function runFullscreenPreview() {
    currentRenderedHTML = generateHTML();
    
    try {
      previewIframe.srcdoc = currentRenderedHTML;
      appView.style.display = 'none';
      previewView.style.display = 'flex';
      showMessage('✓ Fullscreen preview ready', 1000);
    } catch (err) {
      console.error(err);
      showMessage('⚠️ Error rendering preview', 2000);
    }
  }
  
  // Refresh preview (useful for iframe reload)
  function refreshPreview() {
    if (currentRenderedHTML) {
      previewIframe.srcdoc = currentRenderedHTML;
      showMessage('⟳ Preview refreshed', 800);
    }
  }
  
  // Back to editor
  function backToEditor() {
    appView.style.display = 'flex';
    previewView.style.display = 'none';
    showMessage('✏️ Back to editing', 1000);
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
  }
  
  // Load example based on current mode
  function loadExample() {
    if (currentMode === 'single') {
      singleEditor.value = EXAMPLE_SINGLE_HTML;
      showMessage('📚 Loaded password toggle example', 1200);
    } else {
      htmlEditor.value = EXAMPLE_SPLIT_HTML;
      cssEditor.value = EXAMPLE_SPLIT_CSS;
      jsEditor.value = EXAMPLE_SPLIT_JS;
      showMessage('📚 Loaded password toggle example (split mode)', 1200);
    }
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
  }
  
  // Initialize
  function init() {
    // Start with empty editors
    singleEditor.value = '';
    htmlEditor.value = '';
    cssEditor.value = '';
    jsEditor.value = '';
    
    setMode('single');
    
    // Event listeners
    singleModeBtn.addEventListener('click', () => setMode('single'));
    splitModeBtn.addEventListener('click', () => setMode('split'));
    runFullscreenBtn.addEventListener('click', runFullscreenPreview);
    backToEditBtn.addEventListener('click', backToEditor);
    refreshPreviewBtn.addEventListener('click', refreshPreview);
    resetDefaultBtn.addEventListener('click', loadExample);
    clearAllBtn.addEventListener('click', clearAll);
    
    // Keyboard shortcut: Ctrl+Enter runs preview
    const editors = [singleEditor, htmlEditor, cssEditor, jsEditor];
    editors.forEach(editor => {
      if (editor) {
        editor.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runFullscreenPreview();
          }
        });
      }
    });
    
    showMessage('✨ Ready! Write your code and click "Run & Fullscreen Preview"', 2500);
  }
  
  init();
})();
