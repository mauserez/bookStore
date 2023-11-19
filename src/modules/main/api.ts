import axios from "axios";

export type ApiOptions = {
	q?: string;
	printType?: string;
	startIndex?: number;
	maxResults?: number;
	langRestrict?: string;
};

export type ApiResponse = {
	id: string;
	volumeInfo: {
		authors: string[];
		averageRating?: number;
		description: string;
		imageLinks: {
			thumbnail?: string;
		};
		language: string;
		ratingsCount?: number;
		title: string;
	};
	saleInfo: {
		retailPrice?: {
			amount: number;
			currencyCode: string;
		};
	};
};

export const getItems = async (options: ApiOptions) => {
	const params: ApiOptions = {};

	params.q = options.q ? options.q : "subject:Architecture";
	params.printType = options.printType ? options.printType : "books";
	params.startIndex = options.startIndex ? options.startIndex : 0;
	params.maxResults = 6;
	params.langRestrict = options.langRestrict ? options.langRestrict : "en";

	const paramsUrl = new URLSearchParams(<URLSearchParams>params);
	const url = `https://www.googleapis.com/books/v1/volumes?key=AIzaSyA_vUOjpF1u1m-8dFbUS0-G5W6bRnSDBpI&${paramsUrl}`;

	return await axios
		.get(url)
		.then((response) => {
			const res: ApiResponse[] = response.data.items;
			return res;
		})
		.catch((error) => {
			return [];
		});
};
