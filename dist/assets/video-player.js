document.querySelectorAll("[data-video-player]").forEach((player) => {
  const button = player.querySelector(".video-load-button");
  const poster = player.querySelector("img");
  const status = player.querySelector(".video-status");

  if (!button || !poster || !status) {
    return;
  }

  button.setAttribute("aria-label", `Load video player for ${player.dataset.title}`);

  button.addEventListener("click", () => {
    const video = document.createElement("video");
    const source = document.createElement("source");
    const title = player.dataset.title;

    video.controls = true;
    video.playsInline = true;
    video.preload = "none";
    video.poster = poster.currentSrc || poster.src;
    video.setAttribute("aria-label", title);
    video.title = title;
    source.src = player.dataset.src;
    source.type = "video/mp4";
    video.append(source);

    video.addEventListener("error", () => {
      const link = document.createElement("a");
      link.href = player.dataset.src;
      link.textContent = "Open the video file";
      link.target = "_blank";
      link.rel = "noopener";
      status.replaceChildren(
        document.createTextNode("This video could not be played here. "),
        link,
      );
      status.hidden = false;
    });

    poster.hidden = true;
    button.replaceWith(video);
  });
});
