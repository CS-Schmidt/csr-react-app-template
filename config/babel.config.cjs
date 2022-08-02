'use strict';
var path = require('path');

var isProduction = process.env.NODE_ENV == 'production';

module.exports = function generateConfig({ cache }) {
	cache(true);
	var presets = [
		[
			'@babel/preset-env',
			{
				useBuiltIns: 'usage',
				corejs: '3.24.1',
				configPath: path.resolve('.browserslistrc'),
			},
		],
		'@babel/preset-react',
	];

	var plugins = isProduction ? null : ['react-refresh/babel'];

	return { presets, plugins };
};
