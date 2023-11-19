export const splitSearchUrl = (params = "") => {
	const urlQueryToObj = params === "" ? window.location.search : params;

	return urlQueryToObj
		.slice(1)
		.split("&")
		.map((p) => p.split("="))
		.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
};

export const numberWithSpaces = (x: number | string) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const chunkBy = (num: number, n: number) => {
	const arr: number[] = [];
	while (num > 0) {
		arr.push(Math.min(num, n));
		num = num - n;
	}

	return arr;
};

export const createFilledSvg = (
	svgCoords: string,
	percentage: number = 0,
	width: number,
	height: number,
	hash: string,
	fillColor: string = "#EEEDF5",
	percFillColor: string = "#F2C94C"
) => {
	const xmlns = "http://www.w3.org/2000/svg";
	const boxWidth = width;
	const boxHeight = height;

	let svgElem = document.createElementNS(xmlns, "svg");
	svgElem.setAttributeNS(null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
	svgElem.setAttributeNS(null, "width", `${boxWidth}`);
	svgElem.setAttributeNS(null, "height", `${boxHeight}`);
	svgElem.style.fill = "none";

	const g = document.createElementNS(xmlns, "g");

	// draw linear gradient
	const defs = document.createElementNS(xmlns, "defs");
	const grad = document.createElementNS(xmlns, "linearGradient");

	grad.setAttributeNS(null, "id", `gradient_${hash}`);
	grad.setAttributeNS(null, "x1", "0%");
	grad.setAttributeNS(null, "x2", "100%");
	grad.setAttributeNS(null, "y1", "0%");
	grad.setAttributeNS(null, "y2", "0%");

	const stopFilled = document.createElementNS(xmlns, "stop");
	stopFilled.setAttributeNS(null, "offset", `${percentage}%`);
	stopFilled.setAttributeNS(null, "stop-color", percFillColor);
	grad.appendChild(stopFilled);

	const stopEmpty = document.createElementNS(xmlns, "stop");
	stopEmpty.setAttributeNS(null, "offset", "0%");
	stopEmpty.setAttributeNS(null, "stop-color", fillColor);
	grad.appendChild(stopEmpty);

	defs.appendChild(grad);
	svgElem.appendChild(defs);

	// draw borders
	const coords = svgCoords;

	const path = document.createElementNS(xmlns, "path");
	path.setAttributeNS(null, "d", coords);
	path.setAttributeNS(null, "fill", `url(#gradient_${hash})`);
	svgElem.appendChild(path);

	const svgContainer = document.createElement("div");
	svgContainer.append(svgElem);

	return svgContainer;
};
