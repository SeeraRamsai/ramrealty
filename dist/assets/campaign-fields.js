(() => {
  const params = new URLSearchParams(location.search);
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    let value = params.get(key) || '';
    try {
      if (params.has(key)) sessionStorage.setItem(key, value.slice(0, 250));
      else value = sessionStorage.getItem(key) || '';
    } catch { /* Forms still work when browser storage is disabled. */ }
    const field = document.querySelector(`[name="${key}"]`);
    if (field) field.value = value.slice(0, 250);
  }
})();
