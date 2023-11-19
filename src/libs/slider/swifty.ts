import { fromHtml } from "../../modules/main/app";

type Slider = {
	slider: HTMLElement | null;
	slideContainer: HTMLElement;
	slides: HTMLElement[];
	arrowContainer?: HTMLElement;
	dotContainer?: HTMLElement;
	dots?: HTMLElement[];

	curIdx: number;
	lastIdx: number;
	maxIdx: number;
	transformDistance: number;
	slideSeconds: number;
	timer?: NodeJS.Timeout;
	slideWidth: number;
	getSlideWidth: Function;
	setSlideWidth: Function;
	setArrowHeight: Function;

	toSlide: Function;
	setSlide: Function;
	nextSlide: Function;
	prevSlide: Function;
	activateDot: Function;

	init: Function;
	setTransition: Function;
	startLoop: Function;
	stopLoop: Function;
};

export const swiftySlider = (images: string[]) => {
	const imgCount: number = images.length;
	const maxIdx = imgCount - 1;
	const slidesObject = createSlideContainer(images);

	const sl: Slider = {
		slider: null,
		slideContainer: slidesObject.container,
		slides: slidesObject.slides,
		maxIdx: maxIdx,
		curIdx: 0,
		lastIdx: maxIdx,
		transformDistance: 0,
		slideWidth: 0,
		slideSeconds: 5000,
		getSlideWidth: () => {},
		setSlideWidth: () => {},
		setArrowHeight: () => {},

		toSlide: () => {},
		setSlide: () => {},
		nextSlide: () => {},
		prevSlide: () => {},
		activateDot: () => {},

		init: () => {},
		setTransition: () => {},
		startLoop: () => {},
		stopLoop: () => {},
	};

	sl.getSlideWidth = () => {
		return sl.slider !== null
			? sl.slider.parentElement?.getBoundingClientRect().width
			: 0;
	};

	sl.slideWidth = sl.getSlideWidth();

	sl.toSlide = (distance: number) => {
		sl.slideContainer.style.transform = `translateX(${distance}px)`;
		sl.activateDot();
	};

	sl.setSlide = (idx: number) => {
		sl.lastIdx = sl.curIdx;
		sl.curIdx = idx;
		sl.transformDistance = -(sl.curIdx * sl.slideWidth);
		sl.toSlide(sl.transformDistance);
	};

	sl.prevSlide = () => {
		if (sl.curIdx > 0) {
			sl.lastIdx = sl.curIdx;
			sl.curIdx--;
			sl.transformDistance = sl.transformDistance + sl.slideWidth;
		} else {
			sl.lastIdx = sl.curIdx;
			sl.curIdx = sl.maxIdx;
			sl.transformDistance = -(sl.maxIdx * sl.slideWidth);
		}

		sl.toSlide(sl.transformDistance);
	};

	sl.nextSlide = () => {
		sl.lastIdx = sl.curIdx;

		if (sl.curIdx === maxIdx) {
			sl.curIdx = 0;
			sl.transformDistance = 0;
		} else {
			sl.curIdx++;
		}

		sl.transformDistance = -(sl.curIdx * sl.slideWidth);
		sl.toSlide(sl.transformDistance);
	};

	sl.startLoop = () => {
		sl.timer = setInterval(() => {
			sl.nextSlide();
		}, sl.slideSeconds);
	};

	sl.stopLoop = () => {
		clearInterval(sl.timer);
	};

	sl.setSlideWidth = () => {
		clearInterval(sl.timer);
		sl.slideWidth = sl.getSlideWidth();

		for (let i = 0; i < sl.slides.length; i++) {
			const slide = sl.slides[i];
			slide.style.width = `${sl.slideWidth}px`;
		}

		sl.slideContainer.style.transform = `translateX(${
			-sl.curIdx * sl.slideWidth
		}px)`;
		sl.slideContainer.style.width = `${sl.slideWidth * imgCount}px`;
	};

	sl.setArrowHeight = () => {
		/* if (sl.arrowContainer) {
			sl.arrowContainer.style.height = `${
				sl.slideContainer.getBoundingClientRect().height
			}px`;

			setTimeout(() => {
				if (sl.arrowContainer) {
					sl.arrowContainer.style.display = "flex";
				}
			}, 100);
		} */
	};

	sl.setTransition = (second: number) => {
		sl.slideContainer.style.transition = `transform ${second}s ease-out 0.1s`;
	};

	sl.activateDot = () => {
		if (sl.dots) {
			sl.dots[sl.lastIdx].classList.remove("is-active");
			sl.dots[sl.curIdx].classList.add("is-active");
		}
	};

	sl.init = () => {
		sl.stopLoop();
		sl.activateDot();
		sl.setSlideWidth();
		sl.setSlide(sl.curIdx);
		sl.startLoop();
		sl.setArrowHeight();
	};

	sl.slider = createSlider(sl);
	sl.arrowContainer = createArrowContainer(sl);
	const dotObject = createDotContainer(images, sl);
	sl.dotContainer = dotObject.container;
	sl.dots = dotObject.dots;

	const slideWrap = fromHtml(`<div class="swifty-slider__slide-wrap"></div>`);
	slideWrap.append(sl.slideContainer);
	sl.slider.append(slideWrap, sl.arrowContainer, sl.dotContainer);

	sl.slider.addEventListener(
		"DOMNodeInserted",
		function (ev) {
			setTimeout(() => {
				sl.init();
				sl.setArrowHeight();
				if (sl.slider) {
					sl.slider.style.display = "flex";
				}
			}, 10);
		},
		false
	);

	window.onresize = () => {
		sl.setSlideWidth();
		sl.setArrowHeight();
		sl.setTransition(0);
		setTimeout(() => {
			sl.setTransition(1.5);
		}, 500);
	};

	return sl.slider;
};

const createSlider = (sl: Slider) => {
	const slider = fromHtml(`<div class="swifty-slider"></div>`);
	slider.onmouseover = () => {
		sl.stopLoop();
	};

	slider.onmouseout = () => {
		sl.startLoop();
	};

	return slider;
};

const createArrowContainer = (sl: Slider) => {
	const prevBtn = fromHtml('<span class="arrow arrow-prev"></span>');
	prevBtn.onclick = () => sl.prevSlide();

	const nextBtn = fromHtml('<span class="arrow arrow-next"></span>');
	nextBtn.onclick = () => sl.nextSlide();

	const arrowContainer = fromHtml(
		`<div class="swifty-slider__arrow-container"></div>`
	);
	arrowContainer.append(prevBtn, nextBtn);

	return arrowContainer;
};

const createSlideContainer = (images: string[]) => {
	const slideContainer = fromHtml(
		`<ul class="swifty-slider__slide-container"></ul>`
	);
	const slides: HTMLElement[] = [];

	images.forEach((img) => {
		const slide = fromHtml(`
			<li class="swifty-slider__slide-container__slide">
				<img src="assets/slides/${img}" alt="Баннер"/>
			</li>
		`);

		slideContainer.append(slide);
		slides.push(slide);
	});

	return { container: slideContainer, slides: slides };
};

const createDotContainer = (images: string[], sl: Slider) => {
	const dotContainer = fromHtml(
		`<ul class="swifty-slider__dot-container"></ul>`
	);

	const dots: HTMLElement[] = [];

	images.forEach((img, i) => {
		const isActive = i === 0 ? "is-active" : "";
		const dot = fromHtml(
			`<li class="swifty-slider__dot-container__dot ${isActive}"></li>`
		);
		dot.onclick = () => {
			sl.setSlide(i);
		};
		dotContainer.append(dot);
		dots.push(dot);
	});

	return { container: dotContainer, dots: dots };
};
