/* ==========================================================================
   Header/Footer injection — no fetch() (breaks on file://). Renders HTML
   strings from js/data/site-config.js directly into #site-header /
   #site-footer. Called once by main.js on bootstrap.
   ========================================================================== */
(function () {
  window.IRC = window.IRC || {};
  window.IRC.ui = window.IRC.ui || {};

  function renderDropdownChildren(children, activePage) {
    return children
      .map(function (c) {
        var active = c.id === activePage;
        return (
          '<li><a href="' + c.href + '"' + (active ? ' class="is-active" aria-current="page"' : "") + ">" +
          c.label +
          (c.desc ? '<span>' + c.desc + "</span>" : "") +
          "</a></li>"
        );
      })
      .join("");
  }

  function renderNavList(items, activePage) {
    return items
      .map(function (item) {
        if (item.children && item.children.length) {
          var childActive = item.children.some(function (c) { return c.id === activePage; });
          var dropdownId = "dropdown-" + item.id;
          return (
            '<li class="site-nav__item has-dropdown' + (childActive ? " active-parent" : "") + '">' +
            '<button type="button" class="site-nav__link site-nav__link--dropdown" aria-expanded="false" aria-controls="' + dropdownId + '">' +
            item.label +
            IRC.icons.icon("chevron-down") +
            "</button>" +
            '<ul class="site-nav__dropdown" id="' + dropdownId + '">' + renderDropdownChildren(item.children, activePage) + "</ul>" +
            "</li>"
          );
        }
        var isActive = item.id === activePage;
        return (
          '<li class="site-nav__item"><a class="site-nav__link' + (isActive ? " is-active" : "") + '" href="' + item.href + '"' +
          (isActive ? ' aria-current="page"' : "") +
          ">" + item.label + "</a></li>"
        );
      })
      .join("");
  }

  function renderHeader(activePage) {
    var cfg = IRC.data.siteConfig;
    var navHtml = renderNavList(IRC.data.nav, activePage);
    return (
      '<header class="site-header">' +
        '<div class="site-header__inner">' +
          '<a href="index.html" class="site-header__brand" aria-label="' + cfg.siteName + ' — Home">' +
            '<img src="' + cfg.logos.mark + '" alt="' + cfg.siteName + ' logo" class="site-header__logo" width="40" height="40" loading="eager" />' +
            '<span class="site-header__wordmark"><small>Islington</small><strong>Research Community</strong></span>' +
          "</a>" +
          '<nav class="site-nav" id="siteNav" aria-label="Primary">' +
            '<ul class="site-nav__list">' + navHtml + "</ul>" +
          "</nav>" +
          '<div class="site-header__actions">' +
            '<button class="icon-btn" id="searchToggle" type="button" aria-label="Open search" aria-haspopup="dialog">' + IRC.icons.icon("search") + "</button>" +
            '<button class="icon-btn dark-toggle" id="themeToggle" type="button" aria-label="Toggle dark mode">' +
              IRC.icons.icon("moon", "icon-moon") + IRC.icons.icon("sun", "icon-sun") +
            "</button>" +
            '<a href="contact.html#join" class="btn btn--primary btn--sm">Join IRC</a>' +
            '<button class="hamburger" id="navToggle" type="button" aria-label="Toggle menu" aria-expanded="false" aria-controls="siteNav"><span></span></button>' +
          "</div>" +
        "</div>" +
        '<div class="scroll-progress" id="scrollProgress"></div>' +
      "</header>"
    );
  }

  function renderFooter() {
    var cfg = IRC.data.siteConfig;
    var year = new Date().getFullYear();
    var socialLinks = [
      { key: "facebook", label: "Facebook", icon: "facebook" },
      { key: "instagram", label: "Instagram", icon: "instagram" },
      { key: "linkedin", label: "LinkedIn", icon: "linkedin" },
      { key: "youtube", label: "YouTube", icon: "youtube" }
    ]
      .map(function (s) {
        return '<a href="' + cfg.social[s.key] + '" aria-label="' + cfg.siteName + " on " + s.label + '" target="_blank" rel="noopener">' + IRC.icons.icon(s.icon) + "</a>";
      })
      .join("");

    var exploreLinks = ["home", "about", "leadership", "events", "gallery"];
    var researchLinks = ["research-engagement", "research-innovation", "resources", "magazine", "contact"];

    function linksFor(ids) {
      return ids
        .map(function (id) {
          var flat = IRC.data.nav.reduce(function (acc, item) {
            return acc.concat(item.children ? item.children : [item]);
          }, []);
          var match = flat.filter(function (n) { return n.id === id; })[0];
          return match ? '<li><a href="' + match.href + '">' + match.label + "</a></li>" : "";
        })
        .join("");
    }

    return (
      '<footer class="site-footer">' +
        '<div class="site-footer__top">' +
          '<div class="container site-footer__grid">' +
            '<div class="site-footer__brand">' +
              '<img src="' + cfg.logos.lockup + '" alt="' + cfg.siteName + '" class="site-footer__brand-logo" width="60" height="34" loading="lazy" />' +
              '<p class="site-footer__desc">' + cfg.description + "</p>" +
              '<div class="site-footer__social">' + socialLinks + "</div>" +
            "</div>" +
            '<div class="site-footer__col">' +
              '<div class="site-footer__heading">Explore</div>' +
              "<ul>" + linksFor(exploreLinks) + "</ul>" +
            "</div>" +
            '<div class="site-footer__col">' +
              '<div class="site-footer__heading">Research</div>' +
              "<ul>" + linksFor(researchLinks) + "</ul>" +
            "</div>" +
            '<div class="site-footer__col">' +
              '<div class="site-footer__heading">Contact</div>' +
              '<div class="flex-col gap-3">' +
                '<div class="site-footer__contact-item">' + IRC.icons.icon("map-pin") + "<span>" + cfg.address.full + "</span></div>" +
                '<div class="site-footer__contact-item">' + IRC.icons.icon("mail") + '<a href="mailto:' + cfg.email + '">' + cfg.email + "</a></div>" +
                '<div class="site-footer__contact-item">' + IRC.icons.icon("phone") + '<a href="tel:' + cfg.phone + '">' + cfg.phone + "</a></div>" +
              "</div>" +
            "</div>" +
            '<div class="site-footer__col site-footer__newsletter">' +
              '<div class="site-footer__heading">Stay Updated</div>' +
              "<p>Get opportunity alerts and magazine releases in your inbox.</p>" +
              '<form class="newsletter-form" data-newsletter-form novalidate>' +
                '<label class="sr-only" for="footerNewsletterEmail">Email address</label>' +
                '<input type="email" id="footerNewsletterEmail" required placeholder="you@example.com" autocomplete="email" />' +
                '<button class="btn btn--primary btn--sm" type="submit" aria-label="Subscribe">' + IRC.icons.icon("send") + "</button>" +
              "</form>" +
            "</div>" +
          "</div>" +
        "</div>" +
        '<div class="site-footer__bottom container">' +
          "<p>© " + year + " " + cfg.siteName + " (IRC). A student-led wing under the R&D Department, " + cfg.college + ".</p>" +
          '<div class="site-footer__bottom-links">' +
            '<a href="admin.html">Admin</a>' +
            '<a href="resources.html">Resources</a>' +
            '<a href="contact.html">Support</a>' +
          "</div>" +
        "</div>" +
      "</footer>"
    );
  }

  window.IRC.ui.renderHeader = renderHeader;
  window.IRC.ui.renderFooter = renderFooter;
})();
