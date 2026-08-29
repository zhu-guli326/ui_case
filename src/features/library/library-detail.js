export function createLibraryDetailController({
  elements,
  styleGuides,
  previewImageSets,
  helpers,
  actions
}) {
  const {
    previewDialog,
    previewDialogContent,
    previewDialogTitle,
    previewDialogDetails,
    previewDialogImage,
    previewDialogSequence,
    previewImageNavigation,
    previewImagePrevious,
    previewImageNext,
    previewImageLabel,
    previewImageCount,
    previewDialogVideo,
    previewDialogDemo,
    previewCursor,
    previewMediaStage,
    previewMediaFrame,
    previewPhoneScreen,
    previewModeSwitch,
    previewVideoToggle,
    previewVideoProgress,
    previewVideoTime,
    previewExpand,
    previewDialogCopy,
    previewDialogApply,
    previewDialogStartTask,
    previewDialogMoreActionsSummary,
    previewDialogComponents,
    previewDialogCompare,
    previewDialogOpenLive,
    previewMediaStatus,
    previewMediaStatusText,
    previewMediaRetry
  } = elements;

  const {
    currentCopy,
    localizeRecord,
    getPreviewDevice,
    getPreviewModes,
    getPreviewPoster,
    withPreviewVersion,
    getEmbeddedDemoUrl,
    getStyleProfiles,
    labUrlForGuide,
    taskUrlForGuide
  } = helpers;
  const { track, copyStyleMode, applyCaseToProject, projectPatchForGuide } = actions;

  let activePreviewGuide = null;
  let previewLoadTimer = 0;
  let activePreviewMode = null;
  let activePreviewImages = [];
  let activePreviewImageIndex = 0;
  let activeVideoSequence = null;
  let previewSequenceTime = 0;
  let previewSequencePlaying = false;
  let previewSequenceStartedAt = 0;
  let previewSequenceFrameIndex = -1;
  let previewSequenceAnimationFrame = 0;

  function getPreviewImages(guide) {
    guide = localizeRecord(guide);
    const images = previewImageSets[guide.id];
    if (images?.length) return images.map((image) => ({
      ...image,
      label: typeof image.label === "object" ? image.label[window.image2I18n?.language === "en" ? "en" : "zh"] : image.label,
      alt: image.alt || `${guide.style}: ${typeof image.label === "object" ? image.label.en : image.label}`,
      src: withPreviewVersion(image.src)
    }));
    return [{
      src: getPreviewPoster(guide),
      label: currentCopy().modes.image,
      alt: window.image2I18n?.language === "en" ? `${guide.style} mobile screen` : `${guide.style} 手机效果图`
    }];
  }

  function showPreviewImage(index) {
    if (!activePreviewImages.length) return;
    activePreviewImageIndex = (index + activePreviewImages.length) % activePreviewImages.length;
    const image = activePreviewImages[activePreviewImageIndex];
    previewDialogImage.src = image.src;
    previewDialogImage.alt = image.alt;
    previewImageLabel.textContent = image.label;
    previewImageCount.textContent = `${activePreviewImageIndex + 1} / ${activePreviewImages.length}`;
    previewImageNavigation.hidden = activePreviewImages.length < 2 || activePreviewMode !== "image";
    previewImagePrevious.setAttribute("aria-label", `${currentCopy().previous}: ${image.label}`);
    previewImageNext.setAttribute("aria-label", `${currentCopy().next}: ${image.label}`);
  }

  function showPreviewImageError(image, guide) {
    image.hidden = true;
    previewMediaStatus.hidden = false;
    previewMediaStatusText.textContent = window.image2I18n?.language === "en"
      ? `${guide.name} screens are unavailable. Switch to the interactive demo.`
      : `${guide.name} 效果图不可用，请切换到可点击 Demo。`;
    previewMediaRetry.hidden = true;
    previewMediaStatus.classList.add("is-error");
  }

  function updateEmbeddedPreviewScale() {
    if (!activePreviewGuide || previewDialogDemo.hidden) return;
    const { width, height } = getPreviewDevice(activePreviewGuide, "live");
    const scale = Math.min(previewPhoneScreen.clientWidth / width, previewPhoneScreen.clientHeight / height) * 1.04;
    previewMediaFrame.style.setProperty("--preview-embed-scale", String(scale));
  }

  function formatVideoTime(value) {
    if (!Number.isFinite(value) || value < 0) return "0:00";
    const seconds = Math.floor(value % 60).toString().padStart(2, "0");
    const minutes = Math.floor(value / 60);
    return `${minutes}:${seconds}`;
  }

  function getVideoSequence(guide) {
    const sequence = guide?.videoSequence;
    if (sequence && Number.isFinite(sequence.duration) && sequence.duration > 0 && sequence.frames?.length) return sequence;
    const profile = helpers.getPreviewProfile(guide?.id);
    const screenFrames = previewImageSets[guide?.id];
    if (profile?.motionKind !== "screen-sequence" || !screenFrames?.length) return null;
    const secondsPerFrame = 2;
    return {
      duration: screenFrames.length * secondsPerFrame,
      frames: screenFrames.map((frame, index) => ({ ...frame, at: index * secondsPerFrame }))
    };
  }

  function renderPreviewSequenceFrame() {
    if (!activeVideoSequence) return;
    let nextFrameIndex = 0;
    for (let index = 1; index < activeVideoSequence.frames.length; index += 1) {
      if (previewSequenceTime < activeVideoSequence.frames[index].at) break;
      nextFrameIndex = index;
    }
    if (nextFrameIndex === previewSequenceFrameIndex) return;
    previewSequenceFrameIndex = nextFrameIndex;
    const frame = activeVideoSequence.frames[nextFrameIndex];
    previewDialogSequence.src = withPreviewVersion(frame.src);
    previewDialogSequence.alt = activePreviewGuide ? `${localizeRecord(activePreviewGuide).style}: ${frame.label}` : frame.label;
  }

  function updatePreviewSequence(timestamp) {
    if (!activeVideoSequence || !previewSequencePlaying) return;
    previewSequenceTime = ((timestamp - previewSequenceStartedAt) / 1000) % activeVideoSequence.duration;
    renderPreviewSequenceFrame();
    updateVideoControls();
    previewSequenceAnimationFrame = window.requestAnimationFrame(updatePreviewSequence);
  }

  function playPreviewSequence() {
    if (!activeVideoSequence || previewSequencePlaying) return;
    previewSequencePlaying = true;
    previewSequenceStartedAt = window.performance.now() - (previewSequenceTime * 1000);
    previewCursor.classList.add("is-running");
    window.cancelAnimationFrame(previewSequenceAnimationFrame);
    previewSequenceAnimationFrame = window.requestAnimationFrame(updatePreviewSequence);
    updateVideoControls();
  }

  function pausePreviewSequence() {
    if (activeVideoSequence && previewSequencePlaying) {
      previewSequenceTime = ((window.performance.now() - previewSequenceStartedAt) / 1000) % activeVideoSequence.duration;
    }
    previewSequencePlaying = false;
    window.cancelAnimationFrame(previewSequenceAnimationFrame);
    previewSequenceAnimationFrame = 0;
    previewCursor.classList.remove("is-running");
    renderPreviewSequenceFrame();
    updateVideoControls();
  }

  function seekPreviewSequence(value) {
    if (!activeVideoSequence) return;
    previewSequenceTime = Math.max(0, Math.min(Number(value) || 0, activeVideoSequence.duration));
    previewSequenceStartedAt = window.performance.now() - (previewSequenceTime * 1000);
    previewSequenceFrameIndex = -1;
    renderPreviewSequenceFrame();
    updateVideoControls();
  }

  function unloadPreviewSequence() {
    previewSequencePlaying = false;
    window.cancelAnimationFrame(previewSequenceAnimationFrame);
    previewSequenceAnimationFrame = 0;
    activeVideoSequence = null;
    previewSequenceTime = 0;
    previewSequenceStartedAt = 0;
    previewSequenceFrameIndex = -1;
    previewDialogSequence.hidden = true;
    previewDialogSequence.removeAttribute("src");
    previewDialogSequence.alt = "";
  }

  function updateVideoControls() {
    const duration = activeVideoSequence?.duration || (Number.isFinite(previewDialogVideo.duration) ? previewDialogVideo.duration : 0);
    const current = activeVideoSequence ? previewSequenceTime : (Number.isFinite(previewDialogVideo.currentTime) ? previewDialogVideo.currentTime : 0);
    previewVideoProgress.max = String(duration);
    previewVideoProgress.value = String(Math.min(current, duration || 0));
    previewVideoTime.textContent = `${formatVideoTime(current)} / ${formatVideoTime(duration)}`;
    const paused = activeVideoSequence ? !previewSequencePlaying : previewDialogVideo.paused;
    previewVideoToggle.innerHTML = `<span aria-hidden="true">${paused ? "&#9654;" : "&#10074;&#10074;"}</span>`;
    const label = paused ? currentCopy().play : currentCopy().pause;
    previewVideoToggle.setAttribute("aria-label", label);
    previewVideoToggle.title = label;
  }

  function unloadPreviewVideo() {
    unloadPreviewSequence();
    previewDialogVideo.pause();
    previewDialogVideo.removeAttribute("src");
    previewDialogVideo.load();
    previewVideoProgress.value = "0";
    previewVideoProgress.max = "0";
    updateVideoControls();
  }

  function setPreviewFullscreenState(isLightbox) {
    previewDialog.classList.toggle("is-lightbox", isLightbox);
    previewExpand.innerHTML = `<span aria-hidden="true">${isLightbox ? "&#10006;" : "&#9974;"}</span>`;
    const label = isLightbox ? currentCopy().exitFullscreen : currentCopy().fullscreen;
    previewExpand.setAttribute("aria-label", label);
    previewExpand.title = label;
    if (isLightbox) window.requestAnimationFrame(updateEmbeddedPreviewScale);
  }

  async function togglePreviewFullscreen() {
    const isLightbox = previewDialog.classList.contains("is-lightbox");
    if (isLightbox) {
      if (document.fullscreenElement && document.exitFullscreen) {
        try { await document.exitFullscreen(); } catch {}
      }
      setPreviewFullscreenState(false);
      return;
    }
    setPreviewFullscreenState(true);
    if (previewMediaStage.requestFullscreen) await previewMediaStage.requestFullscreen().catch(() => {});
  }

  function setPreviewMode(mode, shouldTrack = true) {
    const guide = localizeRecord(activePreviewGuide);
    if (!guide) return;
    const modes = getPreviewModes(guide);
    const nextMode = modes.includes(mode) ? mode : (guide.video ? "video" : "image");
    const isImage = nextMode === "image";
    const isVideo = nextMode === "video";
    const isLiveDemo = nextMode === "live";
    const videoSequence = isVideo ? getVideoSequence(guide) : null;
    const { width: phoneWidth, height: phoneHeight } = getPreviewDevice(guide, nextMode);
    activePreviewMode = nextMode;

    previewMediaStage.classList.toggle("is-video", isVideo);
    previewMediaFrame.classList.toggle("has-wide-device-art", Boolean(guide.previewImage && !guide.liveDemo && !videoSequence));
    previewMediaFrame.style.setProperty("--preview-source-width", `${phoneWidth}px`);
    previewMediaFrame.style.setProperty("--preview-source-height", `${phoneHeight}px`);
    [previewDialogVideo, previewDialogDemo].forEach((element) => {
      element.width = phoneWidth;
      element.height = phoneHeight;
    });

    previewDialogImage.hidden = !isImage;
    previewDialogSequence.hidden = true;
    previewDialogVideo.hidden = !isVideo;
    previewDialogDemo.hidden = !isLiveDemo;
    previewMediaStatus.hidden = !isLiveDemo;
    previewMediaRetry.hidden = true;
    previewCursor.hidden = !isVideo;
    previewImageNavigation.hidden = !isImage || activePreviewImages.length < 2;
    previewCursor.classList.toggle("is-running", isVideo && !previewDialogVideo.paused);
    previewVideoProgress.disabled = !isVideo;
    previewVideoToggle.disabled = !isVideo;
    updateVideoControls();
    previewModeSwitch.querySelectorAll("button").forEach((button) => {
      const active = button.dataset.previewView === nextMode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (isImage) {
      unloadPreviewVideo();
      previewDialogDemo.src = "about:blank";
      previewDialogImage.hidden = false;
      previewMediaStatus.hidden = true;
      previewMediaStatus.classList.remove("is-error");
      showPreviewImage(activePreviewImageIndex);
    } else if (isVideo) {
      previewDialogDemo.src = "about:blank";
      unloadPreviewVideo();
      if (videoSequence) {
        activeVideoSequence = videoSequence;
        previewDialogVideo.hidden = true;
        previewDialogSequence.hidden = false;
        previewSequenceFrameIndex = -1;
        renderPreviewSequenceFrame();
        playPreviewSequence();
      } else {
        previewDialogVideo.hidden = false;
        previewDialogVideo.poster = guide.poster || helpers.getCardPoster(guide);
        previewDialogVideo.muted = true;
        previewDialogVideo.src = guide.video;
        previewVideoProgress.value = "0";
        previewDialogVideo.load();
        previewDialogVideo.play().catch(() => {});
      }
    } else {
      unloadPreviewVideo();
      window.clearTimeout(previewLoadTimer);
      previewMediaStatusText.textContent = currentCopy().loadDemo;
      previewMediaStatus.classList.remove("is-error");
      previewDialogDemo.title = `${guide.style} ${window.image2I18n?.language === "en" ? "interactive demo" : "可点击 Demo"}`;
      previewDialogDemo.src = getEmbeddedDemoUrl(guide);
      previewLoadTimer = window.setTimeout(() => {
        if (!activePreviewGuide || previewDialogDemo.hidden) return;
        previewMediaStatus.hidden = false;
        previewMediaStatusText.textContent = currentCopy().timeout;
        previewMediaRetry.hidden = false;
        previewMediaStatus.classList.add("is-error");
      }, 8000);
      window.requestAnimationFrame(updateEmbeddedPreviewScale);
    }

    if (shouldTrack) track("preview_mode_change", { caseId: guide.id, mode: nextMode });
  }

  function openPreview(id, mode = "auto") {
    const sourceGuide = styleGuides.find((item) => item.id === id);
    if (!sourceGuide) return;
    const guide = localizeRecord(sourceGuide);
    const copy = currentCopy();
    activePreviewGuide = sourceGuide;
    activePreviewImages = getPreviewImages(guide);
    activePreviewImageIndex = 0;
    const modes = getPreviewModes(guide);
    const initialMode = mode === "auto"
      ? (guide.defaultPreviewMode || (guide.video ? "video" : (guide.liveDemo ? "live" : "image")))
      : (modes.includes(mode) ? mode : modes[0]);

    previewDialogTitle.textContent = `${guide.name} / ${guide.style}`;
    const applicableStyles = getStyleProfiles(sourceGuide);
    const isEnglish = window.image2I18n?.language === "en";
    previewDialogDetails.innerHTML = `
      <p class="preview-dialog-summary">${guide.summary}</p>
      <details class="preview-dialog-more">
        <summary><span>${isEnglish ? "View design notes" : "查看设计说明"}</span><small>${isEnglish ? "Colors, layout, components" : "色彩、布局、组件"}</small></summary>
        <div class="preview-dialog-more-content">
          <dl class="preview-dialog-facts">
            <div><dt>${copy.facts[0]}</dt><dd>${guide.palette}</dd></div>
            <div><dt>${copy.facts[1]}</dt><dd>${guide.layout}</dd></div>
            <div><dt>${copy.facts[2]}</dt><dd>${guide.reference}</dd></div>
            <div><dt>${copy.facts[3]}</dt><dd>${guide.bestFor}</dd></div>
          </dl>
          <p class="preview-dialog-principle">${guide.recipe.principle}</p>
          <div class="preview-dialog-recipe">
            <p><strong>${copy.recipe[0]}:</strong> ${guide.recipe.image}</p>
            <p><strong>${copy.recipe[1]}:</strong> ${guide.recipe.type}</p>
            <p><strong>${copy.recipe[2]}:</strong> ${guide.recipe.components}</p>
          </div>
          <div class="preview-dialog-profiles"><strong>${copy.brandProfiles}</strong><div>${applicableStyles.map((profile) => `<span>${profile.name}</span>`).join("")}</div></div>
        </div>
      </details>`;
    previewDialogCopy.dataset.copyStyle = guide.id;
    previewDialogApply.dataset.applyCase = guide.id;
    previewDialogCopy.textContent = copy.copyFull;
    previewDialogApply.textContent = copy.applyProject;
    previewDialogStartTask.href = taskUrlForGuide(sourceGuide);
    previewDialogStartTask.textContent = isEnglish ? "Start designing from this case" : "基于此案例开始设计";
    previewDialogMoreActionsSummary.textContent = isEnglish ? "More actions" : "更多操作";
    previewDialogMoreActionsSummary.closest("details").open = false;
    previewDialogComponents.href = labUrlForGuide(sourceGuide);
    previewDialogComponents.textContent = isEnglish ? "Open in design lab" : "在实验室中打开";
    previewDialogCompare.href = labUrlForGuide(sourceGuide, "compare");
    previewDialogCompare.textContent = isEnglish ? "Compare with current project" : "与当前方案对比";
    previewMediaStage.style.setProperty("--preview-media-bg", guide.preview);
    previewDialogOpenLive.hidden = !guide.liveDemo;
    if (guide.liveDemo) previewDialogOpenLive.href = guide.liveDemo;
    previewDialogOpenLive.textContent = copy.openLive;
    previewModeSwitch.innerHTML = modes.map((item) => `<button type="button" data-preview-view="${item}" aria-pressed="false">${copy.modes[item]}</button>`).join("");
    previewModeSwitch.hidden = modes.length < 2;
    previewModeSwitch.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => setPreviewMode(button.dataset.previewView)));

    if (!previewDialog.open) previewDialog.showModal();
    setPreviewMode(initialMode, false);
    track(initialMode === "live" ? "live_demo_open" : "demo_preview_open", { caseId: guide.id, caseName: guide.name, mode: initialMode });
  }

  function applyLanguage() {
    const copy = currentCopy();
    previewDialogTitle.textContent = copy.previewTitle;
    previewModeSwitch.setAttribute("aria-label", copy.previewType);
    document.querySelector("#previewScreenRail")?.setAttribute("aria-label", window.image2I18n?.language === "en" ? "Case screens" : "案例页面");
    previewImagePrevious.setAttribute("aria-label", copy.previous);
    previewImagePrevious.title = copy.previous;
    previewImageNext.setAttribute("aria-label", copy.next);
    previewImageNext.title = copy.next;
    previewMediaRetry.textContent = copy.retry;
    previewDialogOpenLive.textContent = copy.openLive;
    previewDialogDemo.title = window.image2I18n?.language === "en" ? "Interactive demo preview" : "可点击 demo 预览";
    previewVideoProgress.setAttribute("aria-label", copy.progress);
    previewExpand.setAttribute("aria-label", previewDialog.classList.contains("is-lightbox") ? copy.exitFullscreen : copy.fullscreen);
    previewExpand.title = previewExpand.getAttribute("aria-label");
    updateVideoControls();
    if (previewDialog.open && activePreviewGuide) openPreview(activePreviewGuide.id, activePreviewMode || "auto");
  }

  function bindEvents() {
    if ("ResizeObserver" in window) new ResizeObserver(updateEmbeddedPreviewScale).observe(previewPhoneScreen);
    previewDialog.addEventListener("close", () => {
      window.clearTimeout(previewLoadTimer);
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
      setPreviewFullscreenState(false);
      unloadPreviewVideo();
      previewDialogImage.removeAttribute("src");
      previewDialogDemo.src = "about:blank";
      previewMediaStatus.hidden = true;
      previewMediaStatusText.textContent = "";
      previewMediaRetry.hidden = true;
      previewMediaStatus.classList.remove("is-error");
      previewCursor.hidden = true;
      previewCursor.classList.remove("is-running");
      previewMediaStage.classList.remove("is-video");
      previewVideoProgress.value = "0";
      previewVideoProgress.max = "0";
      updateVideoControls();
      previewImageNavigation.hidden = true;
      activePreviewMode = null;
      activePreviewImages = [];
      activePreviewImageIndex = 0;
      activePreviewGuide = null;
    });
    previewImagePrevious.addEventListener("click", () => {
      showPreviewImage(activePreviewImageIndex - 1);
      if (activePreviewGuide) track("preview_image_change", { caseId: activePreviewGuide.id, direction: "previous", index: activePreviewImageIndex });
    });
    previewImageNext.addEventListener("click", () => {
      showPreviewImage(activePreviewImageIndex + 1);
      if (activePreviewGuide) track("preview_image_change", { caseId: activePreviewGuide.id, direction: "next", index: activePreviewImageIndex });
    });
    previewDialogVideo.addEventListener("loadedmetadata", () => {
      previewMediaFrame.style.setProperty("--cursor-duration", `${Math.max(6, previewDialogVideo.duration)}s`);
      updateVideoControls();
    });
    previewDialogVideo.addEventListener("play", () => previewCursor.classList.add("is-running"));
    previewDialogVideo.addEventListener("pause", () => previewCursor.classList.remove("is-running"));
    previewDialogVideo.addEventListener("timeupdate", updateVideoControls);
    previewDialogVideo.addEventListener("durationchange", updateVideoControls);
    previewDialogVideo.addEventListener("ended", updateVideoControls);
    previewVideoToggle.addEventListener("click", () => {
      if (activeVideoSequence) {
        if (previewSequencePlaying) pausePreviewSequence();
        else playPreviewSequence();
      } else if (previewDialogVideo.paused) previewDialogVideo.play().catch(() => {});
      else previewDialogVideo.pause();
      updateVideoControls();
    });
    previewVideoProgress.addEventListener("input", () => {
      if (activeVideoSequence) seekPreviewSequence(previewVideoProgress.value);
      else if (Number.isFinite(previewDialogVideo.duration)) previewDialogVideo.currentTime = Number(previewVideoProgress.value);
      updateVideoControls();
    });
    previewExpand.addEventListener("click", () => togglePreviewFullscreen());
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement && previewDialog.classList.contains("is-lightbox")) setPreviewFullscreenState(false);
    });
    previewDialogImage.addEventListener("error", () => { if (activePreviewGuide) showPreviewImageError(previewDialogImage, activePreviewGuide); });
    previewDialogSequence.addEventListener("error", () => { if (activePreviewGuide) showPreviewImageError(previewDialogSequence, activePreviewGuide); });
    previewDialogDemo.addEventListener("load", () => {
      window.clearTimeout(previewLoadTimer);
      if (activePreviewGuide && !previewDialogDemo.hidden) previewMediaStatus.hidden = true;
    });
    previewDialogDemo.addEventListener("error", () => {
      window.clearTimeout(previewLoadTimer);
      previewMediaStatus.hidden = false;
      previewMediaStatusText.textContent = currentCopy().failed;
      previewMediaRetry.hidden = false;
      previewMediaStatus.classList.add("is-error");
    });
    previewMediaRetry.addEventListener("click", () => { if (activePreviewGuide) setPreviewMode("live", false); });
    previewDialogCopy.addEventListener("click", () => { if (activePreviewGuide) copyStyleMode(previewDialogCopy); });
    previewDialogApply.addEventListener("click", () => {
      if (!activePreviewGuide) return;
      applyCaseToProject(activePreviewGuide.id, true);
      previewDialogComponents.href = labUrlForGuide(activePreviewGuide);
      previewDialogCompare.href = labUrlForGuide(activePreviewGuide, "compare");
    });
    previewDialogStartTask.addEventListener("click", () => {
      if (activePreviewGuide) window.image2Project?.save?.({ ...projectPatchForGuide(activePreviewGuide), taskIntent: "rebuild" });
    });
    previewDialog.addEventListener("click", (event) => {
      const lightboxBackdrop = previewDialog.classList.contains("is-lightbox") && (event.target === previewDialogContent || event.target === previewMediaStage);
      if (event.target === previewDialog || lightboxBackdrop) previewDialog.close();
    });
    document.addEventListener("keydown", (event) => {
      if (!previewDialog.open || activePreviewMode !== "image" || activePreviewImages.length < 2) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPreviewImage(activePreviewImageIndex - 1);
        if (activePreviewGuide) track("preview_image_change", { caseId: activePreviewGuide.id, direction: "previous", index: activePreviewImageIndex });
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showPreviewImage(activePreviewImageIndex + 1);
        if (activePreviewGuide) track("preview_image_change", { caseId: activePreviewGuide.id, direction: "next", index: activePreviewImageIndex });
      }
    });
  }

  bindEvents();
  return {
    openPreview,
    setPreviewMode,
    applyLanguage,
    isOpen: () => Boolean(previewDialog.open),
    getActiveGuide: () => activePreviewGuide,
    getActiveMode: () => activePreviewMode
  };
}
