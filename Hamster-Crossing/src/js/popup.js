document.addEventListener("DOMContentLoaded", function () {
    // Popup elements
    const openBtn = document.getElementById("openPopup");
    const closeBtn = document.getElementById("closePopup");
    const popup = document.getElementById("popup");
  
    // Result popup elements
    const closeResultPopupBtn = document.getElementById("closeResultPopup");
    const resultPopup = document.getElementById("resultPopup");
  
    // Open the hamster selection popup
    if (openBtn && popup) {
      openBtn.addEventListener("click", () => {
        popup.classList.add("open");
      });
    }
  
    // Close the hamster selection popup
    if (closeBtn && popup) {
      closeBtn.addEventListener("click", () => {
        popup.classList.remove("open");
      });
    }
  
    // Close the result popup
    if (closeResultPopupBtn && resultPopup) {
      closeResultPopupBtn.addEventListener("click", () => {
        resultPopup.style.display = "none";
      });
    }
  });
  