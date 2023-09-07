let isMenuOpened = false;

const body = document.querySelector("body");
const mainContent = document.querySelector(".main-content");
const mainHeader = document.querySelector<HTMLElement>(".main-header");
const headerContainer =
  document.querySelector<HTMLElement>(".header-container");

if (mainHeader) {
  const resizeObserver = new ResizeObserver(() => {
    body?.style.setProperty("--header-height", mainHeader.clientHeight + "px");
  });
  resizeObserver.observe(mainHeader);
}

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  if (scrollY > 0) {
    headerContainer?.classList.add("scrolled");
  } else {
    headerContainer?.classList.remove("scrolled");
  }
});

const menuBtn = headerContainer?.querySelector(".menu-btn");
menuBtn?.addEventListener("click", () => {
  toggleMenu();
});

const menuOverlay = headerContainer?.querySelector(".menu-overlay");
menuOverlay?.addEventListener("click", () => {
  toggleMenu(false);
});

const navMenu = headerContainer?.querySelector("nav");
if (navMenu) {
  headerContainer?.style.setProperty(
    "--nav-menu-width",
    navMenu.clientWidth + "px"
  );
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
  headerContainer?.classList.add("with-transition");
}, 1000);

// FUNCTIONS

function toggleMenu(opened?: boolean, bypassLocalStorage?: boolean) {
  if (opened === undefined) {
    opened = !isMenuOpened;
  }
  isMenuOpened = opened;
  if (isMenuOpened) {
    headerContainer?.classList.add("opened");
  } else {
    headerContainer?.classList.remove("opened");
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
    headerContainer?.style.setProperty("--nav-menu-width", menuWidth + "px");

    if (navFitsPage()) {
      headerContainer?.classList.remove("separate-nav-layer");
    } else {
      headerContainer?.classList.add("separate-nav-layer");
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
