(function (root) {
  function hubUnknownSummary(hub) {
    if (!hub) return true;
    const p = hub.pcd && hub.pcd.state;
    const c = hub.centreBore && hub.centreBore.state;
    return p !== "known" || c !== "known";
  }

  function normalizeHub(hub) {
    const pcd = Object.assign({ state: "unknown" }, (hub && hub.pcd) || {});
    const centreBore = Object.assign({ state: "unknown" }, (hub && hub.centreBore) || {});
    return {
      pcd: pcd,
      centreBore: centreBore,
      hubUnknownSummary: hubUnknownSummary({ pcd: pcd, centreBore: centreBore }),
    };
  }

  /** Never wipe a known sibling when the other field is unresolved. */
  function displayFields(hub) {
    const h = normalizeHub(hub);
    return {
      pcdLabel:
        h.pcd.state === "known" && h.pcd.value
          ? h.pcd.value
          : h.pcd.state === "unresolved"
            ? "Unresolved"
            : "Unknown",
      centreBoreLabel:
        h.centreBore.state === "known" && h.centreBore.value
          ? h.centreBore.value
          : h.centreBore.state === "unresolved"
            ? "Unresolved"
            : "Unknown",
      hubUnknownSummary: h.hubUnknownSummary,
    };
  }

  const EVIDENCE_LABELS = [
    "Confirmed",
    "Reported",
    "Manufacturer spec",
    "Unverified",
  ];

  const api = {
    hubUnknownSummary: hubUnknownSummary,
    normalizeHub: normalizeHub,
    displayFields: displayFields,
    EVIDENCE_LABELS: EVIDENCE_LABELS,
  };
  root.KeiFitHub = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
