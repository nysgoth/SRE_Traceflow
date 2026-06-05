// Common JavaScript functionality for SRE Helper Tool

// Copy to clipboard with visual feedback and fallback for Windows compatibility
function copyToClipboard(text, button) {
  if (!text || text.includes('Please') || text.includes('No valid')) {
    return;
  }
  
  // Function to show success feedback
  const showSuccess = () => {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>Copied!';
    button.style.background = '#2a2a2a';
    button.style.color = '#ffffff';
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = '';
      button.style.color = '';
    }, 2000);
  };
  
  // Fallback method using execCommand (works better on some Windows systems)
  const fallbackCopy = () => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        showSuccess();
        return true;
      }
      return false;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  };
  
  // Try modern clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        showSuccess();
      })
      .catch(() => {
        // If modern API fails, try fallback method
        if (!fallbackCopy()) {
          alert('Failed to copy to clipboard');
        }
      });
  } else {
    // If clipboard API not available, use fallback
    if (!fallbackCopy()) {
      alert('Failed to copy to clipboard');
    }
  }
}

// Show success animation
function showSuccessAnimation(element) {
  element.style.transform = 'scale(1.02)';
  setTimeout(() => element.style.transform = 'scale(1)', 200);
}

// Format datetime for input fields
function formatDateTimeForInput(date) {
  const pad = n => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Initialize default time values (10 minutes ago to now)
function initializeTimeInputs(startId, endId) {
  const now = new Date();
  const tenMinutesAgo = new Date(now - 10 * 60000);
  
  const startElement = document.getElementById(startId);
  const endElement = document.getElementById(endId);
  
  if (startElement) startElement.value = formatDateTimeForInput(tenMinutesAgo);
  if (endElement) endElement.value = formatDateTimeForInput(now);
}

// Validate required fields
function validateFields(fields) {
  for (const field of fields) {
    const element = document.getElementById(field.id);
    if (!element || !element.value.trim()) {
      return { valid: false, message: field.message || `Please fill ${field.id}` };
    }
  }
  return { valid: true };
}

// Show error message
function showError(element, message) {
  element.textContent = message;
  element.style.color = '#ff6b6b';
}

// Show success message
function showSuccess(element, content) {
  element.textContent = content;
  element.style.color = '#ffffff';
  showSuccessAnimation(element);
}

// Replace Font Awesome <i> with inline SVG use
(function replaceIconsWithSVG(){
  const map = {
    'fa-link':'link', 'fa-chart-line':'chart-line', 'fa-map':'map', 'fa-id-card':'id-card',
    'fa-play':'play', 'fa-copy':'copy', 'fa-search':'search', 'fa-sync':'sync', 'fa-plus':'plus',
    'fa-download':'download', 'fa-wrench':'wrench', 'fa-arrow-left':'arrow-left', 'fa-check':'check-circle', 'fa-exclamation-circle':'exclamation-circle'
  };
  document.querySelectorAll('i.fas').forEach(el => {
    const cls = Array.from(el.classList).find(c => c.startsWith('fa-') && c !== 'fas');
    const id = map[cls];
    if(id){
      const span = document.createElement('span');
      span.setAttribute('aria-hidden','true');
      span.style.display='inline-flex'; span.style.width='14px'; span.style.height='14px'; span.style.alignItems='center'; span.style.justifyContent='center';
      span.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24"><use href="assets/icons.svg#${id}"></use></svg>`;
      el.replaceWith(span);
    }
  });
  // Navbar logo: prepend svg if not present
  document.querySelectorAll('.nav-logo').forEach(a => {
    if(!a.querySelector('use')){
      const icon = document.createElement('span');
      icon.className='nav-logo-icon';
      icon.style.display='inline-flex'; icon.style.width='1.1rem'; icon.style.height='1.1rem'; icon.style.alignItems='center'; icon.style.justifyContent='center';
      icon.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%"><use href="assets/icons.svg#project-diagram"></use></svg>`;
      a.prepend(icon);
      a.insertBefore(document.createTextNode(' '), icon.nextSibling);
    }
  });
})();

// Cool gradient background with floating elements
(function initBackgroundEffect() {
  // Create subtle floating orbs - more orbs, smaller size
  const orbCount = 24;
  
  for (let i = 0; i < orbCount; i++) {
    const orb = document.createElement('div');
    const size = Math.random() * 100 + 75;
    const duration = Math.random() * 8 + 6;
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    // Use negative delay to start animation partway through the cycle immediately
    const delay = -(Math.random() * duration);
    
    orb.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03));
      pointer-events: none;
      z-index: -1;
      filter: blur(50px);
      left: ${startX}%;
      top: ${startY}%;
      animation: float ${duration}s ease-in-out infinite;
      animation-delay: ${delay}s;
      opacity: 0.7;
    `;
    
    document.body.appendChild(orb);
  }
  
  // Add float animation dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 0.7;
      }
      25% {
        transform: translate(120px, -120px) scale(1.2);
        opacity: 0.9;
      }
      50% {
        transform: translate(-80px, 160px) scale(0.8);
        opacity: 0.6;
      }
      75% {
        transform: translate(160px, 80px) scale(1.15);
        opacity: 0.85;
      }
    }
  `;
  document.head.appendChild(style);
})();

// Fix footer alignment on Windows (account for scrollbar width)
(function fixFooterScrollbarAlignment() {
  function updateFooterPadding() {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    
    // Calculate scrollbar width
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);
    
    const inner = document.createElement('div');
    outer.appendChild(inner);
    
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    document.body.removeChild(outer);
    
    // Only adjust if scrollbar is visible and takes space (Windows behavior)
    if (scrollbarWidth > 0 && document.documentElement.scrollHeight > document.documentElement.clientHeight) {
      footer.style.paddingRight = `${20 + scrollbarWidth}px`;
    } else {
      footer.style.paddingRight = '20px';
    }
  }
  
  // Update on load and resize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateFooterPadding);
  } else {
    updateFooterPadding();
  }
  
  window.addEventListener('resize', updateFooterPadding);
})();


// Utilities Panel System - Available on all pages
(function initUtilitiesPanel() {
  'use strict';

  // Utility definitions
  const utilities = [
    {
      id: 'client-id-transform',
      name: 'Client ID Transform',
      icon: 'assets/icons/id-card_white.svg',
      description: 'Quick client ID transformation and formatting. The database requires 17 digits, so shorter IDs will be padded with leading zeros.'
    },
    {
      id: 'comma-separated',
      name: 'Comma-Separated Formatter',
      icon: 'assets/icons/wrench_white.svg',
      description: 'Format values into a clean comma-separated string with quotes and removes duplicate entries for easier KQL search'
    },
    {
      id: 'json-pretty',
      name: 'JSON Pretty Formatter',
      icon: 'assets/icons/wrench_white.svg',
      description: 'Format and prettify JSON with customizable indentation. Supports both pretty-printing and compact formatting with strict JSON validation.'
    }
  ];

  // Create utilities panel HTML
  function createUtilitiesPanel() {
    try {
      // Create button FIRST and append immediately to ensure it's visible
      const btn = document.createElement('button');
      btn.className = 'utilities-panel-toggle';
      btn.id = 'utilitiesToggle';
      btn.setAttribute('aria-label', 'Open utilities panel');
      btn.innerHTML = '<img src="assets/icons/wrench_white.svg" alt="Utilities">';
      document.body.appendChild(btn);
      console.log('✓ Utilities button created and appended to body');
      
      // Now create the rest of the panel (sidebar, modal)
      const panelHTML = `
        <div class="utilities-sidebar" id="utilitiesSidebar">
          <div class="utilities-sidebar-header">
            <h2><img src="assets/icons/wrench_white.svg" alt="" style="width:28px;height:28px;">Utilities</h2>
            <button class="utilities-sidebar-close" id="utilitiesSidebarClose" aria-label="Close utilities panel">×</button>
          </div>
          <div class="utilities-list" id="utilitiesList"></div>
        </div>
        <div class="utilities-modal-overlay" id="utilitiesModalOverlay">
          <div class="utilities-modal" id="utilitiesModal">
            <div class="utilities-modal-header">
              <h2 id="utilitiesModalTitle"></h2>
              <button class="utilities-modal-close" id="utilitiesModalClose" aria-label="Close utility">×</button>
            </div>
            <div class="utilities-modal-content" id="utilitiesModalContent"></div>
          </div>
        </div>
      `;
      
      // Append the rest of the panel directly to body (not in a container)
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = panelHTML;
      while (tempDiv.firstChild) {
        document.body.appendChild(tempDiv.firstChild);
      }
      
      // Populate utilities list
      const utilitiesList = document.getElementById('utilitiesList');
      if (utilitiesList) {
        utilities.forEach(util => {
          const item = document.createElement('div');
          item.className = 'utility-item';
          item.setAttribute('data-utility-id', util.id);
          item.innerHTML = `
            <img src="${util.icon}" alt="" class="utility-item-icon">
            <span class="utility-item-name">${util.name}</span>
          `;
          item.addEventListener('click', () => openUtility(util.id));
          utilitiesList.appendChild(item);
        });
        console.log('✓ Utilities panel created successfully');
      } else {
        console.error('✗ Utilities list not found!');
      }
    } catch (error) {
      console.error('✗ Error creating utilities panel:', error);
    }
  }


  // Open utility modal
  function openUtility(utilityId) {
    const utility = utilities.find(u => u.id === utilityId);
    if (!utility) return;

    const modal = document.getElementById('utilitiesModal');    const modalOverlay = document.getElementById('utilitiesModalOverlay');
    const modalTitle = document.getElementById('utilitiesModalTitle');
    const modalContent = document.getElementById('utilitiesModalContent');

    modalTitle.innerHTML = `<img src="${utility.icon}" alt="" style="width:32px;height:32px;">${utility.name}`;
    
    // Generate utility content based on ID
    modalContent.innerHTML = getUtilityHTML(utilityId);
    
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Initialize utility functions
    initUtilityFunctions(utilityId);
  }

  // Get utility HTML template
  function getUtilityHTML(utilityId) {
    switch(utilityId) {
      case 'client-id-transform':
        return `
          <p style="margin: 0 auto 20px auto; text-align: center; opacity: 0.8; max-width: 100%; width: 100%; display: block; font-size: 14px;">${utilities.find(u => u.id === utilityId).description}</p>
          <div class="input-section">
            <div class="input-wrapper">
              <input type="text" id="modal-numberInput" placeholder="Enter client ID (e.g., 739564)">
            </div>
          </div>
          <div class="action-section">
            <button onclick="modalFormatNumber()" class="analyze-btn">
              <img src="assets/icons/play_white.svg" alt="" width="16" height="16"> Transform
            </button>
          </div>
          <div id="modal-result" class="result" style="font-family: 'Consolas', 'Monaco', monospace; text-align: center; min-height: 40px; display: flex; align-items: center; justify-content: center;"></div>
          <div class="button-group">
            <button onclick="modalCopyResult()" class="copy">
              <img src="assets/icons/copy_white.svg" alt="" width="14" height="14"> Copy Result
            </button>
          </div>
        `;
      
      case 'comma-separated':
        return `
          <p style="margin: 0 auto 20px auto; text-align: center; opacity: 0.8; max-width: 100%; width: 100%; display: block; font-size: 14px;">${utilities.find(u => u.id === utilityId).description}</p>
          <div class="input-section">
            <div class="input-wrapper">
              <textarea id="modal-commaFormatterInput" rows="2" placeholder="Enter values separated by newlines..."></textarea>
            </div>
          </div>
          <div class="action-section">
            <button onclick="modalFormatCommaSeparated()" class="analyze-btn">
              <img src="assets/icons/wrench_white.svg" alt="" width="16" height="16"> Format
            </button>
          </div>
          <div id="modal-commaFormatterResult" class="result" style="font-family: 'Consolas', 'Monaco', monospace; text-align: left; min-height: 40px; padding: 15px; word-wrap: break-word; white-space: pre-wrap; overflow-wrap: break-word; max-height: none !important; overflow-y: visible !important; height: auto !important;"></div>
          <div class="button-group">
            <button onclick="modalCopyCommaFormatterResult()" class="copy">
              <img src="assets/icons/copy_white.svg" alt="" width="14" height="14"> Copy Result
            </button>
          </div>
        `;
      
      case 'json-pretty':
        return `
          <p style="margin: 0 auto 30px auto; text-align: center; opacity: 0.8; max-width: 100%; width: 100%; display: block; font-size: 14px;">${utilities.find(u => u.id === utilityId).description}</p>
          <div class="input-section" style="margin: 0 0 25px 0; width: 100%;">
            <div class="input-wrapper" style="width: 100%;">
              <label for="modal-jsonInput" style="display: block; font-size: 14px; font-weight: 600; color: #ffffff; margin-bottom: 8px; margin-top: 0;">Input (one‑line JSON or compact JSON)</label>
              <textarea id="modal-jsonInput" rows="4" placeholder='Paste your one-line JSON here, e.g. {"a":1,"b":[2,3]}' style="width: 100%; box-sizing: border-box; resize: vertical; min-height: 120px;"></textarea>
            </div>
          </div>
          <div class="json-controls" style="display: flex; gap: 30px; flex-wrap: wrap; align-items: center; margin: 0 0 35px 0; padding: 20px; background: rgba(0, 0, 0, 0.2); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); width: 100%; box-sizing: border-box;">
            <div style="flex: 1; display: flex; gap: 30px; align-items: center; flex-wrap: nowrap; min-width: 0; justify-content: flex-start;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <label style="font-size: 13px; margin: 0; white-space: nowrap; font-weight: 500; color: rgba(255, 255, 255, 0.9);">Indent</label>
                <input id="modal-jsonIndent" type="number" min="0" max="8" value="2" style="width: 70px; margin: 0; padding: 8px 10px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; color: #ffffff; font-size: 13px; flex-shrink: 0;" />
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <label style="font-size: 13px; margin: 0; white-space: nowrap; font-weight: 500; color: rgba(255, 255, 255, 0.9);">Ensure ASCII</label>
                <select id="modal-jsonAscii" style="margin: 0; padding: 8px 10px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; color: #ffffff; font-size: 13px; cursor: pointer; width: 180px; flex-shrink: 0;">
                  <option value="false" selected>False (keep UTF‑8)</option>
                  <option value="true">True (escape non‑ASCII)</option>
                </select>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <label style="font-size: 13px; margin: 0; white-space: nowrap; font-weight: 500; color: rgba(255, 255, 255, 0.9);">Mode</label>
                <select id="modal-jsonMode" style="margin: 0; padding: 8px 10px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; color: #ffffff; font-size: 13px; cursor: pointer; width: 160px; flex-shrink: 0;">
                  <option value="pretty" selected>Pretty (spaced)</option>
                  <option value="compact">Compact (one line)</option>
                </select>
              </div>
            </div>
            <div class="button-group" style="margin: 0; display: flex; gap: 10px; flex-wrap: wrap; flex-shrink: 0;">
              <button onclick="modalFormatJSON()" class="analyze-btn" style="width: auto; padding: 10px 18px;">
                <img src="assets/icons/play_white.svg" alt="" width="16" height="16"> Format
              </button>
              <button onclick="modalCopyJSON()" class="copy" style="width: auto; padding: 10px 18px;">
                <img src="assets/icons/copy_white.svg" alt="" width="14" height="14"> Copy
              </button>
              <button onclick="modalDownloadJSON()" class="copy" style="width: auto; padding: 10px 18px;">
                <img src="assets/icons/download_white.svg" alt="" width="14" height="14"> Download
              </button>
              <button onclick="modalClearJSON()" class="copy" style="width: auto; padding: 10px 18px; background: #dc3545; border-color: #dc3545;">
                Clear
              </button>
            </div>
          </div>
          <small style="margin: 0 0 30px 0; display: block; color: rgba(255, 255, 255, 0.6); font-size: 12px; font-style: italic;">Strict JSON parser: invalid JSON will show a clear error with location.</small>
          <div class="input-section" style="margin: 0 0 20px 0; width: 100%;">
            <div class="input-wrapper" style="width: 100%;">
              <label for="modal-jsonOutput" style="display: block; font-size: 14px; font-weight: 600; color: #ffffff; margin-bottom: 8px; margin-top: 0;">Output</label>
              <pre id="modal-jsonOutput" style="background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 14px; padding: 18px; font-family: 'Consolas', 'Monaco', monospace; font-size: 13px; line-height: 1.6; color: #ffffff; white-space: pre-wrap; word-wrap: break-word; max-height: 50vh; overflow: auto; min-height: 150px; margin: 0;" aria-live="polite"></pre>
            <div id="modal-jsonStatus" style="margin-top: 12px; font-size: 13px; min-height: 20px;"></div>
          </div>
          <div style="margin: 0; padding: 15px; background: rgba(102, 126, 234, 0.08); border-left: 3px solid rgba(102, 126, 234, 0.5); border-radius: 0 8px 8px 0; font-size: 12px; color: rgba(255, 255, 255, 0.7); font-style: italic; line-height: 1.6;">
            <strong style="color: rgba(255, 255, 255, 0.9);">Tips:</strong> If your program prints an <em>escaped JSON string</em> (e.g., <code style="background: rgba(255, 255, 255, 0.1); padding: 2px 6px; border-radius: 4px; font-family: 'Consolas', 'Monaco', monospace; color: rgba(255, 255, 255, 0.9);">"{\"x\":1}"</code>), click "Format" twice:
            first to unquote, second to pretty‑print—this page detects and handles that case automatically.
          </div>
        `;
      
      default:
        return '<p>Utility not found.</p>';
    }
  }

  // Initialize utility functions
  function initUtilityFunctions(utilityId) {
    switch(utilityId) {
      case 'json-pretty':
        // Auto-format on paste for JSON
        const jsonInput = document.getElementById('modal-jsonInput');
        if (jsonInput) {
          jsonInput.addEventListener('paste', () => {
            setTimeout(() => {
              if (jsonInput.value.length < 100000) modalFormatJSON();
            }, 0);
          });
        }
        break;
    }
  }

  // Client ID Transform functions
  window.modalFormatNumber = function() {
    const input = document.getElementById('modal-numberInput');
    const result = document.getElementById('modal-result');
    if (!input || !result) return;
    
    const v = input.value.trim().replace(/\D/g,'');
    
    if (!v) {
      result.textContent = 'Please enter a number';
      result.style.color = '#ff6b6b';
      return;
    }
    
    if (v.length > 17) {
      result.textContent = 'Number is too long! Maximum 17 digits allowed.';
      result.style.color = '#ff6b6b';
      return;
    }
    
    const formatted = v.padStart(17, '0');
    result.textContent = formatted;
    result.style.color = '#ffffff';
    result.style.transform = 'scale(1.02)';
    setTimeout(() => result.style.transform = 'scale(1)', 200);
  };

  window.modalCopyResult = function() {
    const result = document.getElementById('modal-result');
    if (!result) return;
    const text = result.textContent;
    if (text && text !== 'Please enter a number' && !text.includes('too long')) {
      const button = event.target.closest('button');
      navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<img src="assets/icons/check_white.svg" alt="" width="14" height="14">✓ Copied!';
        button.style.background = '#2a2a2a';
        setTimeout(() => {
          button.innerHTML = originalText;
          button.style.background = '';
        }, 2000);
      }).catch(() => alert('Failed to copy to clipboard'));
    }
  };

  // Comma-Separated Formatter functions
  window.modalFormatCommaSeparated = function() {
    const input = document.getElementById('modal-commaFormatterInput');
    const result = document.getElementById('modal-commaFormatterResult');
    if (!input || !result) return;
    
    const raw = input.value.trim();
    
    if (!raw) {
      result.textContent = 'Please enter values';
      result.style.color = '#ff6b6b';
      return;
    }
    
    const lines = [...new Set(raw.split('\n')
      .map(l => l.trim())
      .filter(l => l && l.toLowerCase() !== 'traceid'))];
    
    if (lines.length === 0) {
      result.textContent = 'No valid values found';
      result.style.color = '#ff6b6b';
      return;
    }
    
    const formatted = lines.map(l => `"${l}"`).join(', ');
    result.textContent = formatted;
    result.style.color = '#ffffff';
    result.style.transform = 'scale(1.02)';
    setTimeout(() => result.style.transform = 'scale(1)', 200);
  };

  window.modalCopyCommaFormatterResult = function() {
    const result = document.getElementById('modal-commaFormatterResult');
    if (!result) return;
    const text = result.textContent;
    if (text && !text.includes('Please enter') && !text.includes('No valid')) {
      const button = event.target.closest('button');
      navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<img src="assets/icons/check_white.svg" alt="" width="14" height="14">✓ Copied!';
        button.style.background = '#2a2a2a';
        setTimeout(() => {
          button.innerHTML = originalText;
          button.style.background = '';
        }, 2000);
      }).catch(() => alert('Failed to copy to clipboard'));
    }
  };

  // JSON Pretty Formatter functions
  function safeParseJSON(raw) {
    let s = (raw || '').trim().replace(/^\uFEFF/, '');
    const quoted = (s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"));
    if (quoted) {
      try {
        s = JSON.parse(s);
      } catch (e) {}
    }
    return JSON.parse(s);
  }

  window.modalFormatJSON = function() {
    const input = document.getElementById('modal-jsonInput');
    const output = document.getElementById('modal-jsonOutput');
    const status = document.getElementById('modal-jsonStatus');
    const indent = document.getElementById('modal-jsonIndent');
    const ascii = document.getElementById('modal-jsonAscii');
    const mode = document.getElementById('modal-jsonMode');
    
    if (!input || !output || !status) return;
    
    const raw = input.value;
    const indentVal = Number(indent?.value || 2);
    const ensureAscii = ascii?.value === 'true';
    const modeVal = mode?.value;

    try {
      const obj = safeParseJSON(raw);
      let space = modeVal === 'pretty' ? (isFinite(indentVal) ? indentVal : 2) : 0;
      let json = JSON.stringify(obj, (key, value) => value, space);

      if (ensureAscii) {
        json = json.replace(/[^\x00-\x7F]/g, ch => {
          const code = ch.codePointAt(0);
          if (code <= 0xFFFF) return '\\u' + code.toString(16).padStart(4, '0');
          const high = Math.floor((code - 0x10000) / 0x400) + 0xD800;
          const low = ((code - 0x10000) % 0x400) + 0xDC00;
          return '\\u' + high.toString(16).padStart(4, '0') + '\\u' + low.toString(16).padStart(4, '0');
        });
      }

      output.textContent = json;
      status.innerHTML = '<span style="color: #4ade80;">✔ JSON is valid.</span>';
    } catch (err) {
      output.textContent = '';
      const msg = (err && err.message) ? err.message : String(err);
      status.innerHTML = '<span style="color: #ff6b6b; white-space: pre-wrap;">✖ Invalid JSON.\n' + msg + '\n\nHints:\n• Use double quotes for keys/strings.\n• Remove trailing commas.\n• Replace single quotes with double quotes.\n• Remove comments (// or /* */) — not allowed in JSON.\n</span>';
    }
  };

  window.modalCopyJSON = function() {
    const output = document.getElementById('modal-jsonOutput');
    if (!output) return;
    const text = output.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      const status = document.getElementById('modal-jsonStatus');
      if (status) status.innerHTML = '<span style="color: #4ade80;">📋 Copied to clipboard.</span>';
    }).catch(() => {
      const status = document.getElementById('modal-jsonStatus');
      if (status) status.innerHTML = '<span style="color: #ff6b6b;">Copy failed. Select output and press Ctrl/Cmd+C.</span>';
    });
  };

  window.modalDownloadJSON = function() {
    const output = document.getElementById('modal-jsonOutput');
    if (!output) return;
    const text = output.textContent;
    if (!text) {
      const status = document.getElementById('modal-jsonStatus');
      if (status) status.innerHTML = '<span style="color: #ff6b6b;">Nothing to download — format first.</span>';
      return;
    }
    const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(a.href);
    const status = document.getElementById('modal-jsonStatus');
    if (status) status.innerHTML = '<span style="color: #4ade80;">✓ Downloaded formatted.json</span>';
  };

  window.modalClearJSON = function() {
    const input = document.getElementById('modal-jsonInput');
    const output = document.getElementById('modal-jsonOutput');
    const status = document.getElementById('modal-jsonStatus');
    if (input) input.value = '';
    if (output) output.textContent = '';
    if (status) status.textContent = '';
    if (input) input.focus();
  };

  // Event listeners
  function setupEventListeners() {
    const toggle = document.getElementById('utilitiesToggle');
    const sidebar = document.getElementById('utilitiesSidebar');
    const sidebarClose = document.getElementById('utilitiesSidebarClose');
    const modalOverlay = document.getElementById('utilitiesModalOverlay');
    const modalClose = document.getElementById('utilitiesModalClose');

    if (toggle) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('open');
      });
    }

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          modalOverlay.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (modalOverlay && modalOverlay.classList.contains('open')) {
          modalOverlay.classList.remove('open');
          document.body.style.overflow = '';
        }
        if (sidebar && sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
        }
      }
    });
  }

  // Initialize on DOM ready
  function initPanel() {
    try {
      createUtilitiesPanel();
      setupEventListeners();
      console.log('Utilities panel initialized');
    } catch (error) {
      console.error('Error initializing utilities panel:', error);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPanel);
  } else {
    initPanel();
  }
})();
