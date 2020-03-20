window.onload = function () {
  const scanField = document.getElementById("scan");
  const gbifField = document.getElementById("gbif");
  const scanTypeField = document.getElementById("scanType");
  const gbifDateField = document.getElementById("gbifDate");

  function onScanChanged(e) {
    scanTypeField.disabled = e.target.value !== "Yes";
  }

  function onGbifChanged(e) {
    gbifDateField.disabled = e.target.value !== "Yes";
  }

  scanField.addEventListener("change", onScanChanged);
  gbifField.addEventListener("change", onGbifChanged);

  scanField.dispatchEvent(new Event("change"));
  gbifField.dispatchEvent(new Event("change"));
};