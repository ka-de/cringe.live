document.addEventListener("DOMContentLoaded", function () {
  const logo = document.querySelector(".header__logo");

  // Disables that weird triangle if the screen is too small.
  function toggleLogoVisibility() {
    if (window.innerWidth <= 720) {
      logo.style.content = "none";
    } else {
      logo.style.content = "''";
    }
  }
  toggleLogoVisibility();
  window.addEventListener("resize", toggleLogoVisibility);
});