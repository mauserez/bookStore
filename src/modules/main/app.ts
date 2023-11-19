export const fromHtml = (htmlString: string) => {
	var div = document.createElement("div");
	div.innerHTML = htmlString.trim();
	const elem = div.firstChild;

	// Change this to div.childNodes to support multiple top-level nodes.
	return <HTMLElement>elem;
};

export const createApp = () => {
	const app = fromHtml(`<section id="app" class="container"></section>`);
	addToBody(app);
};

export const createAppContent = () => {
	const appContent = fromHtml(
		`<main id="app-content" class="inner-container"></main>`
	);
	addToApp(appContent);
};

export const addToBody = (content: HTMLElement | string) => {
	const body = document.querySelector("body");
	if (body) {
		body.append(content);
	}
};

export const addToApp = (content: HTMLElement | string) => {
	const app = document.querySelector("#app");
	if (app) {
		app.append(content);
	}
};

export const addToAppContent = (content: HTMLElement | string) => {
	const appContent = document.querySelector("#app-content");
	if (appContent) {
		appContent.append(content);
	}
};

type btnOptions = {
	text?: string;
	className: string;
	clickCb: Function;
	successCb?: Function;
	errorCb?: Function;
};

export const createBtn = (options: btnOptions) => {
	const text = options.text ? options.text : "Press";
	const className = options.className ? options.className : "";
	const clickCb: Function = options.clickCb ? options.clickCb : () => {};

	const btn = fromHtml(`<button class="btn ${className}">${text}</button>`);

	btn.onclick = () => {
		clickCb(btn);
	};

	return btn;
};

export const showApp = () => {
	const body = document.querySelector("body");
	if (body) {
		setTimeout(() => {
			body.style.visibility = "visible";
		}, 300);
	}
};
