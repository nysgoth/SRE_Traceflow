// Shared navigation bar for all tool pages
(function() {
  'use strict';
  
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Generate nav HTML based on current page
  function generateNavHTML() {
    // Extended search has different nav structure
    if (currentPage === 'extended-search.html') {
      return `
  <nav class="navbar">
    <div class="nav-container">
      <a href="index.html" class="nav-logo"><img src="assets/icons/sre_traceflow.png" alt="" style="width:40px;height:40px;margin-right:6px;vertical-align:middle;">SRE TraceFlow</a>
      <div class="nav-links">
        <a href="index.html">Home</a>
        <a href="LogWizard.html">LogWizard</a>
        <a href="extended-search.html" class="active">Extended Search</a>
      </div>
    </div>
  </nav>`;
    }

    // Standard nav for other tool pages
    const pages = [
      { file: 'index.html', label: 'Home' },
      { file: 'trace-extractor.html', label: 'Trace Extractor' },
      { file: 'log-analyzer.html', label: 'Log Analyzer' },
      { file: 'advanced-kql-query.html', label: 'Advanced KQL Query' },
      { file: 'simple-kql-query.html', label: 'Simple KQL Query' },
      { file: 'interceptor.html', label: 'Interceptor' }
    ];

    const linksHTML = pages.map(page => {
      const activeClass = currentPage === page.file ? 'class="active"' : '';
      return `        <a href="${page.file}" ${activeClass}>${page.label}</a>`;
    }).join('\n');

    return `
  <nav class="navbar">
    <div class="nav-container">
      <a href="index.html" class="nav-logo"><img src="assets/icons/sre_traceflow.png" alt="" style="width:40px;height:40px;margin-right:6px;vertical-align:middle;">SRE TraceFlow</a>
      <div class="nav-links">
${linksHTML}
      </div>
    </div>
  </nav>`;
  }

  // Inject navbar as soon as possible to prevent layout shift
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject(); // DOM already loaded
  }

  function inject() {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
      navbarContainer.innerHTML = generateNavHTML();
    }
  }
})();
