(function () {
  const DATA_URL = "./data/fitments.json";

  const els = {
    suspension: document.getElementById("filter-suspension"),
    diameter: document.getElementById("filter-diameter"),
    width: document.getElementById("filter-width"),
    tyre: document.getElementById("filter-tyre"),
    list: document.getElementById("results-list"),
    count: document.getElementById("results-count"),
    empty: document.getElementById("empty-state"),
    error: document.getElementById("load-error"),
  };

  let fitments = [];

  function uniqueSorted(values, numeric) {
    const set = [...new Set(values.filter((v) => v !== undefined && v !== null && v !== ""))];
    if (numeric) {
      return set.sort((a, b) => Number(a) - Number(b));
    }
    return set.sort((a, b) => String(a).localeCompare(String(b), undefined, { sensitivity: "base" }));
  }

  function fillSelect(select, values, format) {
    const keep = select.querySelector('option[value="all"]');
    select.innerHTML = "";
    select.appendChild(keep || new Option("All", "all"));
    values.forEach((v) => {
      const label = format ? format(v) : String(v);
      select.appendChild(new Option(label, String(v)));
    });
  }

  function populateFilters(rows) {
    fillSelect(els.suspension, uniqueSorted(rows.map((r) => r.suspension)));
    fillSelect(
      els.diameter,
      uniqueSorted(
        rows.map((r) => r.wheelDiameterIn),
        true
      ),
      (v) => `${v}"`
    );
    fillSelect(
      els.width,
      uniqueSorted(
        rows.map((r) => r.wheelWidthIn),
        true
      ),
      (v) => `${v}"`
    );
    fillSelect(els.tyre, uniqueSorted(rows.map((r) => r.tyreSize)));
  }

  function currentFilters() {
    return {
      suspension: els.suspension.value,
      diameter: els.diameter.value,
      width: els.width.value,
      tyre: els.tyre.value,
    };
  }

  function matches(row, f) {
    if (f.suspension !== "all" && String(row.suspension) !== f.suspension) return false;
    if (f.diameter !== "all" && String(row.wheelDiameterIn) !== f.diameter) return false;
    if (f.width !== "all" && String(row.wheelWidthIn) !== f.width) return false;
    if (f.tyre !== "all" && String(row.tyreSize) !== f.tyre) return false;
    return true;
  }

  function formatOffset(mm) {
    if (mm === null || mm === undefined || mm === "") return "Unknown";
    return `${mm} mm`;
  }

  function hubLabel(row) {
    const status = (row.hubBoreStatus || "unknown").toLowerCase();
    if (status === "unknown" || status === "unresolved" || row.hubBoreMm == null) {
      return "Unknown / unresolved";
    }
    return `${row.hubBoreMm} mm`;
  }

  function confidenceClass(level) {
    const key = String(level || "").toLowerCase();
    if (key === "confirmed") return "badge-confirmed";
    if (key === "reported") return "badge-reported";
    return "badge-unverified";
  }

  function cardHtml(row) {
    const title = `${row.wheelDiameterIn}×${row.wheelWidthIn} · ${row.tyreSize}`;
    const hubUnknown =
      !row.hubBoreMm ||
      ["unknown", "unresolved"].includes(String(row.hubBoreStatus || "unknown").toLowerCase());
    return `
      <article class="card">
        <h3 class="card-title">${escapeHtml(title)}</h3>
        <dl class="card-grid">
          <div><dt>Suspension</dt><dd>${escapeHtml(row.suspension || "—")}</dd></div>
          <div><dt>Offset</dt><dd>${escapeHtml(formatOffset(row.offsetMm))}</dd></div>
          <div><dt>Rubbing</dt><dd>${escapeHtml(row.rubbing || "unknown")}</dd></div>
          <div><dt>Modifications</dt><dd>${escapeHtml(row.modifications || "unknown")}</dd></div>
          <div>
            <dt>Hub / centre bore</dt>
            <dd>
              ${escapeHtml(hubLabel(row))}
              ${hubUnknown ? '<span class="badge badge-unknown">unknown</span>' : ""}
            </dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd><span class="badge ${confidenceClass(row.evidenceConfidence)}">${escapeHtml(
              row.evidenceConfidence || "Unverified"
            )}</span></dd>
          </div>
        </dl>
        ${
          row.notes
            ? `<p class="notes">${escapeHtml(row.notes)}</p>`
            : ""
        }
      </article>
    `;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render() {
    const filtered = fitments.filter((row) => matches(row, currentFilters()));
    els.count.textContent = `${filtered.length} result${filtered.length === 1 ? "" : "s"}`;
    els.list.innerHTML = filtered.map(cardHtml).join("");
    els.empty.hidden = filtered.length > 0;
    els.list.hidden = filtered.length === 0;
  }

  function bindFilters() {
    [els.suspension, els.diameter, els.width, els.tyre].forEach((el) => {
      el.addEventListener("change", render);
    });
  }

  async function init() {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      fitments = Array.isArray(data.fitments) ? data.fitments : [];
      populateFilters(fitments);
      bindFilters();
      render();
    } catch (err) {
      console.error(err);
      els.error.hidden = false;
      els.count.textContent = "";
      els.empty.hidden = true;
    }
  }

  init();
})();
