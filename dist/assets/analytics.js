(() => {
  const measurementId = 'G-7DBBCTFPDT';
  const preferenceKey = 'ramrealty-analytics-consent-v1';
  const panel = document.querySelector('[data-analytics-choice]');
  if (!panel) return;
  let consent = '';
  let loaded = false;
  let opener = null;
  try { consent = localStorage.getItem(preferenceKey) || ''; } catch { /* Choice remains available without storage. */ }
  function tag() { window.dataLayer.push(arguments); }
  function activate() {
    if (loaded || consent !== 'granted' || !['ramrealty.in','www.ramrealty.in'].includes(location.hostname)) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    tag('consent', 'default', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
    tag('consent', 'update', {analytics_storage:'granted'});
    tag('js', new Date());
    tag('config', measurementId, {
      page_location: location.origin + location.pathname,
      page_referrer: document.referrer ? new URL(document.referrer).origin : '',
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.append(script);
  }
  function clearAnalyticsCookies() {
    // Remove this site's GA cookies at host and parent-domain scope.
    for (const entry of document.cookie.split(';')) {
      const name = entry.split('=')[0].trim();
      if (name !== '_ga' && !name.startsWith('_ga_') && name !== '_gid' && !name.startsWith('_gat')) continue;
      const parts = location.hostname.split('.');
      document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
      for (let index=0; index<parts.length-1; index++) {
        document.cookie = name + '=; Max-Age=0; path=/; domain=.' + parts.slice(index).join('.') + '; SameSite=Lax';
      }
    }
  }
  function choose(value) {
    consent = value;
    let saved = false;
    try { localStorage.setItem(preferenceKey, value); saved = true; } catch { /* Applies to this page even when storage is blocked. */ }
    panel.hidden = true;
    if (opener) opener.focus();
    else document.querySelector('main')?.focus({preventScroll:true});
    if (value === 'granted') activate();
    else {
      window['ga-disable-' + measurementId] = true;
      clearAnalyticsCookies();
      // Unload an already-accepted Google tag; the next page starts without it.
      if (loaded && saved) location.reload();
    }
  }
  panel.querySelector('[data-analytics-accept]').addEventListener('click', () => {
    window['ga-disable-' + measurementId] = false;
    choose('granted');
  });
  panel.querySelector('[data-analytics-reject]').addEventListener('click', () => choose('denied'));
  document.querySelectorAll('[data-analytics-manage]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      opener = button;
      panel.hidden = false;
      panel.querySelector('[data-analytics-accept]').focus();
    });
  });
  function event(name) {
    if (consent !== 'granted' || !loaded) return;
    const project = location.pathname.split('/').filter(Boolean)[0] || 'home';
    const listings = ['mvv-gv-grand','vaisakhi-west-winds','a-square-maple-woods','utkarsha-capital-towers'];
    tag('event', name, {send_to:measurementId, project:listings.includes(project) ? project : 'website'});
  }
  document.addEventListener('click', e => {
    const link = e.target.closest?.('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.protocol === 'tel:') event('phone_click');
    else if (url.protocol === 'https:' && url.hostname === 'wa.me') event('whatsapp_click');
  });
  document.addEventListener('submit', e => {
    const form = e.target;
    if (form.querySelector?.('[name="form-name"][value="property-enquiry"]') && !form.querySelector(':invalid')) {
      event('enquiry_submit_attempt');
    }
  }, true);
  if (consent === 'granted') activate();
  else if (consent !== 'denied') panel.hidden = false;
})();
