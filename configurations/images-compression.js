/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('node:fs');
const path = require('node:path');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');

function imagesCompression(inputDirectory, extensions) {
	fs.readdirSync(inputDirectory).forEach((file) => {
		const FILE_PATH = path.join(inputDirectory, file);
		const STAT = fs.statSync(FILE_PATH);
		const NAME_FILE = FILE_PATH.split('/')
			.pop()
			.replace(/\.[^.]*$/, '');

		if (STAT.isDirectory()) {
			imagesCompression(FILE_PATH, extensions); // Рекурсивный вызов для подпапок
		} else if (STAT.isFile() && extensions.includes(path.extname(FILE_PATH)) && !/^_/.test(NAME_FILE)) {
			const SAVE_PATH = FILE_PATH.substring(0, FILE_PATH.lastIndexOf('/'));

			import('imagemin').then((imagemin) => {
				import('imagemin-mozjpeg').then((imageminMozjpeg) => {
					import('imagemin-svgo').then((imageminSvgo) => {
						imagemin.default([`${FILE_PATH}`], {
							destination: `${SAVE_PATH}`,
							plugins: [
								imageminGifsicle({ interlaced: true }),
								imageminPngquant({
									optimizationLevel: 6,
								}),
								imageminMozjpeg.default({ quality: 85 }),
								imageminSvgo.default({
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
								}),
							],
						});
					});
				});
			});

			process.stderr.write(FILE_PATH + '\n');
		}
	});
}

imagesCompression('public/media/images', ['.png', '.jpeg', '.jpg', '.svg', '.gif']);
process.stderr.write('\n' + 'ФАЙЛЫ КАРТИНОК БЫЛИ СЖАТЫ' + '\n');
