/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('node:fs');
const path = require('node:path');
const paths = require('./paths');
const PugLintPlugin = require('puglint-webpack-plugin');
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const magicImporter = require('node-sass-magic-importer');
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const PugPlugin = require('pug-plugin');
const postcssSortMediaQueries = require('postcss-sort-media-queries');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const beautifyHtml = require('js-beautify').html;

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'watch';

function findStoryFiles(dir) {
	const dirents = fs.readdirSync(dir);
	const storyFiles = [];

	dirents.forEach((dirent) => {
		const res = path.resolve(dir, dirent);
		if (fs.lstatSync(res).isDirectory()) {
			storyFiles.push(...findStoryFiles(res));
		} else if (dirent.endsWith('.story.js')) {
			const relativePath = `${paths.page}`;
			relativePath ? storyFiles.push(path.relative(relativePath, res)) : storyFiles.push(res);
		}
	});

	return storyFiles;
}

const SCRIPT_FILES_STORY = findStoryFiles(path.join(__dirname, '../src'));

let plugins = [];
const optionsMinimizer = [
	new TerserPlugin({
		test: /\.js(\?.*)?$/i,
		terserOptions: {
			format: {
				comments: false,
			},
		},
		extractComments: false,
		parallel: true,
	}),
	new ImageMinimizerPlugin({
		minimizer: {
			implementation: ImageMinimizerPlugin.imageminMinify,
			options: {
				plugins: [
					['gifsicle', { interlaced: true }],
					['mozjpeg', { quality: 85 }],
					['pngquant', { optimizationLevel: 6 }],
					[
						'svgo',
						{
							plugins: [
								{
									name: 'preset-default',
									params: {
										overrides: {
											removeViewBox: false,
											addAttributesToSVGElement: {
												params: {
													attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
												},
											},
										},
									},
								},
							],
						},
					],
				],
			},
		},
	}),
];

plugins.push(
	new PugPlugin({
		js: {
			filename: 'assets/js/[name].js',
		},
		css: {
			filename: 'assets/css/[name].css',
		},
		data: {
			SCRIPT_FILES_STORY,
			isPageReload: isDev,
			isWebpack: true,
		},
		postprocess(content) {
			return beautifyHtml(content, {
				indent_size: 2,
				indent_char: ' ',
				indent_with_tabs: true,
				editorconfig: true,
			});
		},
	}),

	new PugLintPlugin({
		context: 'src',
		files: '**/*.pug',
		config: Object.assign({ emitError: true }, require('./../.pug-lintrc.json')),
	}),
	new StylelintWebpackPlugin({
		configFile: '.stylelintrc.json',
		context: 'src',
		files: '**/*.scss',
		failOnError: false,
		quiet: false,
	}),
	new ESLintPlugin({
		context: 'src',
		extensions: 'js',
		fix: true,
		failOnError: false,
		quiet: true,
	}),
	new CopyWebpackPlugin({
		patterns: [
			{
				from: paths.images,
				to: 'assets/',
			},
		],
	})
);

module.exports = () => {
	return {
		cache: isDev ? { type: 'memory' } : false,
		mode: isDev ? 'development' : 'production',
		entry: {
			storybook: 'storybook/page/storybook.pug',
		},
		output: {
			path: isDev ? `${paths.dist}` : `${paths.build}`,
			publicPath: isDev ? '/' : './',
			clean: true,
		},
		resolve: {
			extensions: ['.js', '.tsx', '.ts'],
			alias: {
				IMAGES: `${paths.images}`,
				FONTS: `${paths.fonts}`,
				FAVICON: `${paths.favicon}`,
			},
		},
		devtool: isDev ? 'inline-source-map' : false,
		module: {
			rules: [
				{
					test: /\.(js|jsx|ts|tsx)$/,
					use: [
						{
							loader: 'swc-loader',
							options: {
								swcrc: true,
							},
						},
					],
					exclude: /node_modules/,
				},
				{
					test: /\.(jpe?g|png|gif|svg|webp)$/i,
					type: 'asset/resource',
					exclude: /fonts/,
					generator: {
						filename: 'assets/[name][ext]',
					},
				},
				{
					test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
					exclude: /favicons/,
					type: 'asset/resource',
					generator: {
						filename: 'assets/fonts/[name][ext]',
					},
				},
				{
					test: /\.(s[ac]ss|css)$/i,
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: isDev,
							},
						},
						{
							loader: 'postcss-loader',
							options: {
								sourceMap: isDev,
								postcssOptions: {
									plugins: [postcssSortMediaQueries()],
								},
							},
						},
						{
							loader: 'sass-loader',
							options: {
								sassOptions: {
									importer: magicImporter(),
								},
								sourceMap: isDev,
							},
						},
					],
				},
			],
		},
		optimization: {
			minimize: !isDev,
			minimizer: !isDev ? optionsMinimizer : [],
		},
		plugins: plugins,
	};
};
