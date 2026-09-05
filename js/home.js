(function () {
  "use strict";

  var form = document.getElementById("fitment-form");
  var categoryInput = document.getElementById("category-input");
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

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      setCategory(tab.getAttribute("data-category") || "wheels");
    });
  });

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var params = new URLSearchParams();
      var category = categoryInput ? categoryInput.value : "wheels";
      var make = document.getElementById("make");
      var model = document.getElementById("model");
      var year = document.getElementById("year");

      params.set("category", category);
      if (make && make.value) params.set("make", make.value);
      if (model && model.value) params.set("model", model.value);
      if (year && year.value) params.set("year", year.value);

      // Deep-link into existing Shop Floor finder — no invented fitment data.
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
      var make = document.getElementById("make");
      if (make) make.focus();
    });
  }
})();
