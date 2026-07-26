/* ==========================================================================
   Shared Opportunity Radar component — mounted on BOTH index.html (Home)
   and research-engagement.html so there is exactly one implementation and
   one data source (js/data/opportunities.js) behind both.
   ========================================================================== */
(function () {
  window.IRC = window.IRC || {};
  var utils = IRC.utils;

  var FILTER_TAGS = ["All", "AI", "Business", "Data Science", "Research", "Innovation", "Entrepreneurship", "Design"];

  function renderCard(o) {
    var status = utils.getOpportunityStatus(o.deadline);
    var initials = utils.getInitials(o.organizer);
    var tagBadges = o.tags.map(function (t) { return '<span class="badge badge--neutral">' + t + "</span>"; }).join("");
    return (
      '<article class="opp-card card" data-tags="' + o.tags.join(",") + '" data-type="' + o.type + '" data-status="' + status.status + '" id="' + o.id + '">' +
        '<div class="opp-card__top">' +
          '<span class="badge badge--outline">' + o.type + "</span>" +
          '<span class="badge ' + status.badgeClass + '">' + status.label + "</span>" +
        "</div>" +
        '<div class="opp-card__org">' +
          '<span class="avatar-initials opp-card__mark" style="' + utils.monogramStyle(o.organizer) + '">' + initials + "</span>" +
          "<div>" +
            '<h3 class="opp-card__title">' + utils.escapeHtml(o.title) + "</h3>" +
            '<p class="opp-card__organizer">' + utils.escapeHtml(o.organizer) + "</p>" +
          "</div>" +
        "</div>" +
        '<p class="opp-card__desc">' + utils.escapeHtml(o.description) + "</p>" +
        '<div class="opp-card__tags">' + tagBadges + "</div>" +
        '<div class="opp-card__meta-grid">' +
          "<div><span>Eligibility</span><strong>" + utils.escapeHtml(o.eligibility) + "</strong></div>" +
          "<div><span>Difficulty</span><strong>" + o.difficulty + "</strong></div>" +
          "<div><span>Prize Pool</span><strong>" + utils.escapeHtml(o.prizePool) + "</strong></div>" +
          "<div><span>Team Size</span><strong>" + (o.teamSize.min === o.teamSize.max ? o.teamSize.min : o.teamSize.min + "–" + o.teamSize.max) + " " + (o.teamSize.max === 1 ? "person" : "people") + "</strong></div>" +
        "</div>" +
        '<div class="opp-card__countdown-wrap">' +
          '<span class="opp-card__deadline-label">Deadline: ' + utils.formatDate(o.deadline) + "</span>" +
          '<div class="countdown" data-countdown data-deadline="' + o.deadline + '"></div>' +
        "</div>" +
        '<a href="' + o.registerUrl + '" class="btn btn--primary btn--block opp-card__register">Register Now' + IRC.icons.icon("arrow-right") + "</a>" +
      "</article>"
    );
  }

  function mount(containerSelector, opts) {
    var root = utils.$(containerSelector);
    if (!root) return;
    var options = opts || {};
    var data = (IRC.store ? IRC.store.getCollection("opportunities") : IRC.data.opportunities).slice();

    // soonest deadline first; already-closed items sink to the bottom
    data.sort(function (a, b) {
      var sa = utils.getOpportunityStatus(a.deadline).status === "closed" ? 1 : 0;
      var sb = utils.getOpportunityStatus(b.deadline).status === "closed" ? 1 : 0;
      if (sa !== sb) return sa - sb;
      return new Date(a.deadline) - new Date(b.deadline);
    });

    var toolbarHtml = options.showFilters === false ? "" :
      '<div class="opp-radar-toolbar">' +
        '<div class="tag-filter-group" role="group" aria-label="Filter opportunities by category">' +
          FILTER_TAGS.map(function (tag, i) {
            return '<button type="button" class="tag-filter' + (i === 0 ? " is-active" : "") + '" data-filter-tag="' + tag + '">' + tag + "</button>";
          }).join("") +
        "</div>" +
        '<span class="opp-radar-count" data-radar-count></span>' +
      "</div>";

    root.innerHTML = toolbarHtml + '<div class="opp-card-grid" data-radar-grid></div>';

    var grid = utils.$("[data-radar-grid]", root);
    var countLabel = utils.$("[data-radar-count]", root);

    function renderGrid(filterTag) {
      var filtered = !filterTag || filterTag === "All" ? data : data.filter(function (o) { return o.tags.indexOf(filterTag) > -1; });
      var limited = options.limit ? filtered.slice(0, options.limit) : filtered;
      if (!limited.length) {
        grid.classList.add("is-empty");
        grid.innerHTML = '<div class="opp-empty-state">' + IRC.icons.icon("filter") + "<p>No opportunities match this filter yet — check back soon.</p></div>";
      } else {
        grid.classList.remove("is-empty");
        grid.innerHTML = limited.map(renderCard).join("");
        utils.$$("[data-countdown]", grid).forEach(function (el) {
          utils.mountCountdown(el, el.getAttribute("data-deadline"));
        });
      }
      if (countLabel) countLabel.textContent = filtered.length + (filtered.length === 1 ? " opportunity" : " opportunities") + (options.limit && filtered.length > options.limit ? " · showing " + limited.length : "");
      utils.mountScrollReveal(grid);
    }

    if (options.showFilters !== false) {
      utils.$$(".tag-filter", root).forEach(function (btn) {
        btn.addEventListener("click", function () {
          utils.$$(".tag-filter", root).forEach(function (b) { b.classList.remove("is-active"); });
          btn.classList.add("is-active");
          renderGrid(btn.getAttribute("data-filter-tag"));
        });
      });
    }

    renderGrid("All");
  }

  window.IRC.ui = window.IRC.ui || {};
  window.IRC.ui.mountOpportunityRadar = mount;
})();
