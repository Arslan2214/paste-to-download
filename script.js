document.addEventListener("DOMContentLoaded", () => {
  const urlInput = document.getElementById("urlInput");
  const downloadUrlBtn = document.getElementById("downloadUrlBtn");
  const dropZone = document.getElementById("dropZone");

  downloadUrlBtn.addEventListener("click", () => {
    const url = encodeURI(urlInput.value.trim());
    if (url) {
      downloadFile(url);
    } else {
      alert("Please enter a valid URL.");
    }
  });

  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = "#d1e7dd";
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.style.backgroundColor = "#e9ecef";
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = "#e9ecef";
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      downloadFile(URL.createObjectURL(files[0]));
    }
  });

  document.addEventListener("paste", (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file") {
        const file = items[i].getAsFile();
        downloadFile(URL.createObjectURL(file));
      }
    }
  });

  function downloadFile(url) {
    fetch(encodeURI(url))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = getFileNameFromUrl(url);
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch((error) => {
        console.error("Download failed:", error);
        alert(
          "Failed to download file. Please check the URL or network connection."
        );
      });
  }

  function getFileNameFromUrl(url) {
    return url.split("/").pop().split("?")[0];
  }
});
