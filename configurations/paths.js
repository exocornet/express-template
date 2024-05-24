/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('node:fs');
const path = require('node:path');
const DIR_IMAGES = fs.readdirSync(path.join(__dirname, '../src/app/'));

const faviconFile = DIR_IMAGES.find(function (file) {
	return file.startsWith('favicon');
});
if (!faviconFile) {
	process.stderr.write('\x1b[31mФайл с favicon не найден! \n Добавьте в директорию по пути app/assets/img\x1b[0m\n');
}

module.exports = {
	src: path.resolve(__dirname, '../src'),
	build: path.resolve(__dirname, '../build'),
	public: path.resolve(__dirname, '../public'),
	dist: path.resolve(__dirname, '../dist'),

	/* пересмотреть актуальность данных переменных: images, video, audio */
	images: path.join(__dirname, '../src/app/assets/img/'),
	video: path.join(__dirname, '../src/app/assets/video/'),
	audio: path.join(__dirname, '../src/app/assets/audio/'),
	fonts: path.join(__dirname, '../public/fonts/'),

	entities: path.join(__dirname, '../src/entities/'),
	widgets: path.join(__dirname, '../src/widgets/'),
	pages: path.join(__dirname, '../src/pages/'),

	favicon: path.join(__dirname, `../src/app/${faviconFile}`),
};
