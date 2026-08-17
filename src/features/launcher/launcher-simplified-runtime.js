(() => {
  const q = (selector) => document.querySelector(selector);
  const qa = (selector) => [...document.querySelectorAll(selector)];

  function showSystemSummary() {
    qa('#designSystemWorkbench [data-ds-panel="foundation"], #designSystemWorkbench [data-ds-panel="components"]').forEach((panel) => {
      panel.hidden = false;
      panel.classList.add('is-active');
      panel.setAttribute('role', 'region');
    });
  }

  function keepResultStepInSync() {
    const result = q('#resultStage');
    if (!result) return;
    result.addEventListener('focusin', () => {
      qa('.launcher-step-link').forEach((link) => {
        if (link.dataset.launcherStep === 'output') link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      });
    });
  }

  function init() {
    if (!document.body.classList.contains('launcher-simplified')) return;
    showSystemSummary();
    keepResultStepInSync();
    const workbench = q('#designSystemWorkbench');
    if (workbench) {
      new MutationObserver(showSystemSummary).observe(workbench, { subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
