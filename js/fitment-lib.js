(function (root) {
  const EVIDENCE_LEVELS = [
    "Confirmed",
    "Reported",
    "Manufacturer specification",
    "Unverified",
  ];

  function isPublicFitment(row) {
    if (!row || typeof row !== "object") return false;
    const id = String(row.id || "");
    if (id.startsWith("scaffold-")) return false;
    if (row.scaffold === true) return false;
    if (String(row.visibility || "public").toLowerCase() === "scaffold") return false;
    return true;
  }

  function publicFitments(rows) {
    return (Array.isArray(rows) ? rows : []).filter(isPublicFitment);
  }

  function uniqueSorted(values, numeric) {
    const set = [...new Set(values.filter((v) => v !== undefined && v !== null && v !== ""))];
    if (numeric) {
      return set.sort((a, b) => Number(a) - Number(b));
    }
    return set.sort((a, b) =>
      String(a).localeCompare(String(b), undefined, { sensitivity: "base" })
    );
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
    const status = String((row && row.hubBoreStatus) || "unknown").toLowerCase();
    const mm = row && row.hubBoreMm;
    if (status === "unknown" || status === "unresolved" || mm == null) {
      return "Unknown / unresolved";
    }
    return `${mm} mm`;
  }

  function confidenceClass(level) {
    switch (String(level || "").trim()) {
      case "Confirmed":
        return "badge-confirmed";
      case "Reported":
        return "badge-reported";
      case "Manufacturer specification":
        return "badge-manufacturer";
      case "Unverified":
        return "badge-unverified";
      default:
        return "badge-unverified";
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const api = {
    EVIDENCE_LEVELS,
    isPublicFitment,
    publicFitments,
    uniqueSorted,
    matches,
    formatOffset,
    hubLabel,
    confidenceClass,
    escapeHtml,
  };

  root.KeiFitLib = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
