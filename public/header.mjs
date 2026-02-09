import { toHtmlElement } from "./toHtmlElement.mjs";

const HEADER_LINKS = [
	{ text: "Home", menuHref: "index.html" },
	{ text: "Projects", menuHref: "#" },
	{ text: "Hobbies", menuHref: "#" },
];

const DARK_MODE_STORAGE_KEY = "darkMode";

export function createHeader() {
	const desktopNavAnchors = HEADER_LINKS.map((link) => `<a>${link.text}</a>`).join("\n");
	const menuNavAnchors = HEADER_LINKS.map(
		(link) => `<a href="${link.menuHref}">${link.text}</a>`,
	).join("\n");

	const headerHtml = `
		<header class="header">
			<h1 class="instrument-serif-regular-italic">Stanley Keopilavan</h1>
			<nav class="navigation">
				${desktopNavAnchors}
			</nav>
			<label class="checkbox">
				<input class="dark-mode-toggle" type="checkbox" autocomplete="off" />
				Dark mode
			</label>
			<div class="menu">
				<button class="menu-button" type="button" aria-expanded="false">Menu</button>
			</div>
			<nav class="menu-items">
				${menuNavAnchors}
			</nav>
		</header>
	`;
	const fragment = toHtmlElement(headerHtml);
	const header = fragment.firstElementChild ?? fragment;

	const menuButton = header.querySelector(".menu-button");
	const menuItems = header.querySelector(".menu-items");
	const darkModeToggle = header.querySelector(".dark-mode-toggle");

	function setMenuOpen(isOpen) {
		menuItems.classList.toggle("is-open", isOpen);
		menuButton.setAttribute("aria-expanded", String(isOpen));
	}

	menuButton.addEventListener("click", () => {
		const isOpen = menuItems.classList.contains("is-open");
		setMenuOpen(!isOpen);
	});

	document.body.addEventListener("click", (event) => {
		const clickedInsideHeader = header.contains(event.target);
		if (!clickedInsideHeader) {
			setMenuOpen(false);
		}
	});

	function applyDarkMode(isEnabled) {
		document.body.classList.toggle("dark-mode", isEnabled);
		if (darkModeToggle) {
			darkModeToggle.checked = isEnabled;
		}
		localStorage.setItem(DARK_MODE_STORAGE_KEY, isEnabled ? "1" : "0");
	}

	const savedDarkMode = localStorage.getItem(DARK_MODE_STORAGE_KEY);
	const savedEnabled = savedDarkMode === "1";
	applyDarkMode(savedEnabled);

	darkModeToggle.addEventListener("change", () => {
		applyDarkMode(darkModeToggle.checked);
	});

	return header;
}

function insertHeader() {
	const header = createHeader();
	const existingHeader = document.querySelector("header.header");
	if (existingHeader) {
		existingHeader.replaceWith(header);
		return;
	}

	document.body.prepend(header);
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", insertHeader);
} else {
	insertHeader();
}
