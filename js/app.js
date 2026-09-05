(function () {
  const DATA_URL = "./data/fitments.json";
  const lib = window.KeiFitLib;

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
    fillSelect(els.suspension, lib.uniqueSorted(rows.map((r) => r.suspension)));
    fillSelect(
      els.diameter,
      lib.uniqueSorted(
        rows.map((r) => r.wheelDiameterIn),
        true
      ),
      (v) => `${v}"`
    );
    fillSelect(
      els.width,
      lib.uniqueSorted(
        rows.map((r) => r.wheelWidthIn),
        true
      ),
      (v) => `${v}"`
    );
    fillSelect(els.tyre, lib.uniqueSorted(rows.map((r) => r.tyreSize)));
  }

  function currentFilters() {
    return {
      suspension: els.suspension.value,
      diameter: els.diameter.value,
      width: els.width.value,
      tyre: els.tyre.value,
    };
  }

  function cardHtml(row) {
    const title = `${row.wheelDiameterIn}×${row.wheelWidthIn} · ${row.tyreSize}`;
    const hubUnknown =
      row.hubBoreMm == null ||
      ["unknown", "unresolved"].includes(String(row.hubBoreStatus || "unknown").toLowerCase());
    return `
      <article class="card">
        <h3 class="card-title">${lib.escapeHtml(title)}</h3>
        <dl class="card-grid">
          <div><dt>Suspension</dt><dd>${lib.escapeHtml(row.suspension || "—")}</dd></div>
          <div><dt>Offset</dt><dd>${lib.escapeHtml(lib.formatOffset(row.offsetMm))}</dd></div>
          <div><dt>Rubbing</dt><dd>${lib.escapeHtml(row.rubbing || "unknown")}</dd></div>
          <div><dt>Modifications</dt><dd>${lib.escapeHtml(row.modifications || "unknown")}</dd></div>
          <div>
            <dt>Hub / centre bore</dt>
            <dd>
              ${lib.escapeHtml(lib.hubLabel(row))}
              ${hubUnknown ? '<span class="badge badge-unknown">unknown</span>' : ""}
            </dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd><span class="badge ${lib.confidenceClass(row.evidenceConfidence)}">${lib.escapeHtml(
              row.evidenceConfidence || "Unverified"
            )}</span></dd>
          </div>
        </dl>
        ${row.notes ? `<p class="notes">${lib.escapeHtml(row.notes)}</p>` : ""}
      </article>
    `;
  }

  function render() {
    const filtered = fitments.filter((row) => lib.matches(row, currentFilters()));
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
      // Public finder only: exclude scaffold / non-gated rows from filters + results.
      fitments = lib.publicFitments(data.fitments);
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
