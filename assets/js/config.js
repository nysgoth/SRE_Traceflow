// TraceFlow environment configuration (localStorage + JSON file)
(function () {
  'use strict';

  const STORAGE_KEY = 'traceflow-config';
  const CONFIG_PATH = 'assets/traceflow-config.json';

  const ENTRY_TYPES = ['Database', 'Deployment', 'Service'];

  const FALLBACK_ENTRIES = [
    { name: 'BB_prod_CL', type: 'Database', isDefault: true },
    { name: 'core-integration-service', type: 'Deployment', isDefault: true },
  ];

  let cache = null;

  function normalizeEntry(entry) {
    const type = ENTRY_TYPES.includes(entry?.type) ? entry.type : 'Deployment';
    return {
      name: String(entry?.name || '').trim(),
      type,
      isDefault: !!entry?.isDefault,
    };
  }

  function migrateLegacyConfig(cfg) {
    const entries = [];
    const seen = new Set();

    const add = (name, type, isDefault) => {
      const trimmed = String(name || '').trim();
      if (!trimmed) return;
      const key = `${type}:${trimmed}`;
      if (seen.has(key)) return;
      seen.add(key);
      entries.push({ name: trimmed, type, isDefault: !!isDefault });
    };

    const databaseTables = Array.isArray(cfg.databaseTables)
      ? cfg.databaseTables
      : cfg.databaseTable
        ? [cfg.databaseTable]
        : ['BB_prod_CL'];
    const defaultDatabase = cfg.defaultDatabaseTable || cfg.databaseTable || databaseTables[0];

    databaseTables.forEach((name) => {
      add(name, 'Database', name === defaultDatabase);
    });

    const deployments = Array.isArray(cfg.deployments) ? cfg.deployments : [];
    const defaultDeployment = cfg.defaultContainer || 'core-integration-service';

    deployments.forEach((name) => {
      add(name, 'Deployment', name === defaultDeployment);
    });

    if (!deployments.length) {
      add(defaultDeployment, 'Deployment', true);
    }

    return entries;
  }

  function ensureDefaultsPerType(entries) {
    ENTRY_TYPES.forEach((type) => {
      const ofType = entries.filter((entry) => entry.type === type);
      if (!ofType.length) return;

      const defaults = ofType.filter((entry) => entry.isDefault);
      if (defaults.length === 1) return;

      const pick = defaults[0] || ofType[0];
      ofType.forEach((entry) => {
        entry.isDefault = entry.name === pick.name;
      });
    });
  }

  function sortEntries(entries) {
    return entries.slice().sort((a, b) => {
      const typeOrder = ENTRY_TYPES.indexOf(a.type) - ENTRY_TYPES.indexOf(b.type);
      if (typeOrder !== 0) return typeOrder;
      return a.name.localeCompare(b.name);
    });
  }

  function normalizeConfig(raw) {
    const cfg = raw || {};
    let entries = [];

    if (Array.isArray(cfg.entries) && cfg.entries.length) {
      entries = cfg.entries.map(normalizeEntry).filter((entry) => entry.name);
    } else {
      entries = migrateLegacyConfig(cfg).map(normalizeEntry).filter((entry) => entry.name);
    }

    if (!entries.length) {
      entries = FALLBACK_ENTRIES.map(normalizeEntry);
    }

    ensureDefaultsPerType(entries);

    return { entries: sortEntries(entries) };
  }

  function readStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return normalizeConfig(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  async function readDefaultsFile() {
    const resp = await fetch(CONFIG_PATH);
    if (!resp.ok) throw new Error('Failed to load default config');
    return normalizeConfig(await resp.json());
  }

  async function init() {
    if (cache) return cache;

    const stored = readStorage();
    if (stored) {
      cache = stored;
      return cache;
    }

    try {
      cache = await readDefaultsFile();
    } catch {
      cache = normalizeConfig({ entries: FALLBACK_ENTRIES });
    }

    return cache;
  }

  function getConfig() {
    return cache || normalizeConfig({ entries: FALLBACK_ENTRIES });
  }

  function getEntries() {
    return getConfig().entries.map((entry) => ({ ...entry }));
  }

  function getEntriesByType(type) {
    return getEntries().filter((entry) => entry.type === type);
  }

  function getDefaultEntry(type) {
    const entries = getEntriesByType(type);
    return entries.find((entry) => entry.isDefault) || entries[0] || null;
  }

  function getDatabaseTable() {
    return getDefaultEntry('Database')?.name || 'BB_prod_CL';
  }

  function getDatabaseTables() {
    return getEntriesByType('Database').map((entry) => entry.name);
  }

  function getDefaultService() {
    return getDefaultEntry('Service')?.name || '';
  }

  function getDefaultContainer() {
    return getDefaultEntry('Deployment')?.name || 'core-integration-service';
  }

  function getDeployments() {
    return getEntriesByType('Deployment').map((entry) => entry.name);
  }

  function getServices() {
    return getEntriesByType('Service').map((entry) => entry.name);
  }

  function getQueryTargets() {
    return getDeployments().slice().sort((a, b) => a.localeCompare(b));
  }

  function save(config) {
    cache = normalizeConfig(config);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    return cache;
  }

  async function resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    cache = null;
    return init();
  }

  function exportToFile(config) {
    const data = normalizeConfig(config || getConfig());
    const blob = new Blob([JSON.stringify(data, null, 2) + '\n'], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'traceflow-config.json';
    link.click();
    URL.revokeObjectURL(url);
    return data;
  }

  function saveAndExport(config) {
    const saved = save(config);
    exportToFile(saved);
    return saved;
  }

  function parseConfigFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          resolve(normalizeConfig(JSON.parse(reader.result)));
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  function importFromFile(file) {
    return parseConfigFile(file);
  }

  const CONFIG_SELECTOR_TYPES = ['Database', 'Service'];

  function formatConfigOptionLabel(name, type) {
    return `${name} [${type}]`;
  }

  function getSelectedConfigEntry(selectEl) {
    const option = selectEl?.selectedOptions?.[0];
    if (!option?.value) return { name: '', type: 'Database' };
    const [type, name] = option.value.split(':');
    return { name, type };
  }

  function syncConfigSelectStyle(selectEl, type) {
    if (!selectEl) return;
    const typeClass = (type || 'Database').toLowerCase();
    selectEl.classList.remove('database', 'deployment', 'service');
    selectEl.classList.add(typeClass);
    const wrapper = selectEl.closest('.config-target-dropdown');
    if (wrapper) {
      wrapper.classList.remove('database', 'deployment', 'service');
      wrapper.classList.add(typeClass);
    }
  }

  function closeConfigDropdown(wrapper) {
    if (!wrapper) return;
    const menu = wrapper.querySelector('.config-target-menu');
    const trigger = wrapper.querySelector('.config-target-trigger');
    if (menu) menu.hidden = true;
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    wrapper.classList.remove('open');
  }

  function closeAllConfigDropdowns() {
    document.querySelectorAll('.config-target-dropdown.open').forEach(closeConfigDropdown);
  }

  function updateConfigDropdownUI(selectEl) {
    const wrapper = selectEl?.closest('.config-target-dropdown');
    if (!wrapper) return;
    const option = selectEl.selectedOptions[0];
    const trigger = wrapper.querySelector('.config-target-trigger');
    const [type] = (option?.value || '').split(':');

    if (trigger) {
      trigger.textContent = option?.textContent || 'Select target';
      trigger.title = option?.textContent || 'Query target';
    }

    syncConfigSelectStyle(selectEl, type);

    wrapper.querySelectorAll('.config-target-option').forEach((btn) => {
      btn.classList.toggle('selected', btn.dataset.value === selectEl.value);
    });
  }

  function buildConfigDropdownMenu(selectEl) {
    const wrapper = selectEl.closest('.config-target-dropdown');
    if (!wrapper) return;
    const menu = wrapper.querySelector('.config-target-menu');
    if (!menu) return;

    menu.innerHTML = '';
    selectEl.querySelectorAll('optgroup').forEach((group) => {
      const groupEl = document.createElement('div');
      groupEl.className = 'config-target-group';

      const label = document.createElement('div');
      label.className = 'config-target-group-label';
      label.textContent = group.label;
      groupEl.appendChild(label);

      group.querySelectorAll('option').forEach((opt) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'config-target-option';
        item.dataset.value = opt.value;
        item.textContent = opt.textContent;
        const [type] = opt.value.split(':');
        item.classList.add(type.toLowerCase());
        if (opt.selected) item.classList.add('selected');
        item.addEventListener('click', (event) => {
          event.stopPropagation();
          selectEl.value = opt.value;
          updateConfigDropdownUI(selectEl);
          closeConfigDropdown(wrapper);
          selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        });
        groupEl.appendChild(item);
      });

      menu.appendChild(groupEl);
    });
  }

  function wrapConfigEntrySelect(selectEl) {
    if (!selectEl) return;
    if (selectEl.dataset.customDropdown === 'true') {
      buildConfigDropdownMenu(selectEl);
      updateConfigDropdownUI(selectEl);
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'config-target-dropdown';
    selectEl.parentNode.insertBefore(wrapper, selectEl);
    wrapper.appendChild(selectEl);

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'config-target-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.title = selectEl.title || 'Query target';

    const menu = document.createElement('div');
    menu.className = 'config-target-menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;

    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const willOpen = menu.hidden;
      closeAllConfigDropdowns();
      if (willOpen) {
        menu.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        wrapper.classList.add('open');
      }
    });

    menu.addEventListener('click', (event) => event.stopPropagation());

    wrapper.appendChild(trigger);
    wrapper.appendChild(menu);
    selectEl.dataset.customDropdown = 'true';

    if (!window.__traceflowConfigDropdownListeners) {
      document.addEventListener('click', closeAllConfigDropdowns);
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeAllConfigDropdowns();
      });
      window.__traceflowConfigDropdownListeners = true;
    }

    buildConfigDropdownMenu(selectEl);
    updateConfigDropdownUI(selectEl);
  }

  function getQueryTableForEntry(entry) {
    if (entry?.type === 'Database' || entry?.type === 'Service') {
      return entry.name || getDatabaseTable();
    }
    return getDatabaseTable();
  }

  function getContainerFilterForEntry(entry) {
    if (entry?.type === 'Deployment' && entry.name) {
      return `\n| where container_name has "${entry.name}"`;
    }
    return '';
  }

  function applyEntryToContainerInput(entry, containerInput) {
    if (!containerInput || !entry?.name) return;
    if (entry.type === 'Deployment') {
      containerInput.value = entry.name;
    }
  }

  function initConfigEntrySelect(selectEl, options = {}) {
    const types = options.types || CONFIG_SELECTOR_TYPES;
    const onChange = options.onChange || (() => {});

    if (!selectEl) return null;

    selectEl.innerHTML = '';
    const defaultDb = getDefaultEntry('Database');
    const defaultSvc = getDefaultEntry('Service');

    types.forEach((type) => {
      const entries = getEntriesByType(type);
      if (!entries.length) return;

      const group = document.createElement('optgroup');
      group.label = type;
      entries.forEach((entry) => {
        const opt = document.createElement('option');
        opt.value = `${type}:${entry.name}`;
        opt.textContent = formatConfigOptionLabel(entry.name, type);
        group.appendChild(opt);
      });
      selectEl.appendChild(group);
    });

    if (defaultDb) {
      selectEl.value = `Database:${defaultDb.name}`;
    } else if (defaultSvc) {
      selectEl.value = `Service:${defaultSvc.name}`;
    } else if (selectEl.options.length) {
      selectEl.selectedIndex = 0;
    }

    wrapConfigEntrySelect(selectEl);

    const sync = () => {
      updateConfigDropdownUI(selectEl);
      const entry = getSelectedConfigEntry(selectEl);
      onChange(entry);
      return entry;
    };

    selectEl.onchange = sync;
    return sync();
  }

  window.TraceFlowConfig = {
    ENTRY_TYPES,
    CONFIG_SELECTOR_TYPES,
    init,
    getConfig,
    getEntries,
    getEntriesByType,
    getDefaultEntry,
    getDatabaseTable,
    getDatabaseTables,
    getDefaultContainer,
    getDefaultService,
    getDeployments,
    getServices,
    getQueryTargets,
    formatConfigOptionLabel,
    getSelectedConfigEntry,
    syncConfigSelectStyle,
    getQueryTableForEntry,
    getContainerFilterForEntry,
    applyEntryToContainerInput,
    initConfigEntrySelect,
    save,
    saveAndExport,
    resetToDefaults,
    exportToFile,
    parseConfigFile,
    importFromFile,
    normalizeConfig,
  };
})();
