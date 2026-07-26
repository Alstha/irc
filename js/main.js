/* ==========================================================================
   Sitewide bootstrap. Runs synchronously at end-of-body — by the time a
   `defer`red script this far down executes, the DOM is fully parsed, so no
   DOMContentLoaded wrapper is needed. This also guarantees header/footer/
   theme/nav are ready BEFORE the next script tag (a page controller) runs,
   since classic scripts execute strictly in document order.
   ========================================================================== */
(function () {
  window.IRC = window.IRC || {};
  var utils = IRC.utils;
  var $ = utils.$, $$ = utils.$$;

  var THEME_KEY = "irc_theme";

  function initTheme() {
    var toggle = $("#themeToggle");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      var html = document.documentElement;
      var current = html.getAttribute("data-theme");
      var isDark = current ? current === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = isDark ? "light" : "dark";
      html.setAttribute("data-theme", next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  function initNav() {
    var toggle = $("#navToggle");
    var nav = $("#siteNav");
    if (!toggle || !nav) return;

    function closeMobileNav() {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    $$(".site-nav__link:not(.site-nav__link--dropdown)", nav).forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });
    $$(".site-nav__dropdown a", nav).forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });

    $$(".site-nav__link--dropdown", nav).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".site-nav__item");
        var expanded = item.classList.toggle("is-expanded");
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      });
    });

    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) closeMobileNav();
    });

    IRC._closeMobileNav = closeMobileNav;
  }

  function initScrollProgress() {
    var bar = $("#scrollProgress");
    if (!bar) return;
    var ticking = false;
    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = (height > 0 ? (scrollTop / height) * 100 : 0) + "%";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  function initBackToTop() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "back-to-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = IRC.icons.icon("arrow-up");
    document.body.appendChild(btn);
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: utils.prefersReducedMotion() ? "auto" : "smooth" });
    });
    window.addEventListener("scroll", utils.debounce(function () {
      btn.classList.toggle("is-visible", window.scrollY > 480);
    }, 100), { passive: true });
  }

  function initPageLoader() {
    var loader = $("#pageLoader");
    if (!loader) return;
    function hide() { loader.classList.add("is-hidden"); }
    if (document.readyState === "complete") {
      setTimeout(hide, 150);
    } else {
      window.addEventListener("load", function () { setTimeout(hide, 150); });
    }
  }

  function buildSearchIndex() {
    var index = [];
    (IRC.data.nav || []).forEach(function (item) {
      if (item.children) {
        item.children.forEach(function (c) { index.push({ type: "Page", title: c.label, href: c.href }); });
      } else if (item.href !== "#") {
        index.push({ type: "Page", title: item.label, href: item.href });
      }
    });
    (IRC.data.opportunities || []).forEach(function (o) {
      index.push({ type: "Opportunity", title: o.title, href: "research-engagement.html#" + o.id });
    });
    (IRC.data.events || []).forEach(function (e) {
      index.push({ type: "Event", title: e.title, href: "events.html#" + e.id });
    });
    (IRC.data.resources || []).forEach(function (r) {
      index.push({ type: "Resource", title: r.title, href: "resources.html#" + r.id });
    });
    (IRC.data.magazines || []).forEach(function (m) {
      index.push({ type: "Magazine", title: m.title, href: "magazine.html#" + m.id });
    });
    (IRC.data.team || []).filter(function (t) { return !t.isPlaceholder; }).forEach(function (t) {
      index.push({ type: "Leadership", title: t.name, href: "leadership.html#" + t.id });
    });
    return index;
  }

  function initSearchOverlay() {
    var openBtn = $("#searchToggle");
    if (!openBtn) return;

    var markup =
      '<div class="search-overlay" id="searchOverlay" role="dialog" aria-modal="true" aria-label="Site search">' +
        '<div class="search-panel">' +
          '<div class="search-panel__input">' +
            IRC.icons.icon("search") +
            '<label for="searchInput" class="sr-only">Search the site</label>' +
            '<input type="text" id="searchInput" name="q" placeholder="Search pages, opportunities, events…" autocomplete="off" />' +
            '<button class="icon-btn" id="searchClose" type="button" aria-label="Close search">' + IRC.icons.icon("close") + "</button>" +
          "</div>" +
          '<div class="search-results" id="searchResults"><p class="search-empty">Start typing to search the site.</p></div>' +
        "</div>" +
      "</div>";
    document.body.insertAdjacentHTML("beforeend", markup);

    var overlay = $("#searchOverlay");
    var input = $("#searchInput");
    var results = $("#searchResults");
    var closeBtn = $("#searchClose");
    var index = buildSearchIndex();

    function open() {
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
      setTimeout(function () { input.focus(); }, 60);
    }
    function close() {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    IRC._closeSearch = close;

    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });

    input.addEventListener("input", utils.debounce(function () {
      var q = input.value.trim().toLowerCase();
      if (!q) {
        results.innerHTML = '<p class="search-empty">Start typing to search the site.</p>';
        return;
      }
      var matches = index.filter(function (item) { return item.title.toLowerCase().indexOf(q) > -1; }).slice(0, 8);
      if (!matches.length) {
        results.innerHTML = '<p class="search-empty">No results for "' + utils.escapeHtml(input.value) + '".</p>';
        return;
      }
      results.innerHTML = matches.map(function (m) {
        return '<a href="' + m.href + '"><span>' + m.type + "</span>" + utils.escapeHtml(m.title) + "</a>";
      }).join("");
    }, 160));
  }

  function initNewsletterForms() {
    $$(".newsletter-form").forEach(function (form) {
      if (form.dataset.wired) return;
      form.dataset.wired = "true";
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        if (!input || !utils.validators.email(input.value)) {
          utils.toast("Please enter a valid email address.", "danger");
          return;
        }
        utils.toast("Subscribed! IRC updates will be sent to " + input.value + ".", "success");
        form.reset();
      });
    });
  }

  function initGlobalKeydown() {
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (IRC._closeSearch) IRC._closeSearch();
      if (IRC._closeMobileNav) IRC._closeMobileNav();
      document.dispatchEvent(new CustomEvent("irc:escape"));
    });
  }

  /* ---- Particle network canvas (hero backgrounds) --------------------------
     Opt-in via <canvas data-particle-network>. Self-contained, theme-agnostic
     (draws light dots/lines meant for a dark hero surface), pauses when the
     tab is hidden, and renders a single static frame under reduced-motion. */
  function mountParticleNetwork(canvas) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var raf = null;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var reduced = utils.prefersReducedMotion();

    function size() {
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: rect.width, h: rect.height };
    }

    var bounds = size();
    var count = Math.min(70, Math.round((bounds.w * bounds.h) / 16000));

    function makeParticle() {
      return {
        x: Math.random() * bounds.w,
        y: Math.random() * bounds.h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8
      };
    }
    for (var i = 0; i < count; i++) particles.push(makeParticle());

    function step() {
      ctx.clearRect(0, 0, bounds.w, bounds.h);
      particles.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > bounds.w) p.vx *= -1;
        if (p.y < 0 || p.y > bounds.h) p.vy *= -1;
      });
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.strokeStyle = "rgba(148, 187, 255," + (1 - dist / 130) * 0.35 + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
      particles.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(206, 224, 255, 0.85)";
        ctx.fill();
      });
      if (!reduced) raf = requestAnimationFrame(step);
    }

    step();

    if (!reduced) {
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
          if (raf) cancelAnimationFrame(raf);
        } else {
          raf = requestAnimationFrame(step);
        }
      });
      window.addEventListener("resize", utils.debounce(function () {
        bounds = size();
      }, 200));
    }
  }

  function initServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("./sw.js").then(function (reg) {
          console.log("[PWA] ServiceWorker registered with scope:", reg.scope);
        }).catch(function (err) {
          console.warn("[PWA] ServiceWorker registration failed:", err);
        });
      });
    }
  }

  function initPWAInstallPrompt() {
    var deferredPrompt;
    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferredPrompt = e;
      var actions = $(".site-header__actions");
      if (actions && !$("#pwaInstallBtn")) {
        var installBtn = document.createElement("button");
        installBtn.id = "pwaInstallBtn";
        installBtn.type = "button";
        installBtn.className = "btn btn--primary btn--sm pwa-install-btn";
        installBtn.setAttribute("aria-label", "Install IRC App");
        installBtn.innerHTML = IRC.icons.icon("download") + " <span>Install App</span>";
        installBtn.addEventListener("click", function () {
          if (!deferredPrompt) return;
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(function (choiceResult) {
            if (choiceResult.outcome === "accepted") {
              console.log("[PWA] User accepted the install prompt");
            }
            deferredPrompt = null;
            installBtn.remove();
          });
        });
        actions.insertBefore(installBtn, actions.firstChild);
      }
    });

    window.addEventListener("appinstalled", function () {
      console.log("[PWA] IRC App installed successfully");
      var btn = $("#pwaInstallBtn");
      if (btn) btn.remove();
    });
  }

  function initPushNotifications() {
    if (!("Notification" in window)) return;
    var actions = $(".site-header__actions");
    if (!actions || $("#pushNotifToggle")) return;

    var notifBtn = document.createElement("button");
    notifBtn.id = "pushNotifToggle";
    notifBtn.type = "button";
    notifBtn.className = "icon-btn";
    notifBtn.setAttribute("aria-label", "Toggle Push Notifications");

    function updateIcon() {
      if (Notification.permission === "granted") {
        notifBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
        notifBtn.title = "Notifications Enabled";
        notifBtn.classList.add("is-active");
      } else {
        notifBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><line x1="2" y1="2" x2="22" y2="22"/></svg>';
        notifBtn.title = "Enable Push Notifications for Notices";
        notifBtn.classList.remove("is-active");
      }
    }

    updateIcon();

    notifBtn.addEventListener("click", function () {
      if (Notification.permission === "default") {
        Notification.requestPermission().then(function (permission) {
          updateIcon();
          if (permission === "granted" && navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: "BROADCAST_NOTIFICATION",
              payload: {
                title: "IRC Notices Subscribed!",
                body: "You will now receive instant notifications when new notices, hackathons, or research updates are posted.",
                url: "./index.html"
              }
            });
          }
        });
      } else if (Notification.permission === "granted") {
        alert("Notifications are enabled! You will receive mobile notices when updates are posted.");
      } else {
        alert("Notification permissions are blocked in your browser settings. Please enable notifications to receive mobile notices.");
      }
    });

    actions.insertBefore(notifBtn, actions.firstChild);
  }

  function bootstrap() {
    IRC.icons.injectSprite();
    var page = document.body.getAttribute("data-page") || "";
    var headerMount = $("#site-header");
    var footerMount = $("#site-footer");
    if (headerMount) headerMount.innerHTML = IRC.ui.renderHeader(page);
    if (footerMount) footerMount.innerHTML = IRC.ui.renderFooter();

    initTheme();
    initNav();
    initScrollProgress();
    initBackToTop();
    initSearchOverlay();
    initNewsletterForms();
    initGlobalKeydown();
    initPageLoader();
    initServiceWorker();
    initPWAInstallPrompt();
    initPushNotifications();
    utils.mountScrollReveal();
    utils.mountCounters();
    mountParticleNetworks();

    document.dispatchEvent(new CustomEvent("irc:chrome-ready"));
  }

  bootstrap();
})();


