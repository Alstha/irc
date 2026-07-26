/* ==========================================================================
   IRC Icon Sprite — hand-authored inline SVG, no external icon font/CDN.
   Usage: IRC.icons.icon('search', 'my-class') -> '<svg class="icon ...">...'
   Sprite is injected once by main.js on bootstrap.
   ========================================================================== */
(function () {
  window.IRC = window.IRC || {};

  var ICONS = {
    menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    close: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
    "x-circle": '<circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>',
    sun: '<circle cx="12" cy="12" r="4.3"/><line x1="12" y1="1.5" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22.5"/><line x1="1.5" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22.5" y2="12"/><line x1="4.5" y1="4.5" x2="6.2" y2="6.2"/><line x1="17.8" y1="17.8" x2="19.5" y2="19.5"/><line x1="4.5" y1="19.5" x2="6.2" y2="17.8"/><line x1="17.8" y1="6.2" x2="19.5" y2="4.5"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
    "chevron-down": '<polyline points="6 9 12 15 18 9"/>',
    "chevron-right": '<polyline points="9 6 15 12 9 18"/>',
    "chevron-left": '<polyline points="15 6 9 12 15 18"/>',
    "arrow-right": '<line x1="4" y1="12" x2="20" y2="12"/><polyline points="13 5 20 12 13 19"/>',
    "arrow-up": '<line x1="12" y1="20" x2="12" y2="4"/><polyline points="5 11 12 4 19 11"/>',
    "external-link": '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    download: '<path d="M12 3v12"/><polyline points="7 11 12 16 17 11"/><path d="M5 19h14"/>',
    upload: '<path d="M12 21V9"/><polyline points="7 13 12 8 17 13"/><path d="M5 5h14"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><line x1="16" y1="3" x2="16" y2="7"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="3" y1="10" x2="21" y2="10"/>',
    clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/>',
    trophy: '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 5H4a3 3 0 0 0 3 5"/><path d="M17 5h3a3 3 0 0 1-3 5"/>',
    tag: '<path d="M20.6 12.9 12.9 20.6a2 2 0 0 1-2.8 0l-8-8V4h8.6l8 8a2 2 0 0 1 0 2.9z"/><circle cx="7.5" cy="7.5" r="1.1"/>',
    search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.2" y2="16.2"/>',
    filter: '<path d="M4 4h16l-6 8.2v6.3l-4 2v-8.3z"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17.5" cy="8.5" r="2.6"/><path d="M15.5 14.2c2.6.4 4.5 2.7 4.5 5.8"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.3"/><polyline points="3 7 12 13 21 7"/>',
    phone: '<path d="M6.5 3h3l1.5 5-2.5 1.5a12 12 0 0 0 5.5 5.5L15.5 12l5 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3z"/>',
    "map-pin": '<path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><line x1="7.5" y1="10.2" x2="7.5" y2="17"/><circle cx="7.5" cy="6.8" r="1.15" fill="currentColor" stroke="none"/><line x1="11.6" y1="10.2" x2="11.6" y2="17"/><path d="M11.6 13.2c0-1.7 1-2.8 2.5-2.8s2.4 1.1 2.4 2.8V17"/>',
    facebook: '<path d="M14 21v-7.2h2.4l.4-3H14V8.8c0-.9.3-1.5 1.6-1.5H17V4.7c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8.3v3H10.8V21z" fill="currentColor" stroke="none"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/>',
    "social-x": '<line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>',
    youtube: '<rect x="2.3" y="5.5" width="19.4" height="13" rx="4"/><polygon points="10.3 9 15.7 12 10.3 15" fill="currentColor" stroke="none"/>',
    play: '<polygon points="6 4 20 12 6 20" fill="currentColor" stroke="none"/>',
    star: '<polygon points="12 2.5 14.9 9 22 9.8 16.8 14.6 18.2 21.6 12 18 5.8 21.6 7.2 14.6 2 9.8 9.1 9"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14 6.5 21l5.5-3 5.5 3-2-7"/>',
    briefcase: '<rect x="3" y="8" width="18" height="12" rx="2.3"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="3" y1="13" x2="21" y2="13"/>',
    "book-open": '<path d="M12 6.5c-1.8-1.4-4.2-2-7.5-2v13c3.3 0 5.7.6 7.5 2 1.8-1.4 4.2-2 7.5-2v-13c-3.3 0-5.7.6-7.5 2z"/><line x1="12" y1="6.5" x2="12" y2="19.5"/>',
    target: '<circle cx="12" cy="12" r="8.3"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
    rocket: '<path d="M13.2 3.5c3 .2 5.3 2.7 5.3 6-3 .8-5 2.8-6 5.7l-4-4c1-2.8 2.8-4.8 4.7-7.7z"/><circle cx="14.5" cy="8.7" r="1.2" fill="currentColor" stroke="none"/><path d="M8.7 14.5l-4.2 1.3L5.8 11.5"/><path d="M7 17.3c-1.4.9-1.8 3.2-1.8 3.2s2.3-.4 3.2-1.8"/>',
    cpu: '<rect x="7" y="7" width="10" height="10" rx="2"/><rect x="10" y="10" width="4" height="4"/><line x1="2.5" y1="10" x2="5" y2="10"/><line x1="2.5" y1="14" x2="5" y2="14"/><line x1="19" y1="10" x2="21.5" y2="10"/><line x1="19" y1="14" x2="21.5" y2="14"/><line x1="10" y1="2.5" x2="10" y2="5"/><line x1="14" y1="2.5" x2="14" y2="5"/><line x1="10" y1="19" x2="10" y2="21.5"/><line x1="14" y1="19" x2="14" y2="21.5"/>',
    edit: '<path d="M4 20l1-4.2L15.5 5.3a1.8 1.8 0 0 1 2.6 0l.6.6a1.8 1.8 0 0 1 0 2.6L8.2 19 4 20z"/>',
    trash: '<path d="M5 7h14"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M6.5 7l1 13a2 2 0 0 0 2 1.8h5a2 2 0 0 0 2-1.8l1-13"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    check: '<polyline points="4 12 9.5 18 20 6"/>',
    "check-circle": '<circle cx="12" cy="12" r="9"/><polyline points="7.5 12.5 10.5 15.5 16.5 9"/>',
    "alert-circle": '<circle cx="12" cy="12" r="9"/><line x1="12" y1="7.5" x2="12" y2="13.2"/><circle cx="12" cy="16.4" r="1" fill="currentColor" stroke="none"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2.3"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M21 16l-5.5-5.5L6 20"/>',
    video: '<rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="M15.5 10l6-3.5v11l-6-3.5z"/>',
    quote: '<path d="M9.5 8.5c-2.5 0-4.5 2-4.5 4.5v3h4.5V11h-2c0-1.4 1-2.5 2-2.5v-2z" fill="currentColor" stroke="none"/><path d="M18 8.5c-2.5 0-4.5 2-4.5 4.5v3H18V11h-2c0-1.4 1-2.5 2-2.5v-2z" fill="currentColor" stroke="none"/>',
    "graduation-cap": '<path d="M2 9l10-4.5L22 9l-10 4.5L2 9z"/><path d="M6 11v4.3c0 1.4 2.7 2.4 6 2.4s6-1 6-2.4V11"/><line x1="22" y1="9" x2="22" y2="15.5"/>',
    flask: '<path d="M9.5 3h5"/><path d="M10.5 3v6l-5.2 8.6A2 2 0 0 0 7 20.5h10a2 2 0 0 0 1.7-3L13.5 9V3"/><line x1="8.2" y1="14.5" x2="15.8" y2="14.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3c2.5 2.5 3.8 5.8 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.8-3.8-9s1.3-6.5 3.8-9z"/>',
    link: '<path d="M9.5 14.5l5-5"/><path d="M12 6l1.5-1.5a3.5 3.5 0 0 1 5 5L17 11"/><path d="M12 18l-1.5 1.5a3.5 3.5 0 0 1-5-5L7 13"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.3"/><path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5"/>',
    building: '<rect x="4" y="3" width="10" height="18" rx="1"/><rect x="14" y="9" width="6" height="12" rx="1"/><line x1="7" y1="7" x2="7.01" y2="7"/><line x1="11" y1="7" x2="11.01" y2="7"/><line x1="7" y1="11" x2="7.01" y2="11"/><line x1="11" y1="11" x2="11.01" y2="11"/><line x1="7" y1="15" x2="7.01" y2="15"/><line x1="11" y1="15" x2="11.01" y2="15"/>',
    layers: '<polygon points="12 3 21 8 12 13 3 8 12 3"/><polyline points="3 13 12 18 21 13"/><polyline points="3 17.5 12 22.5 21 17.5"/>',
    grid: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
    list: '<line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><line x1="4" y1="6" x2="4.01" y2="6"/><line x1="4" y1="12" x2="4.01" y2="12"/><line x1="4" y1="18" x2="4.01" y2="18"/>',
    share: '<circle cx="18" cy="5" r="2.3"/><circle cx="6" cy="12" r="2.3"/><circle cx="18" cy="19" r="2.3"/><line x1="8" y1="10.8" x2="16" y2="6.2"/><line x1="8" y1="13.2" x2="16" y2="17.8"/>',
    bell: '<path d="M6 10a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    "file-text": '<path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="15.5" x2="15" y2="15.5"/><line x1="9" y1="8.5" x2="11" y2="8.5"/>',
    "bar-chart": '<line x1="5" y1="20" x2="5" y2="12"/><line x1="12" y1="20" x2="12" y2="6"/><line x1="19" y1="20" x2="19" y2="15"/>',
    zap: '<polygon points="13 2 4 14 11 14 10 22 20 9 13 9 13 2"/>',
    shield: '<path d="M12 3l7 3v6c0 4.8-3 8.2-7 9-4-.8-7-4.2-7-9V6z"/>',
    "message-circle": '<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6a8.4 8.4 0 0 1-.9-3.9A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M5.5 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v.5"/>',
    send: '<polygon points="21 3 14.5 21 10.5 13.5 3 9.5 21 3"/>',
    refresh: '<path d="M20 11A8 8 0 0 0 6.5 6.5L4 9"/><polyline points="4 4 4 9 9 9"/><path d="M4 13a8 8 0 0 0 13.5 4.5L20 15"/><polyline points="20 20 20 15 15 15"/>',
    "log-out": '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    sparkles: '<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M19 15l.6 2 2 .6-2 .6-.6 2-.6-2-2-.6 2-.6z"/>',
    lightbulb: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6.5 6.5 0 0 0-4 11.6c.6.5 1 1.3 1 2.1v.3h6v-.3c0-.8.4-1.6 1-2.1A6.5 6.5 0 0 0 12 3z"/>'
  };

  function buildSprite() {
    var symbols = "";
    for (var name in ICONS) {
      if (Object.prototype.hasOwnProperty.call(ICONS, name)) {
        symbols += '<symbol id="icon-' + name + '" viewBox="0 0 24 24">' + ICONS[name] + "</symbol>";
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">' + symbols + "</svg>";
  }

  function injectSprite() {
    if (document.getElementById("irc-icon-sprite")) return;
    var wrap = document.createElement("div");
    wrap.id = "irc-icon-sprite";
    wrap.innerHTML = buildSprite();
    document.body.insertBefore(wrap, document.body.firstChild);
  }

  function icon(name, cls, size) {
    if (!ICONS[name]) return "";
    var style = size ? ' style="width:' + size + "px;height:" + size + 'px"' : "";
    return '<svg class="icon' + (cls ? " " + cls : "") + '"' + style + ' aria-hidden="true" focusable="false"><use href="#icon-' + name + '"></use></svg>';
  }

  window.IRC.icons = { injectSprite: injectSprite, icon: icon, names: Object.keys(ICONS) };
})();
