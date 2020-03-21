function main() {
  const searchParams = new URLSearchParams(window.location.search);
  const collectionTabButton = document.getElementById("btn-tab-collections");
  const institutionTabButton = document.getElementById("btn-tab-institutions");

  if (searchParams.has("tab")) {
    if (searchParams.get("tab") === "collections") {
      collectionTabButton.click();
    } else if (searchParams.get("tab") === "institutions") {
      institutionTabButton.click();
    }
  }
}

window.addEventListener("load", main);
