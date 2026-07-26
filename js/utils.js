/* ==========================================================================
   Shared utilities: DOM helpers, date/status formatting, countdown engine,
   scroll-reveal, animated counters, toasts, the sitewide placeholder-link
   handler, and lightweight form validators. Loaded once, used everywhere.
   ========================================================================== */
(function () {
  window.IRC = window.IRC || {};
  var utils = {};

  /* ---- DOM shorthands --------------------------------------------------- */
  utils.$ = function (sel, root) { return (root || document).querySelector(sel); };
  utils.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  utils.prefersReducedMotion = function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  /* ---- Date / status helpers --------------------------------------------- */
  utils.formatDate = function (iso, opts) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    var options = opts || { year: "numeric", month: "short", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(d);
  };

  utils.formatDateTime = function (iso) {
    return utils.formatDate(iso, { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  utils.formatDateRange = function (startIso, endIso) {
    var start = new Date(startIso);
    var end = endIso ? new Date(endIso) : null;
    var datePart = utils.formatDate(startIso);
    var startTime = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(start);
    if (!end) return datePart + " · " + startTime;
    var endTime = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(end);
    return datePart + " · " + startTime + " – " + endTime;
  };

  utils.timeAgo = function (iso) {
    var d = new Date(iso);
    var diffMs = Date.now() - d.getTime();
    var diffDay = Math.floor(diffMs / 86400000);
    if (diffDay <= 0) return "Today";
    if (diffDay === 1) return "Yesterday";
    if (diffDay < 7) return diffDay + " days ago";
    if (diffDay < 30) return Math.floor(diffDay / 7) + (Math.floor(diffDay / 7) === 1 ? " week ago" : " weeks ago");
    if (diffDay < 365) return Math.floor(diffDay / 30) + (Math.floor(diffDay / 30) === 1 ? " month ago" : " months ago");
    return utils.formatDate(iso);
  };

  utils.getEventStatus = function (startIso) {
    return new Date(startIso).getTime() >= Date.now() ? "upcoming" : "past";
  };

  // Opportunity status derived from deadline — never stored, always computed.
  utils.getOpportunityStatus = function (deadlineIso) {
    var remaining = new Date(deadlineIso).getTime() - Date.now();
    var threeDays = 3 * 24 * 60 * 60 * 1000;
    if (remaining <= 0) return { status: "closed", label: "Closed", badgeClass: "badge--neutral" };
    if (remaining <= threeDays) return { status: "closing-soon", label: "Closing Soon", badgeClass: "badge--danger" };
    return { status: "open", label: "Open", badgeClass: "badge--success" };
  };

  /* ---- Misc formatting ---------------------------------------------------- */
  utils.slugify = function (str) {
    return String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  utils.getInitials = function (name) {
    if (!name) return "?";
    var parts = name.trim().split(/\s+/);
    var initials = parts[0].charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : "");
    return initials.toUpperCase();
  };

  // Deterministic hue from a string, used for generated monogram badges
  // (organizer marks, gallery tiles) so we never depend on external logo art.
  utils.hashHue = function (str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
  };

  utils.monogramStyle = function (str) {
    var hue = utils.hashHue(str || "IRC");
    return "background:linear-gradient(135deg, hsl(" + hue + ",70%,42%), hsl(" + ((hue + 40) % 360) + ",70%,32%));";
  };

  utils.debounce = function (fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait || 220);
    };
  };

  utils.escapeHtml = function (str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  utils.uid = function (prefix) {
    return (prefix || "id") + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  };

  /* ---- Countdown engine (shared interval, not one-per-element) ------------ */
  var countdownRegistry = [];
  var countdownTimer = null;

  function pad(n) { return String(n).padStart(2, "0"); }

  function computeParts(deadlineIso) {
    var diff = new Date(deadlineIso).getTime() - Date.now();
    if (diff <= 0) return null;
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff / 3600000) % 24),
      m: Math.floor((diff / 60000) % 60),
      s: Math.floor((diff / 1000) % 60)
    };
  }

  function tickCountdowns() {
    countdownRegistry.forEach(function (entry) {
      var parts = computeParts(entry.deadline);
      if (!parts) {
        entry.el.innerHTML = '<span class="badge badge--neutral">Deadline passed</span>';
        entry.done = true;
        return;
      }
      entry.el.classList.toggle("is-urgent", parts.d < 1);
      entry.dEl.textContent = pad(parts.d);
      entry.hEl.textContent = pad(parts.h);
      entry.mEl.textContent = pad(parts.m);
      entry.sEl.textContent = pad(parts.s);
    });
    countdownRegistry = countdownRegistry.filter(function (e) { return !e.done; });
    if (!countdownRegistry.length && countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }

  utils.mountCountdown = function (el, deadlineIso) {
    var parts = computeParts(deadlineIso);
    if (!parts) {
      el.innerHTML = '<span class="badge badge--neutral">Deadline passed</span>';
      return;
    }
    el.innerHTML =
      '<div class="countdown__unit"><span class="countdown__num" data-unit="d">' + pad(parts.d) + '</span><span class="countdown__label">Days</span></div>' +
      '<div class="countdown__unit"><span class="countdown__num" data-unit="h">' + pad(parts.h) + '</span><span class="countdown__label">Hrs</span></div>' +
      '<div class="countdown__unit"><span class="countdown__num" data-unit="m">' + pad(parts.m) + '</span><span class="countdown__label">Min</span></div>' +
      '<div class="countdown__unit"><span class="countdown__num" data-unit="s">' + pad(parts.s) + '</span><span class="countdown__label">Sec</span></div>';
    countdownRegistry.push({
      el: el,
      deadline: deadlineIso,
      dEl: el.querySelector('[data-unit="d"]'),
      hEl: el.querySelector('[data-unit="h"]'),
      mEl: el.querySelector('[data-unit="m"]'),
      sEl: el.querySelector('[data-unit="s"]'),
      done: false
    });
    if (!countdownTimer) countdownTimer = setInterval(tickCountdowns, 1000);
  };

  /* ---- Scroll reveal (IntersectionObserver, one-time reveal) -------------- */
  utils.mountScrollReveal = function (root) {
    var els = utils.$$("[data-reveal]", root);
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(function (el, i) {
      if (!el.style.getPropertyValue("--reveal-delay")) {
        el.style.setProperty("--reveal-delay", Math.min(i % 6, 5) * 0.08 + "s");
      }
      io.observe(el);
    });
  };

  /* ---- Animated counters --------------------------------------------------- */
  utils.mountCounters = function (root) {
    var els = utils.$$("[data-counter]", root);
    if (!els.length) return;
    var reduced = utils.prefersReducedMotion();

    function run(el) {
      var target = parseFloat(el.getAttribute("data-target") || "0");
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduced) {
        el.textContent = target + suffix;
        return;
      }
      var duration = 1600;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      els.forEach(run);
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            run(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    els.forEach(function (el) { io.observe(el); });
  };

  /* ---- Toasts --------------------------------------------------------------- */
  utils.toast = function (message, type) {
    var container = utils.$(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      container.setAttribute("aria-live", "polite");
      document.body.appendChild(container);
    }
    var toastEl = document.createElement("div");
    var iconName = type === "success" ? "check-circle" : type === "danger" ? "alert-circle" : "bell";
    toastEl.className = "toast" + (type ? " toast--" + type : "");
    toastEl.innerHTML = IRC.icons.icon(iconName) + "<span>" + utils.escapeHtml(message) + "</span>";
    container.appendChild(toastEl);
    setTimeout(function () {
      toastEl.style.transition = "opacity .3s ease, transform .3s ease";
      toastEl.style.opacity = "0";
      toastEl.style.transform = "translateX(24px)";
      setTimeout(function () { toastEl.remove(); }, 320);
    }, 3800);
  };

  /* ---- Sitewide placeholder-link handler ------------------------------------
     Any <a href="#"> (exact match) is a deliberate demo placeholder — real
     registration links, resource files, and social profiles aren't live yet.
     Intercept with a friendly toast instead of a dead jump-to-top link.
     Real in-page anchors (#opportunity-radar, #join, ...) are untouched. */
  document.addEventListener("click", function (e) {
    var link = e.target.closest ? e.target.closest('a[href="#"]') : null;
    if (link && !link.hasAttribute("data-no-demo-toast")) {
      e.preventDefault();
      utils.toast("This is a demo link — real content will be added soon.", "info");
    }
  });

  /* ---- Form validation helpers ----------------------------------------------- */
  utils.validators = {
    required: function (v) { return String(v || "").trim().length > 0; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim()); },
    minLength: function (v, n) { return String(v || "").trim().length >= n; }
  };

  utils.validateForm = function (form, rules) {
    var valid = true;
    var firstInvalidField = null;
    Object.keys(rules).forEach(function (fieldName) {
      var field = form.elements[fieldName];
      if (!field) return;
      var wrap = field.closest(".form-field");
      var fieldRules = rules[fieldName];
      var fieldValid = fieldRules.every(function (rule) { return rule.test(field.value); });
      if (wrap) wrap.classList.toggle("has-error", !fieldValid);
      field.setAttribute("aria-invalid", fieldValid ? "false" : "true");
      if (!fieldValid) {
        valid = false;
        if (!firstInvalidField) firstInvalidField = field;
      }
    });
    if (firstInvalidField) firstInvalidField.focus();
    return valid;
  };

  window.IRC.utils = utils;
})();
