(function () {
  "use strict";
  var parts = window.__KEIFIT_DETAIL_PARTS || [];
  if (parts.length < 3 || parts.some(function (p) { return typeof p !== "string"; })) {
    console.error("Detail parts missing");
    return;
  }
  var code = parts.join("");
  var s = document.createElement("script");
  s.text = code;
  document.head.appendChild(s);
})();
