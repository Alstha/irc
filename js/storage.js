/* ==========================================================================
   Demo persistence layer for the Admin Dashboard.
   Public pages AND admin.html both read through IRC.store.getCollection(),
   which checks localStorage first and falls back to seeding from the
   matching js/data/*.js file. Editing something in admin.html therefore
   really does show up on the public pages — but only in that same browser,
   since localStorage is per-browser, not a shared backend. Every key is
   prefixed (irc_*) because Chrome treats all file:// pages as one storage
   origin. A SCHEMA_VERSION mismatch triggers a full re-seed rather than a
   migration — predictable beats clever for a demo-grade store.
   ========================================================================== */
(function () {
  window.IRC = window.IRC || {};

  var PREFIX = "irc_";
  var SCHEMA_VERSION = 1;
  var LOGIN_FLAG = "irc_admin_session"; // sessionStorage, not localStorage — see auth notes in admin.js

  // The 8 entities the Admin Dashboard demo can create/edit/delete.
  // Each maps 1:1 to a js/data/*.js seed array of the same shape.
  var COLLECTIONS = {
    opportunities: "opportunities",
    announcements: "announcements",
    magazines: "magazines",
    events: "events",
    mentors: "mentors",
    stories: "stories",
    team: "team",
    teamRegistrations: "teamRegistrations" // user-submitted only — no seed file, lives purely in localStorage
  };

  function storageKey(name) {
    return PREFIX + name;
  }

  function seedFor(name) {
    var seed = window.IRC.data && window.IRC.data[name];
    return Array.isArray(seed) ? seed.slice() : [];
  }

  function isStorageAvailable() {
    try {
      var t = "__irc_test__";
      localStorage.setItem(t, "1");
      localStorage.removeItem(t);
      return true;
    } catch (e) {
      return false;
    }
  }

  var STORAGE_OK = isStorageAvailable();

  function getCollection(name) {
    if (!STORAGE_OK) return seedFor(name);
    var raw = localStorage.getItem(storageKey(name));
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.v === SCHEMA_VERSION && Array.isArray(parsed.items)) {
          return parsed.items;
        }
      } catch (e) {
        /* corrupted — fall through and reseed */
      }
    }
    var seeded = seedFor(name);
    saveCollection(name, seeded);
    return seeded;
  }

  function saveCollection(name, items) {
    if (!STORAGE_OK) return items;
    localStorage.setItem(
      storageKey(name),
      JSON.stringify({ v: SCHEMA_VERSION, items: items, updatedAt: new Date().toISOString() })
    );
    return items;
  }

  function resetCollection(name) {
    if (STORAGE_OK) localStorage.removeItem(storageKey(name));
    return getCollection(name);
  }

  function resetAll() {
    Object.keys(COLLECTIONS).forEach(function (name) {
      if (STORAGE_OK) localStorage.removeItem(storageKey(name));
    });
  }

  function isDirty(name) {
    return STORAGE_OK && !!localStorage.getItem(storageKey(name));
  }

  function addItem(name, item) {
    var items = getCollection(name);
    items.unshift(item);
    saveCollection(name, items);
    return items;
  }

  function updateItem(name, id, patch) {
    var items = getCollection(name);
    var idx = -1;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) { idx = i; break; }
    }
    if (idx > -1) {
      var merged = {};
      var k;
      for (k in items[idx]) if (Object.prototype.hasOwnProperty.call(items[idx], k)) merged[k] = items[idx][k];
      for (k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) merged[k] = patch[k];
      items[idx] = merged;
      saveCollection(name, items);
    }
    return items;
  }

  function removeItem(name, id) {
    var items = getCollection(name).filter(function (i) { return i.id !== id; });
    saveCollection(name, items);
    return items;
  }

  window.IRC.store = {
    isAvailable: STORAGE_OK,
    KEY_PREFIX: PREFIX,
    LOGIN_FLAG: LOGIN_FLAG,
    collections: COLLECTIONS,
    getCollection: getCollection,
    saveCollection: saveCollection,
    resetCollection: resetCollection,
    resetAll: resetAll,
    isDirty: isDirty,
    addItem: addItem,
    updateItem: updateItem,
    removeItem: removeItem
  };
})();
