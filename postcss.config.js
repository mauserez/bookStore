const path = require("path");

const config = {
	plugins: [
		require("postcss-import"),
		require("postcss-simple-vars"),
		require("autoprefixer"),
		require("postcss-nested"),
		require("postcss-mixins"),
		require("postcss-reporter"),
		require("postcss-preset-env"),
		require("cssnano"),
	],
};

module.exports = config;
