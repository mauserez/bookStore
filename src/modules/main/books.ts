import { addToAppContent, createBtn, fromHtml } from "./app";
import { swiftySlider } from "../../libs/slider/swifty";
import { ApiOptions, ApiResponse, getItems } from "./api";
import { chunkBy, createFilledSvg, numberWithSpaces } from "../util";
import {
	addItemToCart,
	cartItemCounter,
	checkItemExistsInCart,
	removeItemFromCart,
} from "./cart";

const bookMenulist: MenuList = [
	{ subject: "Architecture", name: "Архитектура" },
	{ subject: "Art & Fashion", name: "Исскуство и мода" },
	{ subject: "Biography", name: "Биография" },
	{ subject: "Business", name: "Бизнес" },
	{ subject: "Crafts & Hobbies", name: "Хобби" },
	{ subject: "Drama", name: "Драматургия" },
	{ subject: "Fiction", name: "Расследование" },
	{ subject: "Food & Drink", name: "Кулинария" },
	{ subject: "Health & Wellbeing", name: "Здоровье" },
	{ subject: "History & Politics", name: "Исторические" },
	{ subject: "Humor", name: "Юмор" },
	{ subject: "Poetry", name: "Поэзия" },
	{ subject: "Psychology", name: "Психология" },
	{ subject: "Science", name: "Наука" },
	{ subject: "Technology", name: "Технология" },
	{ subject: "Travel & Maps", name: "Путешествия" },
];
const bookBanners = ["banner1.jpg", "banner2.jpg", "banner3.jpg"];

export type MenuList = { subject: string; name: string }[];

export const createMenu = (menuList: MenuList, bookContainer: HTMLElement) => {
	const menu = fromHtml(`<aside class="book-content__menu"></aside>`);
	const menuFake = fromHtml(`<aside class="book-content__menu__fake"></aside>`);
	menu.append(menuFake);

	menuList.forEach((menuItem, i) => {
		const activeClass = i === 0 ? "active" : "";
		const q = `"subject:${menuItem.subject}"`;

		const li = createMenuItem(
			{ q: q },
			menuItem.subject,
			bookContainer,
			activeClass
		);

		menu.append(li);
	});

	const header = <HTMLElement>document.querySelector(".header-wrap");

	function setTopToBookMenu(header: HTMLElement) {
		if (header) {
			const addPx = window.innerWidth > 650 ? 45 : 0;
			menu.style.top = `${header.clientHeight + addPx}px`;
		}
	}

	setTopToBookMenu(header);
	window.addEventListener("resize", () => {
		setTopToBookMenu(header);
	});

	bookContainer.append(menu);
};

export const createMenuItem = (
	params: ApiOptions,
	name: string,
	bookContainer: HTMLElement,
	className?: string
) => {
	const li = fromHtml(
		`<div class="book-content__menu__item ${className}">
			<div class="book-content__menu__dot"></div>
			${name}
		</li>`
	);

	li.onclick = () => {
		if (!li.classList.contains("active")) {
			if (li.parentElement?.children) {
				Array.from(li.parentElement.children).forEach((e) => {
					e.classList.remove("active");
				});
			}

			if (window.innerWidth <= 650) {
				li.parentElement?.scrollTo({
					left: li.offsetLeft - li.clientWidth,
					behavior: "smooth",
				});
			}

			li.classList.add("active");

			createItemList(params, bookContainer);
		}
	};

	return li;
};

export const createItemList = async (
	params: ApiOptions,
	bookContainer: HTMLElement,
	init: boolean = false
) => {
	const existItemsWrap = bookContainer.querySelector(
		".book-content__item-wrap"
	);
	const itemsWrap = existItemsWrap
		? existItemsWrap
		: fromHtml(`<div class="book-content__item-wrap"></div>`);
	itemsWrap.innerHTML = "";

	const itemList = fromHtml(`<div class="book-content__item-list"></div>`);
	itemsWrap.append(itemList);

	const items = await getItems(params);

	if (items) {
		items.forEach((item) => {
			const itemCard = createItem(item);
			itemList.append(itemCard);
		});
	}

	const btn = createAddMoreItemsBtn(params, itemList);

	itemsWrap.append(btn);

	bookContainer.append(itemsWrap);

	if (init === false) {
		const firstItem = <HTMLElement>itemList.children[0];

		const pxDelimiter = window.innerWidth > 650 ? 2 : 1;
		const offset = firstItem.offsetHeight / pxDelimiter;

		window.scrollTo({
			top: firstItem.offsetTop - offset,
			behavior: "smooth",
		});
	}
};

const createItem = (item: ApiResponse) => {
	const itemCard = fromHtml(
		`<div class="book-content__item-list__item"></div>`
	);

	const itemImg = fromHtml(`<div class="item-img"></div>`);
	const thumbNail =
		item.volumeInfo.imageLinks !== undefined
			? item.volumeInfo.imageLinks.thumbnail
			: "assets/img/placeholder2.png";
	itemImg.style.backgroundImage = `url(${thumbNail})`;
	const itemInfo = createItemInfo(item);

	itemCard.append(itemImg);
	itemCard.append(itemInfo);

	return itemCard;
};

const createItemInfo = (item: ApiResponse) => {
	const itemInfo = fromHtml(`<div class="item-info"></div>`);

	const itemHeader = fromHtml(`<div class="item-info__header"></div>`);

	const itemAuthors = createItemAuthors(item.volumeInfo.authors);
	const itemTitle = fromHtml(
		`<div class="item-info__header__title">${item.volumeInfo.title}</div>`
	);
	const itemRating = createItemRating(item);

	const itemDescription = fromHtml(
		`<div class="item-info__description">${
			item.volumeInfo.description ?? ""
		}</div>`
	);

	const itemPrice = createItemPrice(item);

	const cartBtn = createItemCartBtn(item);

	itemHeader.append(itemAuthors, itemTitle, itemRating, itemDescription);
	itemInfo.append(itemHeader);
	itemInfo.append(itemPrice);
	itemInfo.append(cartBtn);

	return itemInfo;
};

const createItemAuthors = (authors: string[]) => {
	if (authors === undefined || authors.length === 0) {
		return "";
	}

	const authorsInfo = fromHtml(
		`<div class="item-info__header__authors"></div>`
	);

	const authorsText = authors.join(",");
	authorsInfo.innerHTML = authorsText;

	return authorsInfo;
};

const createItemRating = (item: ApiResponse) => {
	if (!item.volumeInfo.averageRating) {
		return "";
	}

	const ratingBlock = fromHtml(`<div class="item-info__header__rating"></div>`);

	const stars = fromHtml(
		`<div class="item-info__header__rating__stars"></div>`
	);
	const averageRating = item.volumeInfo.averageRating * 100;

	const starData = chunkBy(averageRating, 100);
	const svgCoords =
		"M6 0L7.80568 3.5147L11.7063 4.1459L8.92165 6.9493L9.52671 10.8541L6 9.072L2.47329 10.8541L3.07835 6.9493L0.293661 4.1459L4.19432 3.5147L6 0Z";

	for (let i = 0; i < 5; i++) {
		const hashId = `${i}${item.id}`;
		const star = createFilledSvg(svgCoords, starData[i], 12, 11, hashId);
		stars.append(star);
	}

	const reviews = fromHtml(
		`<div class="item-info__header__rating__reviews">
		${item.volumeInfo.ratingsCount ?? 0} review
		</div>`
	);

	ratingBlock.append(stars, reviews);

	return ratingBlock;
};

const createItemPrice = (item: ApiResponse) => {
	if (!item.saleInfo.retailPrice) {
		return "";
	}

	const price = fromHtml(
		`<div class="item-info__price">
		${item.saleInfo.retailPrice.currencyCode}
		${numberWithSpaces(item.saleInfo.retailPrice.amount)}
		</div>`
	);

	return price;
};

const btnTexts = ["buy now", "in the cart"];

const createItemCartBtn = (item: ApiResponse) => {
	const checkInCartClass = checkItemExistsInCart(item.id);
	let btnText = btnTexts[0];
	let btnClass = "";
	if (checkInCartClass === true) {
		btnText = btnTexts[1];
		btnClass = "active";
	}

	const btn = createBtn({
		text: btnText,
		className: `item-info__cart-btn ${btnClass}`,
		clickCb: (btn: HTMLElement) => {
			btn.classList.toggle("active");

			if (btn.classList.contains("active")) {
				btn.innerHTML = btnTexts[1];
				addItemToCart(item.id);
			} else {
				removeItemFromCart(item.id);
				btn.innerHTML = btnTexts[0];
			}

			const headerCartBtnCounter = document
				.querySelector(".header__cart-btn")
				?.querySelector(".counter");
			if (headerCartBtnCounter) {
				headerCartBtnCounter.innerHTML = cartItemCounter();
			}
		},
	});

	return btn;
};

const createAddMoreItemsBtn = (
	params: ApiOptions,
	itemListContainer: HTMLElement
) => {
	const btn = <HTMLButtonElement>(
		fromHtml(
			`<button id="book-content__load-more-btn" type="button">load more</button>`
		)
	);

	btn.onclick = () => {
		const startIndex = !btn.dataset.startIndex
			? 6
			: parseFloat(btn.dataset.startIndex) + 6;
		params.startIndex = startIndex;
		btn.disabled = true;
		btn.append(fromHtml(`<i class="bi bi-sun"></i>`));

		addMoreItems.bind({ btn: btn })(params, itemListContainer);
	};

	return btn;
};

async function addMoreItems(
	params: ApiOptions,
	itemListContainer: HTMLElement
) {
	const items = await getItems(params);
	if (items) {
		items.forEach((item) => {
			const itemCard = createItem(item);
			itemListContainer.append(itemCard);
		});
	}

	if (this.btn) {
		this.btn.dataset.startIndex = params.startIndex;
		this.btn.querySelector("i").remove();
		this.btn.disabled = false;
	}
}

type promoLink = {
	text: string;
	back: string;
};

const createPromoLink = (data: promoLink, num: number) => {
	const promo = fromHtml(`
		<div style="background-color:${data.back}" class="promo-link promo-link-${num}">
		${data.text}
		<img alt="Стрелка" src="assets/icons/arrow.svg"/>
		</div>
	`);

	return promo;
};

export const drawBooksContent = async (params: ApiOptions) => {
	const bookContentWrap = fromHtml(`<div class="book-content-wrap"></div>`);
	const bookContent = fromHtml(
		`<div class="book-content inner-container"></div>`
	);
	bookContentWrap.append(bookContent);

	const sliderSection = fromHtml(
		`<section class="book-content__slider-section"></section>`
	);

	const bookSlider = swiftySlider(bookBanners);
	sliderSection.append(bookSlider);

	const sliderSectionLinks = [
		{
			text: "change old book on new",
			back: "#9E98DC",
		},
		{
			text: "top <br/> 100 <br/> books 2022",
			back: "#FF8FE6",
		},
	];

	sliderSectionLinks.forEach((promo, i) => {
		sliderSection.append(createPromoLink(promo, i + 1));
	});

	createMenu(bookMenulist, bookContent);
	createItemList(params, bookContent, true);

	addToAppContent(sliderSection);
	addToAppContent(bookContentWrap);
};
