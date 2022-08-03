'use strict';
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
var ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

var isProduction = process.env.NODE_ENV == 'production';
var maxInlineSize = 8192; // 8192KB

module.exports = function generateConfig() {
	return {
		mode: isProduction ? 'production' : 'development',
		// Sets the environments you want your builds to support.
		target: `browserslist:${path.join(__dirname, '.browserslistrc')}`,
		// Controls what bundle information gets displayed to the console at
		// build time.
		stats: 'normal',
		// Sets the base directory for resolving entry points and loaders
		// from the configuration.
		context: path.join(__dirname, '../'),
		// An entry point indicates which module should be used to begin
		// building out its internal dependency graph.
		entry: {
			index: path.join(__dirname, '../src/index.jsx'),
		},
		// The output property tells webpack where to emit the bundles it
		// creates and how to name these files.
		output: {
			// Sets the path that webpack builds to.
			path: path.join(__dirname, '../dist/'),
			// Tells webpack if it should include comments in bundles with
			// information about contained modules.
			pathinfo: !isProduction,
			...(isProduction
				? {
						// Specifies the url where your app is being served from.
						// This path will be used to resolve the urls in HTML files
						// at build time. Set this to the location of your public
						// directory when you deploy.
						publicPath: path.join(__dirname, '../public/'),
				  }
				: null),
			// Sets the filename of "initial" chunk files.
			filename: isProduction
				? '[name].[contenthash].bundle.js'
				: '[name].bundle.js',
			// Sets the filename of "non-initial" chunk files.
			chunkFilename: isProduction
				? '[name].[contenthash].bundle.js'
				: '[name].bundle.js',
			// Sets the name of asset modules.
			assetModuleFilename: '[name].[hash][ext]',
			// Cleans the build directory before each build.
			clean: true,
		},
		// Alters how modules are resolved.
		resolve: {
			extensions: ['.js', '.jsx', '.css'],
		},
		...(isProduction
			? null
			: {
					// Sets configuration for webpack-dev-server tool.
					devServer: {
						port: 3000,
						// Enables gzip compression for everything served.
						compress: true,
						// Opens default browser after the server has been started.
						open: true,
						// Enables webpack's hot module replacement feature.
						hot: true,
						client: {
							// Sets logging level from server in client's browser.
							logging: 'info',
						},
					},
			  }),
		// Controls if and how source maps are generated.
		devtool: isProduction ? false : 'eval-source-map',
		// Configures additional optimizations to apply during builds.
		optimization: {
			minimizer: ['...', new CssMinimizerPlugin()],
		},
		// The module property determines how the different kinds of
		// "modules" within a project will be treated.
		module: {
			rules: [
				{
					test: /\.([cm]js|js?x)$/i,
					exclude: /node_modules/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								configFile: path.join(__dirname, 'babel.config.cjs'),
							},
						},
					],
				},
				{
					test: /\.css$/i,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									config: path.join(__dirname, 'postcss.config.cjs'),
								},
							},
						},
					],
				},
				{
					test: /\.avif$/i,
					type: 'asset',
					mimetype: 'image/avif',
					parser: {
						dataUrlCondition: maxInlineSize,
					},
				},
				{
					test: /\.(bmp|gif|jpeg|png|svg)$/i,
					type: 'asset',
					generator: {
						filename: 'images/[name].[hash][ext]',
					},
					parser: {
						dataUrlCondition: {
							maxSize: maxInlineSize,
						},
					},
				},
				{
					test: /\.(woff2?|eot|ttf|otf)$/i,
					type: 'asset',
					generator: {
						filename: 'fonts/[name].[hash][ext]',
					},
					parser: {
						dataUrlCondition: {
							maxSize: maxInlineSize,
						},
					},
				},
			],
		},
		plugins: isProduction
			? [
					new HtmlWebpackPlugin({
						filename: '[name].[contenthash].html',
						template: path.join(__dirname, '../src/index.html'),
					}),
					new MiniCssExtractPlugin({
						filename: '[name].[contenthash].bundle.css',
						chunkFilename: '[name].[contenthash].bundle.css',
					}),
					new CompressionPlugin(),
					new BundleAnalyzerPlugin({
						analyzerMode: 'static',
						reportFilename: path.join(__dirname, '../log/build-report.html'),
						openAnalyzer: false,
					}),
			  ]
			: [
					new HtmlWebpackPlugin({
						filename: '[name].html',
						template: path.join(__dirname, '../src/index.html'),
					}),
					new MiniCssExtractPlugin({
						filename: '[name].bundle.css',
						chunkFilename: '[name].bundle.css',
					}),
					new ReactRefreshWebpackPlugin(),
			  ],
	};
};
