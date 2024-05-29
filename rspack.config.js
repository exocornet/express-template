/* eslint-disable @typescript-eslint/no-var-requires */
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const magicImporter = require('node-sass-magic-importer');
const { CssExtractRspackPlugin, CopyRspackPlugin, SwcJsMinimizerRspackPlugin } = require('@rspack/core');
const watchIncludeLinkScript = require('./configurations/watch-include-link-script');
// const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const optionsMinimizer = [
	new SwcJsMinimizerRspackPlugin({
		test: /\.js(\?.*)?$/i,
		terserOptions: {
			format: {
				comments: false,
			},
		},
		extractComments: false,
		parallel: true,
	}),
	// import('imagemin').then((imagemin) => {
	// 	import('imagemin-webp').then((imageminWebp) => {
	// 		// Оптимизация и конвертация изображений
	// 		imagemin
	// 			.default(['test/images/**/*.{jpg,png}'], {
	// 				destination: 'dist/images',
	// 				plugins: [
	// 					imageminWebp.default({
	// 						quality: 100,
	// 					}),
	// 				],
	// 			})
	// 			.then(() => {
	// 				console.log('Images have been processed successfully.');
	// 			})
	// 			.catch((error) => {
	// 				console.error('An error occurred during image processing:', error);
	// 			});
	// 	});
	// }),
];

module.exports = (options) => {
	const { isDev, isProd, paths } = options;
	const plugins = [];

	plugins.push(
		new CopyRspackPlugin({
			patterns: [
				{
					from: 'public/fake-api',
					to: 'assets/fake-api',
				},
			],
		}),
		new CopyRspackPlugin({
			patterns: [
				{
					from: 'public/media',
					to: 'assets/',
				},
			],
		}),
		new CopyRspackPlugin({
			patterns: [
				{
					from: 'src/app/favicon.svg',
				},
			],
		})
	);

	plugins.push(
		new CssExtractRspackPlugin({
			filename: 'css/[name].css',
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
			extensions: ['js', 'ts'],
			fix: true,
			failOnError: false,
			quiet: true,
		})
	);

	return {
		// cache: isDev ? { type: 'memory' } : false,
		cache: false,
		experiments: {
			css: false, // Отключаем экспериментальную функциональность CSS
		},
		context: __dirname,
		mode: isDev ? 'development' : 'production',
		entry: {
			main: ['./src/app/main.ts', './src/app/main.scss'],
			...watchIncludeLinkScript(paths.pages),
			// 'css/main': './src/app/main.scss',
		},
		output: {
			path: isDev ? `${paths.dist}` : `${paths.build}`,
			filename: 'js/[name].js',
			publicPath: isDev ? '/' : '/',
			clean: true,
		},
		resolve: {
			extensions: ['.js', '.tsx', '.ts'],
			alias: {
				IMAGES: `${paths.images}`,
				VIDEO: `${paths.video}`,
				AUDIO: `${paths.audio}`,
				FONTS: `${paths.fonts}`,
				ENTITIES: `${paths.entities}`,
				WIDGETS: `${paths.widgets}`,
				PAGES: `${paths.pages}`,
				// FAVICON: VARIABLES.FAVICON,
			},
		},
		// 'eval-source-map'
		devtool: isDev ? 'inline-source-map' : false,
		// devServer: {
		// 	static: './build',
		// 	client: {
		// 		progress: true,
		// 		overlay: {
		// 			errors: true,
		// 			warnings: false,
		// 		},
		// 	},
		// 	historyApiFallback: true,
		// 	compress: true,
		// 	hot: true,
		// 	watchFiles: 'src/**/*',
		// },
		module: {
			rules: [
				{
					test: /\.(js|jsx|ts|tsx)$/,
					loader: 'builtin:swc-loader',
					options: {
						jsc: {
							parser: {
								syntax: 'typescript',
							},
							// externalHelpers: true,
							transform: {
								react: {
									runtime: 'automatic',
									development: isDev,
									refresh: isDev,
								},
							},
						},
					},
					exclude: /node_modules/,
				},
				{
					test: /\.(jpe?g|png|gif|svg|webp)$/i,
					exclude: /fonts/,
					type: 'asset/resource',
					generator: {
						filename: 'assets/images/[name][ext]',
					},
				},
				{
					test: /\.(mp4|webm)$/i,
					type: 'asset/resource',
					generator: {
						filename: 'assets/video/[name][ext]',
					},
				},
				{
					test: /\.(mp3)$/i,
					type: 'asset/resource',
					generator: {
						filename: 'assets/audio/[name][ext]',
					},
				},
				{
					test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
					exclude: /media/,
					type: 'asset/resource',
					generator: {
						filename: 'fonts/[name][ext]',
					},
				},
				{
					test: /\.(s[ac]ss|css)$/i,
					// type: 'css',
					use: [
						{
							loader: CssExtractRspackPlugin.loader,
							// options: {
							// 	esModule: false,
							// 	emit: false,
							// },
						},
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
							},
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: isDev,
								sassOptions: {
									importer: magicImporter(),
								},
							},
						},
					],
				},
			],
		},
		optimization: {
			minimize: isProd,
			minimizer: isProd ? optionsMinimizer : [],
		},
		plugins,
	};
};
