(function () {
  "use strict";
  async function boot() {
    try {
      var texts = await Promise.all(
        [0, 1, 2].map(function (i) {
          return fetch("./js/detail-part-" + i + ".b64").then(function (r) {
            if (!r.ok) throw new Error("missing part " + i);
            return r.text();
          });
        })
      );
      // Install payload part scripts (populate __KEIFIT_DETAIL_PARTS)
      texts.forEach(function (t) {
        var s = document.createElement("script");
        s.text = atob(t.replace(/\s+/g, ""));
        document.head.appendChild(s);
      });
      var parts = window.__KEIFIT_DETAIL_PARTS || [];
      if (parts.length < 3 || parts.some(function (p) { return typeof p !== "string"; })) {
        throw new Error("Detail parts incomplete");
      }
      var code = parts.join("");
      var s2 = document.createElement("script");
      s2.text = code;
      document.head.appendChild(s2);
    } catch (e) {
      console.error("Detail boot failed", e);
      var root = document.getElementById("detail-root");
      if (root) {
        root.innerHTML =
          '<p class="detail-loading">Unable to load fitment detail script.</p>';
      }
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
