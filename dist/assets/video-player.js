let activeWalkthrough = null;

function releaseActiveWalkthrough() {
  if (activeWalkthrough) activeWalkthrough.release();
}

const visibilityObserver = typeof IntersectionObserver === "function"
  ? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting && activeWalkthrough?.player === entry.target && !document.fullscreenElement) {
          releaseActiveWalkthrough();
        }
      }
    }, { rootMargin: "200px" })
  : null;

function sizeLabel(bytes) {
  const value = Number(bytes);
  return value > 0 ? ` (~${(value / 1000000).toFixed(1)} MB)` : "";
}

document.querySelectorAll("[data-video-player]").forEach((player) => {
  const button = player.querySelector(".video-load-button");
  const poster = player.querySelector("img");
  const status = player.querySelector(".video-status");
  if (!button || !poster || !status) return;

  const title = player.dataset.title || "Property walkthrough";
  let video = null;
  let resumeTime = 0;
  let disposed = false;
  button.textContent = "Play walkthrough";
  button.setAttribute("aria-label", `Play walkthrough for ${title}`);

  const tools = document.createElement("div");
  tools.className = "video-tools";
  const qualityLabel = document.createElement("label");
  qualityLabel.textContent = "Video quality ";
  const quality = document.createElement("select");
  quality.setAttribute("aria-label", `Video quality for ${title}`);
  const mobile = document.createElement("option");
  mobile.value = "mobile";
  mobile.textContent = `Data saver${sizeLabel(player.dataset.videoBytes)}`;
  quality.append(mobile);
  if (player.dataset.originalSrc) {
    const original = document.createElement("option");
    original.value = "original";
    original.textContent = `Original quality${sizeLabel(player.dataset.originalBytes)}`;
    quality.append(original);
  }
  qualityLabel.append(quality);
  tools.append(qualityLabel);
  const close = document.createElement("button");
  close.type = "button";
  close.className = "video-release-button";
  close.textContent = "Close video";
  close.setAttribute("aria-label", `Close video for ${title}`);
  close.hidden = true;
  tools.append(close);
  player.insertAdjacentElement("afterend", tools);

  function release() {
    if (!video) return;
    disposed = true;
    resumeTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;
    video.pause();
    video.removeAttribute("src");
    video.load(); // Abort media requests and release the old resource before removal.
    video.remove();
    video = null;
    poster.hidden = false;
    button.hidden = false;
    close.hidden = true;
    status.hidden = true;
    if (activeWalkthrough?.player === player) activeWalkthrough = null;
  }

  function selectedSource() {
    return quality.value === "original" && player.dataset.originalSrc
      ? player.dataset.originalSrc : player.dataset.src;
  }

  button.addEventListener("click", () => {
    if (video) return;
    releaseActiveWalkthrough();
    disposed = false;
    const current = document.createElement("video");
    video = current;
    current.controls = true;
    current.playsInline = true;
    current.preload = "none";
    current.poster = poster.currentSrc || poster.src;
    current.setAttribute("aria-label", title);
    current.title = title;
    current.addEventListener("loadedmetadata", () => {
      if (!disposed && video === current && resumeTime > 0 && resumeTime < current.duration) current.currentTime = resumeTime;
    }, { once: true });
    current.addEventListener("playing", () => { if (video === current) status.hidden = true; });
    current.addEventListener("error", () => {
      if (disposed || video !== current) return;
      const link = document.createElement("a");
      link.href = selectedSource();
      link.textContent = "Open this video file";
      status.replaceChildren(document.createTextNode("This video could not be played here. "), link);
      status.hidden = false;
    });
    current.src = selectedSource();
    poster.hidden = true;
    button.hidden = true;
    close.hidden = false;
    status.hidden = true;
    player.append(current);
    activeWalkthrough = { player, release };
    // This play request follows the visitor's explicit click; nothing autoplays on page load.
    const playing = current.play();
    if (playing?.catch) playing.catch(() => {
      if (!disposed && video === current && !current.error) {
        status.textContent = "Player ready. Use the video play control to start.";
        status.hidden = false;
      }
    });
  });
  quality.addEventListener("change", release);
  close.addEventListener("click", () => { release(); button.focus(); });
  visibilityObserver?.observe(player);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) releaseActiveWalkthrough();
});
window.addEventListener("pagehide", releaseActiveWalkthrough);
