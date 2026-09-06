(function (root) {
  "use strict";

  /**
   * Single Make → Model mapping for finder UIs.
   * Labels only — not fitment claims or inferred compatibility.
   * Do not invent cross-make models.
   */
  var MAKES = [
    { value: "suzuki", label: "Suzuki" },
    { value: "daihatsu", label: "Daihatsu" },
    { value: "honda", label: "Honda" },
    { value: "other", label: "Other" },
  ];

  var MODELS_BY_MAKE = {
    suzuki: [{ value: "carry-da16t", label: "Carry DA16T" }],
    daihatsu: [{ value: "hijet", label: "Hijet" }],
    honda: [{ value: "acty", label: "Acty" }],
    other: [{ value: "other", label: "Other" }],
  };

  /** Broad year buckets shared across makes — not a claim of availability. */
  var YEAR_OPTIONS = [
    { value: "2013-plus", label: "2013+" },
    { value: "2000-2012", label: "2000–2012" },
    { value: "pre-2000", label: "Pre-2000" },
    { value: "any", label: "Any" },
  ];

  function modelsForMake(make) {
    var key = String(make || "").toLowerCase();
    return (MODELS_BY_MAKE[key] || []).slice();
  }

  function isModelForMake(make, model) {
    if (!make || !model) return false;
    return modelsForMake(make).some(function (m) {
      return m.value === model;
    });
  }

  var api = {
    MAKES: MAKES,
    MODELS_BY_MAKE: MODELS_BY_MAKE,
    YEAR_OPTIONS: YEAR_OPTIONS,
    modelsForMake: modelsForMake,
    isModelForMake: isModelForMake,
  };

  root.KeiFitVehicleCatalog = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
