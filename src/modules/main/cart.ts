const getCartItems = () => {
	const currentItems = localStorage.getItem("itemsInCart") ?? undefined;
	const items = currentItems === undefined ? [] : JSON.parse(currentItems);
	return items;
};

const saveCartItems = (items: []) => {
	localStorage.setItem("itemsInCart", JSON.stringify(items));
};

export const addItemToCart = (itemId: string) => {
	const items = getCartItems();
	items.push(itemId);
	saveCartItems(items);
};

export const removeItemFromCart = (itemId: string) => {
	const items = getCartItems();

	const itemIndex = items.indexOf(itemId);
	if (itemIndex !== -1) {
		items.splice(itemIndex, 1);
	}

	saveCartItems(items);
};

export const checkItemExistsInCart = (itemId: string) => {
	const items = getCartItems();
	const itemIndex = items.indexOf(itemId);

	if (itemIndex === -1 || items.length === 0) {
		return false;
	}

	return true;
};

export const cartItemCounter = () => {
	return getCartItems().length;
};
