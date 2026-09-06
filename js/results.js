(function () {
  "use strict";

  var DATA_URL = "./data/fitments.json";
  var lib = window.KeiFitLib;

  var els = {
    form: document.getElementById("filters-form"),
    list: document.getElementById("results-list"),
    exampleList: document.getElementById("example-list"),
    count: document.getElementById("results-count"),
    range: document.getElementById("results-range"),
    empty: document.getElementById("empty-state"),
    error: document.getElementById("load-error"),
    sort: document.getElementById("sort-by"),
    diameter: document.getElementById("filter-diameter"),
    offset: document.getElementById("filter-offset"),
    tyreSearch: document.getElementById("filter-tyre-search"),
    reset: document.getElementById("filter-reset"),
    rail: document.getElementById("filter-rail"),
    mobileToggle: document.getElementById("mobile-filter-toggle"),
    backdrop: document.getElementById("filter-backdrop"),
    menuToggle: document.getElementById("menu-toggle"),
    mobileMenu: document.getElementById("mobile-menu"),
    searchToggle: document.getElementById("search-toggle"),
  };

  var publicFitments = [];
  var activeTyrePill = "";

  var EXAMPLE_ROWS = [
    {
      id: "example-kf-ex-014",
      demo: true,
      wheelDiameterIn: 13,
      wheelWidthIn: 5.0,
      offsetMm: 35,
      tyreSize: "165/55R13",
      suspension: "Stock",
      rubbing: "none",
      rubbingLabel: "No rubbing",
      rubbingNote: "Example clearance note only — not a field measurement.",
      modifications: "None stated (Example)",
      evidenceConfidence: "Confirmed",
      wheelModel: "RAYS TE37 KCR · Example",
      pcd: "4×100",
      hubBoreMm: null,
      hubBoreStatus: "unknown",
      ownerReports: 3,
      photos: 2,
    },
    {
      id: "example-kf-ex-031",
      demo: true,
      wheelDiameterIn: 15,
      wheelWidthIn: 6.0,
      offsetMm: 28,
      tyreSize: "175/55R15",
      suspension: "Stock",
      rubbing: "minor",
      rubbingLabel: "Minor rubbing",
      rubbingNote: "Example: slight rubbing on full lock (front).",
      modifications: "None stated (Example)",
      evidenceConfidence: "Reported",
      wheelModel: "Enkei RPF1 · Example",
      pcd: "4×100",
      hubBoreMm: null,
      hubBoreStatus: "unknown",
      ownerReports: 5,
      photos: 4,
    },
    {
      id: "example-kf-ex-088",
      demo: true,
      wheelDiameterIn: 16,
      wheelWidthIn: 6.5,
      offsetMm: 20,
      tyreSize: "195/45R16",
      suspension: "Lowered",
      rubbing: "mods",
      rubbingLabel: "Requires modification",
      rubbingNote: "Example: strut & guard contact without mods.",
      modifications: "Guard roll / spacer (Example)",
      evidenceConfidence: "Unverified",
      wheelModel: "Work Equip 01 · Example",
      pcd: "4×100",
      hubBoreMm: null,
      hubBoreStatus: "unknown",
      ownerReports: 1,
      photos: 0,
    },
    {
      id: "example-kf-ex-cand-004",
      demo: true,
      wheelDiameterIn: 14,
      wheelWidthIn: 5.0,
      offsetMm: 40,
      tyreSize: "155/65R14",
      suspension: "Stock",
      rubbing: "unknown",
      rubbingLabel: "Clearance incomplete",
      rubbingNote: "Example candidate — hub centre bore unresolved.",
      modifications: "Unknown",
      evidenceConfidence: "Manufacturer specification",
      wheelModel: "OEM-style steel · Example",
      pcd: "4×100",
      hubBoreMm: null,
      hubBoreStatus: "unresolved",
      ownerReports: 0,
      photos: 0,
    },
  ];

  function checkedValues(name) {
    return Array.prototype.slice
      .call(document.querySelectorAll('input[name="' + name + '"]:checked'))
      .map(function (el) {
        return el.value;
      });
  }

  function offsetInRange(mm, key) {
    if (mm === null || mm === undefined || mm === "") return false;
    var n = Number(mm);
    if (key === "-20-0") return n >= -20 && n <= 0;
    if (key === "1-20") return n >= 1 && n <= 20;
    if (key === "21-40") return n >= 21 && n <= 40;
    if (key === "41+") return n >= 41;
    return true;
  }

  function rubbingBucket(row) {
    var raw = String(row.rubbing || "").toLowerCase();
    if (raw === "none" || raw.indexOf("no rub") !== -1 || raw === "clear") return "none";
    if (raw === "minor" || raw.indexOf("minor") !== -1 || raw.indexOf("slight") !== -1) return "minor";
    if (raw === "mods" || raw.indexOf("mod") !== -1 || raw.indexOf("fail") !== -1) return "mods";
    return "unknown";
  }

  function matchesExtended(row, f) {
    if (f.suspensions.length && f.suspensions.indexOf(String(row.suspension || "Unknown")) === -1) {
      return false;
    }
    if (f.diameters.length && f.diameters.indexOf(String(row.wheelDiameterIn)) === -1) {
      return false;
    }
    if (f.diameterSelect !== "all" && String(row.wheelDiameterIn) !== f.diameterSelect) {
      return false;
    }
    if (f.offsets.length) {
      var okOff = f.offsets.some(function (k) {
        return offsetInRange(row.offsetMm, k);
      });
      if (!okOff) return false;
    }
    if (f.offsetSelect !== "all" && !offsetInRange(row.offsetMm, f.offsetSelect)) {
      return false;
    }
    if (f.rubbings.length && f.rubbings.indexOf(rubbingBucket(row)) === -1) {
      return false;
    }
    if (f.tyre) {
      var needle = f.tyre.toLowerCase();
      if (String(row.tyreSize || "").toLowerCase().indexOf(needle) === -1) return false;
    }
    return true;
  }

  function currentFilters() {
    var suspensions = checkedValues("suspension");
    var diameters = checkedValues("diameterChip");
    var offsets = checkedValues("offsetChip");
    var rubbings = checkedValues("rubbing");
    var tyre = (els.tyreSearch && els.tyreSearch.value.trim()) || activeTyrePill || "";
    return {
      suspensions: suspensions,
      diameters: diameters,
      diameterSelect: els.diameter ? els.diameter.value : "all",
      offsets: offsets,
      offsetSelect: els.offset ? els.offset.value : "all",
      rubbings: rubbings,
      tyre: tyre,
    };
  }

  function evidenceClass(level) {
    switch (String(level || "").trim()) {
      case "Confirmed":
        return "confirmed";
      case "Reported":
        return "reported";
      case "Manufacturer specification":
      case "Manufacturer Spec":
        return "mfr";
      default:
        return "unverified";
    }
  }

  function evidenceLabel(level) {
    var s = String(level || "Unverified");
    if (s === "Manufacturer specification") return "Manufacturer Spec";
    return s;
  }

  function formatWheel(row) {
    var d = row.wheelDiameterIn;
    var w = row.wheelWidthIn;
    var width = w == null ? "—" : Number(w).toFixed(1).replace(/\.0$/, ".0");
    return d + '" × ' + width + "J";
  }

  function formatOffset(mm) {
    if (mm === null || mm === undefined || mm === "") return "Unknown";
    var n = Number(mm);
    return (n > 0 ? "+" : "") + n;
  }

  function cardHtml(row, isExample) {
    var evidence = evidenceLabel(row.evidenceConfidence);
    var eClass = evidenceClass(row.evidenceConfidence);
    var rub = rubbingBucket(row);
    var rubLabel = row.rubbingLabel || (
      rub === "none" ? "No rubbing" :
      rub === "minor" ? "Minor rubbing" :
      rub === "mods" ? "Requires modification" : "Clearance unknown"
    );
    var rubNote = row.rubbingNote || row.modifications || row.notes || "—";
    var hubUnknown =
      row.hubBoreMm == null ||
      ["unknown", "unresolved"].indexOf(String(row.hubBoreStatus || "unknown").toLowerCase()) !== -1;
    var detailHref = "detail.html?id=" + encodeURIComponent(row.id || "");
    if (isExample) detailHref += "&demo=1";

    return (
      '<article class="fitment-card' + (isExample ? " is-example" : "") + '">' +
        '<div class="fitment-card__media" aria-hidden="true">' +
          '<span class="evidence-badge ' + eClass + '">' + lib.escapeHtml(evidence) + "</span>" +
          '<div class="fitment-card__media-placeholder">' +
            (isExample ? "Example photo" : "No photo") +
          "</div>" +
        "</div>" +
        '<div class="fitment-card__body">' +
          (isExample ? '<span class="fitment-card__demo-tag">Example / Demo</span>' : "") +
          '<h3 class="fitment-card__wheel">' + lib.escapeHtml(formatWheel(row)) + "</h3>" +
          '<p class="fitment-card__model">' + lib.escapeHtml(row.wheelModel || "Wheel model not stated") + "</p>" +
          '<dl class="fitment-card__specs">' +
            "<div><dt>Offset (ET)</dt><dd>" + lib.escapeHtml(formatOffset(row.offsetMm)) + "</dd></div>" +
            "<div><dt>Tyre Size</dt><dd>" + lib.escapeHtml(row.tyreSize || "—") + "</dd></div>" +
            "<div><dt>Suspension</dt><dd>" + lib.escapeHtml(row.suspension || "Unknown") + "</dd></div>" +
          "</dl>" +
          '<div class="fitment-card__meta">' +
            "<span>Owner reports: " + lib.escapeHtml(String(row.ownerReports != null ? row.ownerReports : "—")) + "</span>" +
            "<span>Photos: " + lib.escapeHtml(String(row.photos != null ? row.photos : "—")) + "</span>" +
            "<span>PCD: " + lib.escapeHtml(row.pcd || "—") + "</span>" +
          "</div>" +
          (hubUnknown
            ? '<p class="hub-summary">Hub unknown (summary) · centre bore unresolved — PCD shown independently</p>'
            : '<p class="hub-summary">Centre bore ' + lib.escapeHtml(lib.hubLabel(row)) + "</p>") +
        "</div>" +
        '<div class="fitment-card__status">' +
          '<div class="rubbing-line">' +
            '<span class="rubbing-dot ' + rub + '" aria-hidden="true"></span>' +
            "<div>" +
              '<p class="rubbing-title">' + lib.escapeHtml(rubLabel) + "</p>" +
              '<p class="rubbing-copy">' + lib.escapeHtml(rubNote) + "</p>" +
            "</div>" +
          "</div>" +
          '<div class="card-actions">' +
            '<a class="view-fitment" href="' + detailHref + '">View Fitment →</a>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function evidenceRank(level) {
    switch (String(level || "").trim()) {
      case "Confirmed": return 0;
      case "Reported": return 1;
      case "Manufacturer specification":
      case "Manufacturer Spec": return 2;
      default: return 3;
    }
  }

  function sortRows(rows, mode) {
    var copy = rows.slice();
    copy.sort(function (a, b) {
      if (mode === "diameter-asc") return Number(a.wheelDiameterIn) - Number(b.wheelDiameterIn);
      if (mode === "diameter-desc") return Number(b.wheelDiameterIn) - Number(a.wheelDiameterIn);
      if (mode === "offset-asc") return Number(a.offsetMm || 0) - Number(b.offsetMm || 0);
      if (mode === "offset-desc") return Number(b.offsetMm || 0) - Number(a.offsetMm || 0);
      if (mode === "evidence") return evidenceRank(a.evidenceConfidence) - evidenceRank(b.evidenceConfidence);
      return evidenceRank(a.evidenceConfidence) - evidenceRank(b.evidenceConfidence);
    });
    return copy;
  }

  function updateCounts(rows) {
    var keys = {
      "suspension:Stock": 0,
      "suspension:Lifted": 0,
      "suspension:Lowered": 0,
      "suspension:Unknown": 0,
      "diameter:12": 0,
      "diameter:13": 0,
      "diameter:14": 0,
      "diameter:15": 0,
      "diameter:16": 0,
      "rubbing:none": 0,
      "rubbing:minor": 0,
      "rubbing:mods": 0,
    };
    rows.forEach(function (row) {
      var sus = String(row.suspension || "Unknown");
      if (keys["suspension:" + sus] != null) keys["suspension:" + sus] += 1;
      var d = String(row.wheelDiameterIn);
      if (keys["diameter:" + d] != null) keys["diameter:" + d] += 1;
      var r = rubbingBucket(row);
      if (keys["rubbing:" + r] != null) keys["rubbing:" + r] += 1;
    });
    Object.keys(keys).forEach(function (k) {
      document.querySelectorAll('[data-count-for="' + k + '"]').forEach(function (el) {
        el.textContent = String(keys[k]);
      });
    });
  }

  function render() {
    var f = currentFilters();
    var mode = els.sort ? els.sort.value : "relevance";
    var filtered = sortRows(
      publicFitments.filter(function (row) {
        return matchesExtended(row, f);
      }),
      mode
    );

    els.count.textContent =
      filtered.length + " Fitment Result" + (filtered.length === 1 ? "" : "s");
    els.range.textContent =
      filtered.length === 0
        ? "Showing 0 public results"
        : "Showing 1–" + filtered.length + " of " + filtered.length + " public results";

    if (filtered.length) {
      els.list.hidden = false;
      els.empty.hidden = true;
      els.list.innerHTML = filtered
        .map(function (row) {
          return cardHtml(row, false);
        })
        .join("");
    } else {
      els.list.hidden = true;
      els.list.innerHTML = "";
      els.empty.hidden = false;
    }

    // Example / Demo gallery stays unfiltered so all demo card/evidence states
    // remain visible on initial load (Stock rail filter must not hide Lowered/etc.).
    var exampleFiltered = sortRows(EXAMPLE_ROWS.slice(), mode);
    els.exampleList.innerHTML = exampleFiltered
      .map(function (row) {
        return cardHtml(row, true);
      })
      .join("");
  }

  function setDrawer(open) {
    if (!els.rail || !els.mobileToggle) return;
    els.rail.classList.toggle("is-open", open);
    if (els.backdrop) {
      if (open) {
        els.backdrop.hidden = false;
        els.backdrop.classList.add("is-open");
      } else {
        els.backdrop.classList.remove("is-open");
        els.backdrop.hidden = true;
      }
    }
    els.mobileToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function bindNav() {
    if (els.menuToggle && els.mobileMenu) {
      els.menuToggle.addEventListener("click", function () {
        var open = els.mobileMenu.hasAttribute("hidden");
        if (open) els.mobileMenu.removeAttribute("hidden");
        else els.mobileMenu.setAttribute("hidden", "");
        els.menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    if (els.searchToggle) {
      els.searchToggle.addEventListener("click", function () {
        if (els.tyreSearch) {
          setDrawer(true);
          els.tyreSearch.focus();
        }
      });
    }
    if (els.mobileToggle) {
      els.mobileToggle.addEventListener("click", function () {
        var open = !els.rail.classList.contains("is-open");
        setDrawer(open);
      });
    }
    if (els.backdrop) {
      els.backdrop.addEventListener("click", function () {
        setDrawer(false);
      });
    }
  }

  function bindFilters() {
    if (els.form) {
      els.form.addEventListener("submit", function (event) {
        event.preventDefault();
        render();
        setDrawer(false);
      });
    }
    if (els.reset) {
      els.reset.addEventListener("click", function () {
        if (els.form) els.form.reset();
        activeTyrePill = "";
        document.querySelectorAll(".tyre-pill").forEach(function (btn) {
          btn.classList.remove("is-active");
        });
        if (els.diameter) els.diameter.value = "all";
        if (els.offset) els.offset.value = "all";
        if (els.tyreSearch) els.tyreSearch.value = "";
        render();
      });
    }
    if (els.sort) els.sort.addEventListener("change", render);
    if (els.diameter) els.diameter.addEventListener("change", render);
    if (els.offset) els.offset.addEventListener("change", render);
    if (els.tyreSearch) {
      els.tyreSearch.addEventListener("input", function () {
        activeTyrePill = "";
        document.querySelectorAll(".tyre-pill").forEach(function (btn) {
          btn.classList.remove("is-active");
        });
        render();
      });
    }
    document.querySelectorAll(".tyre-pill").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tyre = btn.getAttribute("data-tyre") || "";
        if (activeTyrePill === tyre) {
          activeTyrePill = "";
          btn.classList.remove("is-active");
          if (els.tyreSearch) els.tyreSearch.value = "";
        } else {
          activeTyrePill = tyre;
          document.querySelectorAll(".tyre-pill").forEach(function (b) {
            b.classList.remove("is-active");
          });
          btn.classList.add("is-active");
          if (els.tyreSearch) els.tyreSearch.value = tyre;
        }
        render();
      });
    });
    document.querySelectorAll("#filters-form input[type=checkbox]").forEach(function (el) {
      el.addEventListener("change", render);
    });
  }

  async function init() {
    bindNav();
    bindFilters();
    updateCounts([]);
    render();

    try {
      var res = await fetch(DATA_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      var data = await res.json();
      publicFitments = lib.publicFitments(data.fitments);
      updateCounts(publicFitments);
      render();
    } catch (err) {
      console.error(err);
      if (els.error) els.error.hidden = false;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
