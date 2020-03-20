window.onload = function () {
  const form = document.forms[0];
  const scanField = document.getElementById("scan");
  const gbifField = document.getElementById("gbif");
  const scanTypeField = document.getElementById("scanType");
  const gbifDateField = document.getElementById("gbifDate");
  const changeEvent = new Event("change");

  function onScanChanged(e) {
    scanTypeField.disabled = e.target.value !== "true";
  }

  function onGbifChanged(e) {
    gbifDateField.disabled = e.target.value !== "true";
  }

  scanField.addEventListener("change", onScanChanged);
  gbifField.addEventListener("change", onGbifChanged);
};