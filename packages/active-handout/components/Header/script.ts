let isMenuOpened = false;

const body = document.querySelector("body");
const mainContent = document.querySelector(".main-content");
const mainHeader = document.querySelector<HTMLElement>(".main-header");

body?.style.setProperty("--header-height", mainHeader?.clientHeight + "px");

const menuBtn = mainHeader?.querySelector(".menu-btn");
menuBtn?.addEventListener("click", () => {
  toggleMenu();
});

const menuOverlay = mainHeader?.querySelector(".menu-overlay");
menuOverlay?.addEventListener("click", () => {
  toggleMenu(false);
});

const navMenu = mainHeader?.querySelector("nav");
if (navMenu) {
  mainHeader?.style.setProperty("--nav-menu-width", navMenu.clientWidth + "px");
}

if (mainContent && navMenu) {
  updateNavFitsPage();

  const resizeObserver = new ResizeObserver(updateNavFitsPage);
  resizeObserver.observe(navMenu);
  resizeObserver.observe(mainContent);
  resizeObserver.observe(document.body);
}

recoverMenuState();

// We need the setTimeout so there is a delay between the page load and the transition
setTimeout(() => {
  // Enable after everything is done, so that the transition is not visible on page load
  mainHeader?.classList.add("with-transition");
}, 1000);

// FUNCTIONS

function toggleMenu(opened?: boolean, bypassLocalStorage?: boolean) {
  if (opened === undefined) {
    opened = !isMenuOpened;
  }
  isMenuOpened = opened;
  if (isMenuOpened) {
    mainHeader?.classList.add("opened");
  } else {
    mainHeader?.classList.remove("opened");
  }

  if (!bypassLocalStorage) {
    saveMenuState(isMenuOpened);
  }
}

function navFitsPage() {
  const menuWidth = navMenu?.clientWidth || 0;
  const pageWidth = document.body.clientWidth;
  const contentWidth = mainContent?.clientWidth || 0;

  const availableWidth = (pageWidth - contentWidth) / 2;

  return availableWidth >= menuWidth;
}

function updateNavFitsPage() {
  const menuWidth = navMenu?.clientWidth || 0;

  if (menuWidth) {
    mainHeader?.style.setProperty("--nav-menu-width", menuWidth + "px");

    if (navFitsPage()) {
      mainHeader?.classList.remove("separate-nav-layer");
    } else {
      mainHeader?.classList.add("separate-nav-layer");
    }
  }
}

function saveMenuState(opened: boolean) {
  if (!navFitsPage()) return;

  localStorage.setItem("menu-opened", JSON.stringify(opened));
}

function recoverMenuState() {
  if (!navFitsPage()) return;

  const menuOpenedStr = localStorage.getItem("menu-opened");
  if (menuOpenedStr !== null) {
    const menuOpened = JSON.parse(menuOpenedStr);
    toggleMenu(menuOpened, true);
  }
}
