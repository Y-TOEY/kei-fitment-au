(function () {
  "use strict";

  var catalog = window.KeiFitVehicleCatalog;
  var categoryInput = document.getElementById("category-input");
  var makeEl = document.getElementById("make");
  var modelEl = document.getElementById("model");
  var yearEl = document.getElementById("year");
  var tyreEl = document.getElementById("tyre-size");
  var continueCta = document.getElementById("continue-cta");
  var vehicleSummary = document.getElementById("vehicle-summary");
  var menuToggle = document.getElementById("menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  var searchToggle = document.getElementById("search-toggle");

  var state = {
    category: "wheels",
    suspension: "Stock",
    wheel: "15",
    evidence: "all",
    tyre: "",
  };

  function clearSelect(select, placeholder, disabled) {
    if (!select) return;
    select.innerHTML = "";
    var opt = document.createElement("option");
    opt.value = "";
    opt.textContent = placeholder;
    select.appendChild(opt);
    select.value = "";
    select.disabled = !!disabled;
    select.setAttribute("aria-disabled", disabled ? "true" : "false");
  }

  function populateMakes(preferred) {
    if (!makeEl || !catalog) return;
    clearSelect(makeEl, "Make", false);
    catalog.MAKES.forEach(function (m) {
      var opt = document.createElement("option");
      opt.value = m.value;
      opt.textContent = m.label;
      makeEl.appendChild(opt);
    });
    if (preferred) makeEl.value = preferred;
  }

  function populateYears(preferred) {
    if (!yearEl || !catalog) return;
    clearSelect(yearEl, "Year", false);
    catalog.YEAR_OPTIONS.forEach(function (y) {
      var opt = document.createElement("option");
      opt.value = y.value;
      opt.textContent = y.label;
      yearEl.appendChild(opt);
    });
    if (preferred) yearEl.value = preferred;
  }

  function populateModels(make, preferredModel) {
    if (!modelEl || !catalog) return;
    if (!make) {
      clearSelect(modelEl, "Select make first", true);
      return;
    }
    var models = catalog.modelsForMake(make);
    clearSelect(modelEl, "Model", false);
    models.forEach(function (m) {
      var opt = document.createElement("option");
      opt.value = m.value;
      opt.textContent = m.label;
      modelEl.appendChild(opt);
    });
    if (preferredModel && catalog.isModelForMake(make, preferredModel)) {
      modelEl.value = preferredModel;
    } else {
      modelEl.value = "";
    }
  }

  function labelFor(list, value) {
    if (!list || !value) return "";
    for (var i = 0; i < list.length; i++) {
      if (list[i].value === value) return list[i].label;
    }
    return value;
  }

  function updateVehicleSummary() {
    if (!vehicleSummary) return;
    var make = makeEl ? makeEl.value : "";
    var model = modelEl ? modelEl.value : "";
    var year = yearEl ? yearEl.value : "";
    var parts = [];
    if (make && catalog) parts.push(labelFor(catalog.MAKES, make));
    if (model && make && catalog) {
      parts.push(labelFor(catalog.modelsForMake(make), model));
    }
    if (year && catalog) parts.push(labelFor(catalog.YEAR_OPTIONS, year));
    vehicleSummary.textContent = parts.length
      ? parts.join(" · ")
      : "Choose make, model and year";
  }

  function setExclusiveSelection(container, selector, value, selectedClass) {
    if (!container) return;
    var nodes = container.querySelectorAll(selector);
    Array.prototype.forEach.call(nodes, function (node) {
      var match = node.getAttribute("data-value") === value;
      node.classList.toggle(selectedClass, match);
      if (node.hasAttribute("aria-checked")) {
        node.setAttribute("aria-checked", match ? "true" : "false");
      }
      if (node.hasAttribute("aria-pressed")) {
        node.setAttribute("aria-pressed", match ? "true" : "false");
      }
    });
  }

  function buildResultsUrl() {
    var params = new URLSearchParams();
    var make = makeEl ? makeEl.value : "";
    var model = modelEl ? modelEl.value : "";
    var year = yearEl ? yearEl.value : "";
    var category = categoryInput ? categoryInput.value : state.category;
    var tyre = tyreEl ? tyreEl.value.trim() : state.tyre;

    if (make && model && catalog && !catalog.isModelForMake(make, model)) {
      model = "";
      if (modelEl) modelEl.value = "";
    }

    if (category) params.set("category", category);
    if (make) params.set("make", make);
    if (model) params.set("model", model);
    if (year) params.set("year", year);
    if (state.suspension) params.set("suspension", state.suspension);
    if (state.wheel) params.set("wheel", state.wheel);
    if (tyre) params.set("tyre", tyre);
    if (state.evidence) params.set("evidence", state.evidence);

    var qs = params.toString();
    return "results.html" + (qs ? "?" + qs : "");
  }

  function syncContinueHref() {
    if (continueCta) continueCta.href = buildResultsUrl();
    updateVehicleSummary();
  }

  function applyQueryDefaults() {
    var params = new URLSearchParams(window.location.search);
    var category = params.get("category") || "wheels";
    var make = params.get("make") || "";
    var model = params.get("model") || "";
    var year = params.get("year") || "";
    var suspension = params.get("suspension") || "Stock";
    var wheel = params.get("wheel") || params.get("diameter") || "15";
    var evidence = params.get("evidence") || "all";
    var tyre = params.get("tyre") || "";

    state.category = category;
    state.suspension = suspension;
    state.wheel = wheel;
    state.evidence = evidence;
    state.tyre = tyre;

    if (categoryInput) categoryInput.value = category;
    populateMakes(make);
    populateModels(makeEl ? makeEl.value : "", model);
    populateYears(year);
    if (tyreEl && tyre) tyreEl.value = tyre;

    setExclusiveSelection(
      document.getElementById("suspension-options"),
      ".option",
      state.suspension,
      "is-selected"
    );
    setExclusiveSelection(
      document.getElementById("wheel-chips"),
      ".chip",
      state.wheel,
      "is-selected"
    );
    setExclusiveSelection(
      document.getElementById("evidence-chips"),
      ".chip",
      state.evidence,
      "is-selected"
    );
    syncContinueHref();
  }

  function onMakeChange() {
    var make = makeEl ? makeEl.value : "";
    populateModels(make, "");
    syncContinueHref();
  }

  function wireExclusiveGroup(containerId, kind) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.addEventListener("click", function (event) {
      var target = event.target.closest("[data-filter]");
      if (!target || !container.contains(target)) return;
      var value = target.getAttribute("data-value") || "";
      if (!value) return;
      if (kind === "suspension") state.suspension = value;
      if (kind === "wheel") state.wheel = value;
      if (kind === "evidence") state.evidence = value;
      setExclusiveSelection(
        container,
        target.classList.contains("option") ? ".option" : ".chip",
        value,
        "is-selected"
      );
      syncContinueHref();
    });
  }

  populateMakes("");
  populateModels("", "");
  populateYears("");
  applyQueryDefaults();

  if (makeEl) makeEl.addEventListener("change", onMakeChange);
  if (modelEl) modelEl.addEventListener("change", syncContinueHref);
  if (yearEl) yearEl.addEventListener("change", syncContinueHref);
  if (tyreEl) {
    tyreEl.addEventListener("input", function () {
      state.tyre = tyreEl.value.trim();
      syncContinueHref();
    });
  }

  wireExclusiveGroup("suspension-options", "suspension");
  wireExclusiveGroup("wheel-chips", "wheel");
  wireExclusiveGroup("evidence-chips", "evidence");

  if (continueCta) {
    continueCta.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = buildResultsUrl();
    });
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      var open = mobileMenu.hasAttribute("hidden");
      if (open) mobileMenu.removeAttribute("hidden");
      else mobileMenu.setAttribute("hidden", "");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  if (searchToggle) {
    searchToggle.addEventListener("click", function () {
      var panel = document.querySelector(".vehicle-panel");
      if (panel) panel.scrollIntoView({ behavior: "smooth", block: "center" });
      if (makeEl) makeEl.focus();
    });
  }
})();
