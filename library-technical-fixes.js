(() => {
  const SCALE_OVERSHOOT = 1.04;

  function installPreviewScaleCorrection() {
    const frame = document.querySelector('#previewMediaFrame');
    if (!frame) return;

    let lastCorrectedValue = '';
    const correctScale = () => {
      const raw = frame.style.getPropertyValue('--preview-embed-scale').trim();
      if (!raw || raw === lastCorrectedValue) return;
      const scale = Number.parseFloat(raw);
      if (!Number.isFinite(scale) || scale <= 0) return;

      const corrected = String(scale / SCALE_OVERSHOOT);
      lastCorrectedValue = corrected;
      frame.style.setProperty('--preview-embed-scale', corrected);
    };

    const observer = new MutationObserver(correctScale);
    observer.observe(frame, { attributes: true, attributeFilter: ['style'] });
    correctScale();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installPreviewScaleCorrection, { once: true });
  } else {
    installPreviewScaleCorrection();
  }
})();
