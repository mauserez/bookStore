import { drawBooksContent } from "../modules/main/books";
import { splitSearchUrl } from "../modules/util";

export const initRouter = () => {
	window.onpopstate = () => {
		router();
	};

	return router();
};

export const router = () => {
	const route = window.location.pathname;

	const methodParams: {
		[key: number | string]: string | number;
	} = window.location.search === "" ? {} : splitSearchUrl();

	switch (route) {
		case "/audiobooks":
			break;
		default:
			drawBooksContent({});
			break;
	}

	return methodParams;
};
