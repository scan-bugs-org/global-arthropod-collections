const defaultLabel = "Choose file...";

window.addEventListener("load", () => {
  const labelField = document.getElementById("csv-upload-label");
  const inputField = document.getElementById("csv-upload");
  const clearBtn = document.getElementById("clear-btn");

  labelField.innerText = defaultLabel;

  inputField.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length > 0) {
      labelField.innerText = e.target.files[0].name;
    } else {
      labelField.innerText = defaultLabel;
    }
  });

  clearBtn.addEventListener("click", () => {
    labelField.innerText = defaultLabel;
  });
});