! function() {
  "use strict";
  var e = window.KeiFitLib,
    n = [{
      key: "outerGuard",
      label: "Outer guard"
    }, {
      key: "innerGuard",
      label: "Inner guard"
    }, {
      key: "strut",
      label: "Strut / suspension"
    }, {
      key: "brake",
      label: "Brake / caliper"
    }, {
      key: "fullLock",
      label: "Full steering lock"
    }, {
      key: "compression",
      label: "Suspension compression"
    }, {
      key: "loaded",
      label: "Loaded vehicle"
    }],
    t = {
      "verified-clear": "Verified clear",
      "reported-clear": "Reported clear",
      "reported-contact": "Reported contact",
      unknown: "Unknown"
    },
    a = window.KeiFitDetailDemo || {},
    i = a.DEMO_ROWS || [],
    d = a.DEFAULT_DEMO_ID || "example-kf-ex-031";

  function r(e) {
    return new URLSearchParams(window.location.search).get(e)
  }

  function l() {
    var e = new URLSearchParams(window.location.search);
    e.delete("id"), e.delete("demo");
    var n = e.toString();
    return "results.html" + (n ? "?" + n : "")
  }

  function s(n) {
    return e && e.escapeHtml ? e.escapeHtml(n) : String(n).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  }

  function o(e) {
    if (null == e || "" === e) return "Unknown";
    var n = Number(e);
    return Number.isNaN(n) ? "Unknown" : "ET " + (n > 0 ? "+" : "") + n
  }

  function c(e) {
    var n = e.wheelDiameterIn,
      t = e.wheelWidthIn;
    return null == n ? "—" : n + "″ × " + (null == t ? "—" : Number(t).toFixed(1).replace(/\.0$/, ".0")) + "J"
  }

  function u(e) {
    var n = String(e && e.hubBoreStatus || "unknown").toLowerCase();
    return null == (e && e.hubBoreMm) || "unknown" === n || "unresolved" === n
  }

  function p(e) {
    var n = String(e || "Unverified").trim();
    return "Confirmed" === n ? {
      key: "confirmed",
      label: "Confirmed Fitment",
      title: "Confirmed Fitment",
      copy: "Multiple credible sources or sufficiently strong direct evidence support this exact setup."
    } : "Reported" === n ? {
      key: "reported",
      label: "Reported Fitment",
      title: "Reported Fitment",
      copy: "Documented on DA16T, but some operating conditions may still be unverified."
    } : "Manufacturer specification" === n || "Manufacturer Spec" === n || "Manufacturer spec" === n ? {
      key: "mfr",
      label: "Manufacturer Specification",
      title: "Manufacturer Specification",
      copy: "Manufacturer documentation describes this size; real-world clearance may still be unverified."
    } : {
      key: "unverified",
      label: "Unverified Setup",
      title: "Unverified Setup",
      copy: "Insufficient evidence to treat this as a proven fitment."
    }
  }

  function m(e) {
    var t = e && e.clearance || {},
      a = {};
    return n.forEach((function(e) {
      var n, i;
      a[e.key] = (n = t[e.key], "verified-clear" === (i = String(n || "unknown").toLowerCase().replace(/\s+/g, "-")) || "verified" === i ? "verified-clear" : "reported-clear" === i ? "reported-clear" : "reported-contact" === i || "contact" === i ? "reported-contact" : "unknown")
    })), a
  }

  function v(e, n, t) {
    var a = [];
    return n ? (e.relatedIds || []).forEach((function(e) {
      var n = i.find((function(n) {
        return n.id === e
      }));
      n && a.push(n)
    })) : e.related && e.related.length ? a = e.related : t && t.length && (a = t.filter((function(n) {
      return n.id !== e.id
    })).slice(0, 3)), a.slice(0, 3)
  }

  function h(e, a, i) {
    var d = p(e.evidenceConfidence),
      r = d.key;
    a && "confirmed" === d.key && (r = "confirmed-demo");
    var v = s(e.pcd || "—") + (a ? ' <span class="ex-tag">Example</span>' : ""),
      h = u(e),
      f = Array.isArray(e.sources) ? e.sources.length : 0;
    return f || null == e.ownerReports || "—" === e.ownerReports || (f = Number(e.ownerReports) || 0), (a ? '<aside class="example-fence" role="note"><p class="example-fence__banner">⚠ Example / Demo only — not a live fitment claim</p><p class="example-fence__note">This detail is for layout and evidence UX reference. It is isolated from public fitments and must not be read as a Confirmed purchase recommendation.</p></aside>' : "") + '<div class="detail-summary-grid"><section class="detail-panel detail-panel--lift" aria-labelledby="summary-heading"><h2 class="panel-label" id="summary-heading">Fitment summary' + (a ? " · Example" : "") + '</h2><p class="wheel-headline">' + s(c(e)) + " · " + s(o(e.offsetMm)) + '</p><p class="wheel-model">' + s(e.wheelModel || "Wheel model not stated") + '</p><dl class="spec-grid"><div><dt>Wheel size</dt><dd>' + s(null != e.wheelDiameterIn ? e.wheelDiameterIn + "″" : "—") + "</dd></div><div><dt>Wheel width</dt><dd>" + s(null != e.wheelWidthIn ? Number(e.wheelWidthIn).toFixed(1).replace(/\.0$/, ".0") + "J" : "—") + "</dd></div><div><dt>Offset / ET</dt><dd>" + s(o(e.offsetMm)) + "</dd></div><div><dt>Tyre size</dt><dd>" + s(e.tyreSize || "—") + "</dd></div><div><dt>Tyre model</dt><dd>" + s(e.tyreModel || "Not stated") + "</dd></div><div><dt>Suspension</dt><dd>" + s(e.suspension || "Unknown") + "</dd></div><div><dt>Wheel model</dt><dd>" + s(e.wheelModel || "Not stated") + '</dd></div><div><dt>Vehicle variant</dt><dd>Suzuki Carry DA16T</dd></div></dl><dl class="hub-pair"><div class="hub-box"><dt>PCD</dt><dd>' + v + '</dd></div><div class="hub-box' + (h ? " is-unresolved" : "") + '"><dt>Centre bore</dt><dd' + (h ? ' class="is-unresolved"' : "") + ">" + s(function(e) {
      return u(e) ? "Unresolved" : String(e.hubBoreMm) + " mm"
    }(e)) + '</dd></div></dl></section><section class="detail-panel verdict-panel" aria-labelledby="verdict-heading"><h2 class="panel-label" id="verdict-heading">Evidence verdict</h2><span class="verdict-badge ' + r + '">' + s(d.label) + (a ? " · Example" : "") + '</span><h3 class="verdict-title">' + s(d.title) + '</h3><p class="verdict-copy">' + s(d.copy) + '</p><p class="verdict-meta">Primary states only: Confirmed · Reported · Manufacturer Specification · Unverified</p></section></div><section class="detail-panel" aria-labelledby="matrix-heading"><h2 class="panel-label" id="matrix-heading">Quick clearance matrix</h2>' + function(e) {
      var a = m(e);
      return '<dl class="clearance-matrix">' + n.map((function(e) {
        var n = a[e.key];
        return '<div class="clearance-cell"><dt>' + s(e.label) + '</dt><dd><span class="state ' + s(n) + '">' + s(t[n] || "Unknown") + "</span></dd></div>"
      })).join("") + "</dl>"
    }(e) + '<p class="photo-disclaimer">Silence is shown as Unknown — not as clear.</p></section><section class="unknowns-panel" aria-labelledby="unknowns-heading"><h2 class="panel-label" id="unknowns-heading">What we don’t know</h2><ul class="unknowns-list">' + (e.unknowns || []).map((function(e) {
      return "<li>" + s(e) + "</li>"
    })).join("") + '</ul></section><div class="detail-stack"><section class="detail-panel" aria-labelledby="mods-heading"><h2 class="panel-label" id="mods-heading">Modifications</h2><ul class="mod-list">' + (e.modifications || ["Unknown"]).map((function(e) {
      return '<li><span class="label">' + s(e) + '</span><span class="value">' + (a ? "Example" : "As stated in sources") + "</span></li>"
    })).join("") + '</ul></section><section class="detail-panel" aria-labelledby="conditions-heading"><h2 class="panel-label" id="conditions-heading">Detailed clearance by condition</h2>' + function(e) {
      var a = m(e),
        i = e.clearanceNotes || {};
      return '<ul class="condition-list">' + n.map((function(e) {
        var n = a[e.key],
          d = i[e.key] ? " — " + i[e.key] : "unknown" === n ? " — No evidence on file" : "";
        return '<li><span class="label">' + s(e.label) + '</span><span class="value">' + s(t[n] || "Unknown") + s(d) + "</span></li>"
      })).join("") + "</ul>"
    }(e) + '</section><section class="detail-panel" aria-labelledby="evidence-heading"><h2 class="panel-label" id="evidence-heading">Evidence &amp; Sources</h2><dl class="evidence-stats"><div class="evidence-stat"><dt>Status</dt><dd>' + s(d.label.replace(/ Fitment$| Setup$| Specification$/, "") || d.label) + '</dd></div><div class="evidence-stat"><dt>Sources</dt><dd>' + s(String(f)) + '</dd></div><div class="evidence-stat"><dt>Photographed installs</dt><dd>' + s(String(null != e.photos ? e.photos : "—")) + '</dd></div><div class="evidence-stat"><dt>Independent sources</dt><dd>' + s(String(null != e.independentSources ? e.independentSources : "—")) + '</dd></div></dl><p class="evidence-plain"><strong>Last reviewed:</strong> ' + s(String(e.lastReviewed || "Not stated")) + '</p><p class="evidence-plain">' + s(e.evidenceSummary || "") + "</p>" + function(e, n) {
      var t = e.sources || [];
      return t.length ? '<div class="source-cards">' + t.map((function(e) {
        return '<article class="source-card"><p class="source-card__type">' + s(e.type || "Source") + (n ? " · Example" : "") + '</p><h3 class="source-card__title">' + s(e.vehicle || "Vehicle not stated") + "</h3><dl><div><dt>Setup observed</dt><dd>" + s(e.setup || "—") + "</dd></div><div><dt>Suspension</dt><dd>" + s(e.suspension || "—") + "</dd></div><div><dt>What this source supports</dt><dd>" + s(e.supports || "—") + "</dd></div><div><dt>What this source does not prove</dt><dd>" + s(e.doesNotProve || "—") + '</dd></div></dl><a class="source-card__link" href="' + s(e.url || "#example-source") + '" target="_blank" rel="noopener noreferrer">' + s(e.linkLabel || "Original source (placeholder)") + "</a></article>"
      })).join("") + "</div>" : '<p class="evidence-plain">' + (n ? "Example source cards appear when demo data includes them." : "No source cards published for this fitment yet.") + "</p>"
    }(e, a) + '</section><section class="detail-panel" aria-labelledby="photos-heading"><h2 class="panel-label" id="photos-heading">Installation evidence / photos</h2><div class="photo-grid">' + [
      ["Side profile", "Placeholder"],
      ["Front / rear stance", "Placeholder"],
      ["Guard clearance", "Placeholder"],
      ["Inner wheel area", "Placeholder"]
    ].map((function(e) {
      return '<div class="photo-tile"><p class="photo-tile__label">' + s(e[0]) + '</p><p class="photo-tile__note">' + s(e[1]) + (a ? " · Example" : "") + "</p></div>"
    })).join("") + '</div><p class="photo-disclaimer">A glamour or stance shot is never treated as proof of clearance.</p></section><section class="detail-panel" aria-labelledby="related-heading"><h2 class="panel-label" id="related-heading">Related fitments</h2>' + function(e, n) {
      return e.length ? '<div class="related-grid">' + e.map((function(e) {
        var a = p(e.evidenceConfidence),
          i = "detail.html?id=" + encodeURIComponent(e.id || "") + (n || e.demo ? "&demo=1" : ""),
          d = m(e),
          r = "unknown" !== d.fullLock ? "Full lock: " + t[d.fullLock] : "unknown" !== d.outerGuard ? "Outer guard: " + t[d.outerGuard] : "Clearance: mostly Unknown";
        return '<a class="related-card' + (n || e.demo ? " is-example" : "") + '" href="' + i + '"><p class="related-card__wheel">' + s(c(e)) + " · " + s(o(e.offsetMm)) + '</p><p class="related-card__meta">' + s(e.tyreSize || "—") + " · " + s(e.suspension || "Unknown") + '</p><span class="related-card__evidence">' + s(a.label) + (n || e.demo ? " · Example" : "") + '</span><p class="related-card__clearance">' + s(r) + "</p></a>"
      })).join("") + "</div>" : '<p class="evidence-plain">No adjacent setups listed yet.</p>'
    }(i, a) + '</section></div><section class="detail-caveat" aria-label="Fitment caveat"><p>Fitment varies with tyre construction, alignment, suspension condition, vehicle load and manufacturing tolerances. Review the evidence above before purchasing.</p><div class="detail-actions"><a class="btn-primary" id="back-to-results" href="' + s(l()) + '">← Back to Results</a><a class="btn-ghost" href="pages/coming-soon.html?section=report">Report additional fitment evidence</a></div></section>'
  }

  function f() {
    var e = l();
    ["crumb-results", "footer-results", "back-to-results"].forEach((function(n) {
      var t = document.getElementById(n);
      t && t.setAttribute("href", e)
    }))
  }
  async function b() {
    ! function() {
      var e = document.getElementById("menu-toggle"),
        n = document.getElementById("mobile-menu");
      e && n && e.addEventListener("click", (function() {
        var t = n.hasAttribute("hidden");
        t ? n.removeAttribute("hidden") : n.setAttribute("hidden", ""), e.setAttribute("aria-expanded", t ? "true" : "false")
      }));
      var t = document.getElementById("search-toggle");
      t && t.addEventListener("click", (function() {
        window.location.href = "filters.html"
      }))
    }(), f();
    var t = document.getElementById("detail-root"),
      a = document.getElementById("detail-loading");
    if (t) {
      var l = r("id"),
        s = "1" === r("demo") || "true" === r("demo"),
        o = [];
      try {
        var p = await fetch("./data/fitments.json");
        if (p.ok) {
          var b = await p.json();
          o = (e && "function" == typeof e.publicFitments) ? e.publicFitments(b.fitments) : []
        }
      } catch (e) {
        console.error(e)
      }
      var y, w, g = l && o.find((function(e) {
          return String(e.id) === String(l)
        })),
        k = function(e, n) {
          return !!n || !e || !!(/^example-/i.test(e) || /^demo-/i.test(e) || /^scaffold-/i.test(e))
        }(l, s) || !g;
      k ? (y = function(e) {
        return e && i.find((function(n) {
          return n.id === e
        })) || i.find((function(e) {
          return e.id === d
        }))
      }(l), w = v(y, !0, [])) : w = v(y = function(e) {
        var t = m(e),
          a = Array.isArray(e.unknowns) ? e.unknowns.slice() : [];
        u(e) && -1 === a.indexOf("Centre bore unresolved") && a.unshift("Centre bore unresolved"), n.forEach((function(e) {
          if ("unknown" === t[e.key]) {
            var n = e.label + " not documented";
            a.some((function(n) {
              return -1 !== String(n).toLowerCase().indexOf(e.label.toLowerCase())
            })) || a.push(n)
          }
        })), a.some((function(e) {
          return /australian/i.test(String(e))
        })) || a.push("Australian tyre/load suitability not verified");
        var i = e.modifications;
        return i = Array.isArray(i) && i.length ? i.slice() : "string" == typeof i && i.trim() ? [i.trim()] : ["Unknown"], {
          id: e.id,
          demo: !1,
          wheelDiameterIn: e.wheelDiameterIn,
          wheelWidthIn: e.wheelWidthIn,
          offsetMm: e.offsetMm,
          tyreSize: e.tyreSize,
          tyreModel: e.tyreModel || "Not stated",
          suspension: e.suspension || "Unknown",
          wheelModel: e.wheelModel || "Not stated",
          pcd: e.pcd || "—",
          hubBoreMm: e.hubBoreMm,
          hubBoreStatus: e.hubBoreStatus || "unresolved",
          evidenceConfidence: e.evidenceConfidence || "Unverified",
          ownerReports: null != e.ownerReports ? e.ownerReports : "—",
          photos: null != e.photos ? e.photos : "—",
          independentSources: null != e.independentSources ? e.independentSources : "—",
          lastReviewed: e.lastReviewed || "Not stated",
          modifications: i,
          clearance: t,
          clearanceNotes: e.clearanceNotes || {},
          unknowns: a,
          evidenceSummary: e.evidenceSummary || "Review the sources below. Silence is treated as Unknown — not as clear.",
          sources: Array.isArray(e.sources) ? e.sources : [],
          related: Array.isArray(e.related) ? e.related : [],
          relatedIds: Array.isArray(e.relatedIds) ? e.relatedIds : []
        }
      }(g), !1, o), a && a.remove(), t.innerHTML = h(y, k, w), f(), document.title = "KEIFIT — " + c(y) + " · Fitment Detail" + (k ? " (Example)" : "")
    }
  }
  "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", b) : b()
}();
