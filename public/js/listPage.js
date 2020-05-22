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

  collectionTabButton.addEventListener("click", () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("tab");
    window.history.pushState(
      { query: searchParams.toString() },
      "",
      "?" + searchParams.toString()
    );
  });

  institutionTabButton.addEventListener("click", () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("tab", "institutions");
    window.history.pushState(
      { query: searchParams.toString() },
      "",
      "?" + searchParams.toString()
    );
  })
}

window.addEventListener("load", main);
