const container = document.querySelector(".user");
if (container) {
  const dialog = container.querySelector("dialog");
  if (dialog) {
    const toggleMenu = container.querySelector(".toggle-user-menu-btn");
    toggleMenu?.addEventListener("click", () => {
      if (dialog.open) {
        dialog.close();
      } else {
        dialog.show();
      }
    });
  }

  const signOutBtn = container.querySelector(".sign-out-btn");
  signOutBtn?.addEventListener("click", () => {
    fetch("/api/auth/signout", { method: "POST" }).then(() => {
      window.location.reload();
    });
  });
}
