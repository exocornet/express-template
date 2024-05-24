/* eslint-disable @typescript-eslint/no-var-requires */
const PugLintPlugin = require('puglint-webpack-plugin');
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const magicImporter = require('node-sass-magic-importer');
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const PugPlugin = require('pug-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const beautifyHtml = require('js-beautify').html;
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

module.exports = (options) => {
	const { isDev, isProd, paths } = options;

	plugins.push(
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'public/fake-api',
					to: 'assets/fake-api',
				},
			],
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'public/media',
					to: 'assets/',
				},
			],
		})
	);

	plugins.push(
		new PugPlugin({
			js: {
				filename: 'js/[name].js',
			},
			css: {
				filename: 'css/[name].css',
			},
			data: {
				isDev,
				// [START] ===> переменные окружения
				isWebpack: true,
				// <=== [END] переменные окружения
			},
			// loaderOptions: {
			// 	sources: [
			// 		{
			// 			tag: 'img',
			// 			filter: ({ attribute }) => attribute !== 'src',
			// 		},
			// 		{
			// 			tag: 'source',
			// 			filter: ({ attribute }) => attribute !== 'srcset',
			// 		},
			// 	],
			// },
			postprocess(content) {
				if (isProd) {
					return beautifyHtml(content, {
						indent_size: 2,
						indent_char: ' ',
						indent_with_tabs: true,
						editorconfig: true,
					});
				}
			},
		}),

		new PugLintPlugin({
			context: 'src',
			files: '**/*.pug',
			config: Object.assign({ emitError: true }, require('./.pug-lintrc.json')),
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
		cache: isDev ? { type: 'memory' } : false,
		mode: isDev ? 'development' : 'production',
		entry: {
			'list-pages': 'src/app/list-pages/list-pages.pug',
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
					use: [
						{
							loader: 'swc-loader',
							options: {
								swcrc: true,
							},
						},
					],
					exclude: /node_modules/,
					// type: 'asset/resource',
					// generator: {
					// 	filename: 'js/[name].js',
					// },
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
					// type: 'asset/resource',
					// generator: {
					// 	filename: 'css/[name].css',
					// },
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
		plugins: plugins,
	};
};
