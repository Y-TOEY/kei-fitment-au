(function () {
  "use strict";

  var catalog = window.KeiFitVehicleCatalog;
  var form = document.getElementById("fitment-form");
  var categoryInput = document.getElementById("category-input");
  var makeEl = document.getElementById("make");
  var modelEl = document.getElementById("model");
  var yearEl = document.getElementById("year");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".finder__tab"));
  var menuToggle = document.getElementById("menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  var searchToggle = document.getElementById("search-toggle");

  function setCategory(category) {
    if (categoryInput) categoryInput.value = category;
    tabs.forEach(function (tab) {
      var active = tab.getAttribute("data-category") === category;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

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

  function onMakeChange() {
    var make = makeEl ? makeEl.value : "";
    populateModels(make, "");
  }

  function applyQueryDefaults() {
    var params = new URLSearchParams(window.location.search);
    var make = params.get("make") || "";
    var model = params.get("model") || "";
    var year = params.get("year") || "";
    var category = params.get("category") || "";

    if (category) setCategory(category);
    if (makeEl && make) {
      makeEl.value = make;
    }
    populateModels(makeEl ? makeEl.value : "", model);
    if (yearEl && year) {
      yearEl.value = year;
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      setCategory(tab.getAttribute("data-category") || "wheels");
    });
  });

  if (makeEl) {
    makeEl.addEventListener("change", onMakeChange);
  }

  populateModels("", "");
  applyQueryDefaults();

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var params = new URLSearchParams();
      var category = categoryInput ? categoryInput.value : "wheels";
      var make = makeEl ? makeEl.value : "";
      var model = modelEl ? modelEl.value : "";
      var year = yearEl ? yearEl.value : "";

      if (make && model && catalog && !catalog.isModelForMake(make, model)) {
        model = "";
        if (modelEl) modelEl.value = "";
      }

      params.set("category", category);
      if (make) params.set("make", make);
      if (model) params.set("model", model);
      if (year) params.set("year", year);

      var qs = params.toString();
      window.location.href = "filters.html" + (qs ? "?" + qs : "");
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
      var finder = document.getElementById("finder");
      if (finder) finder.scrollIntoView({ behavior: "smooth", block: "center" });
      if (makeEl) makeEl.focus();
    });
  }
})();
