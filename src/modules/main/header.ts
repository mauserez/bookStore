import { addToBody, fromHtml } from "./app";
import { cartItemCounter } from "./cart";

const headerLogo = () => {
	const logo = fromHtml(`<div class="header__logo">Bookshop</div>`);

	logo.onclick = () => {
		//window.location.href = "/books?category_id=1";
	};

	return logo;
};

const headerNav = () => {
	const headerNavList = ["books", "audiobooks", "stationery & gifts", "blog"];
	const headerNav = fromHtml(`<ul class="header__nav"></ul>`);

	headerNavList.forEach((i, iteration) => {
		const menuItem = fromHtml(
			`<li class="header__nav__item ${
				iteration === 0 ? "active" : ""
			}">${i}</li>`
		);
		menuItem.onclick = () => {
			Array.from(headerNav.children).forEach((el) => {
				el.classList.remove("active");
			});
			menuItem.classList.add("active");
		};
		headerNav.append(menuItem);
	});

	return headerNav;
};

const headerBtnTemp = (
	className: string,
	url: string,
	counter = { need: false, value: 0 }
) => {
	let counterEl = "";
	if (counter.need === true) {
		counterEl = `<div class="counter">${counter.value}</div>`;
	}

	return fromHtml(
		`<div class="header__btn ${className}">
			<img src="${url}"/>
			${counterEl}
		</div>`
	);
};

const headerProfileBtn = () => {
	const btn = headerBtnTemp("header__profile-btn", "/assets/icons/profile.svg");

	return btn;
};

const headerSearchBtn = () => {
	const btn = headerBtnTemp("header__search-btn", "/assets/icons/search.svg");

	return btn;
};

const headerCartBtn = () => {
	const counter = { need: true, value: cartItemCounter() };
	const btn = headerBtnTemp(
		"header__cart-btn",
		"/assets/icons/cart.svg",
		counter
	);

	return btn;
};

const headerBtns = () => {
	const headerBtns = fromHtml(`<div class="header__btns"></div>`);
	headerBtns.append(headerProfileBtn(), headerSearchBtn(), headerCartBtn());

	return headerBtns;
};

export const drawHeader = () => {
	const headerWrap = fromHtml(`<section class="header-wrap"></section>`);
	const header = fromHtml(`<header class="header inner-container"></header>`);
	const logo = headerLogo();
	const nav = headerNav();
	const btns = headerBtns();
	header.append(logo, nav, btns);
	headerWrap.append(header);

	addToBody(headerWrap);
};
