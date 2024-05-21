/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('node:fs');
const path = require('node:path');
const DIR_IMAGES = fs.readdirSync(path.join(__dirname, '../src/app/assets/favicons/'));

const faviconFile = DIR_IMAGES.find(function (file) {
	return file.startsWith('favicon');
});
if (!faviconFile) {
	process.stderr.write('\x1b[31mФайл с favicon не найден! \n Добавьте в директорию по пути app/assets/img\x1b[0m\n');
}

module.exports = {
	src: path.resolve(__dirname, './src'),
	build: path.resolve(__dirname, './build'),
	dist: path.resolve(__dirname, './dist'),
	page: path.resolve(__dirname, './page'),
	images: path.join(__dirname, '../src/app/public/media/'),
	video: path.join(__dirname, '../src/app/assets/video/'),
	audio: path.join(__dirname, '../src/app/assets/audio/'),
	fonts: path.join(__dirname, '../src/app/assets/fonts/'),
	components: path.join(__dirname, '../src/components/'),
	sections: path.join(__dirname, '../src/sections/'),
	favicon: path.join(__dirname, `../src/app/assets/favicons/${faviconFile}`),
};
