# Walkthrough encoding and player behavior

Default playback uses a data-saver MP4: H.264 Main/yuv420p, maximum 640-pixel long edge, 24 fps, CRF 28 with a 450 kbps video cap, mono AAC at 48 kbps, short keyframe intervals and faststart metadata. These copies trade fine detail and stereo audio for lower transfer and decoding cost. The existing original files remain selectable in the same player.

No video source is attached before a visitor presses Play walkthrough. Only one media element remains active. Opening another, closing the player, hiding the page or moving a player far offscreen pauses it, removes its source and calls load() before removal. Saved playback position is restored when reopened. Browser behavior and connection speed still influence buffering and memory; no fixed memory or startup-time guarantee is implied.

Recreate or validate the data-saver variants:

    .venv/Scripts/python -m pip install imageio-ffmpeg
    .venv/Scripts/python tools/optimize-videos.py
    .venv/Scripts/python tools/optimize-videos.py --validate-only
    python tools/configure-video-pages.py
    node tools/test-video-player.mjs

The encoder leaves the original MP4s untouched, preserves duration/audio presence, checks metadata placement and decodes each output fully. It skips existing v1 outputs; use a new versioned filename/profile when intentionally changing encoding settings. HTML references and the manifest must be updated together.
