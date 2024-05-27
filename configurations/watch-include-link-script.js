/* eslint-disable @typescript-eslint/no-var-requires */
// Функция для поиска и извлечения href из.link.pug файлов
const fs = require('node:fs');
const path = require('node:path');
const paths = require('./paths');

const result = {};
function extractPaths(filePath, isLink) {
	const content = fs.readFileSync(filePath, 'utf8');
	const regexHref = isLink ? /link[^]*?href="\/([^"]+)"/g : /script[^]*?src="\/([^"]+)"/g;
	let matches = [];
	let match;

	while ((match = regexHref.exec(content)) !== null) {
		matches.push(match[1]);
	}

	return matches;
}

function DDD(path) {
	const parts = path.split('/');
	const fileNameWithoutExtension = parts.pop();
	return fileNameWithoutExtension.split('.')[0];
}

// Основная функция для обработки файлов
function watchIncludeLinkScript(directoryWatch) {
	const files = fs.readdirSync(directoryWatch);

	files.forEach((file) => {
		// Получаем полный путь к файлу/папке
		const filePath = path.join(directoryWatch, file);
		// Проверяем, является ли это файлом или папкой
		const isDirectory = fs.statSync(filePath).isDirectory();

		if (isDirectory) {
			// Если это папка, рекурсивно вызываем функцию traverseDirectory для этой папки
			watchIncludeLinkScript(filePath);
		} else {
			if (file.endsWith('.link.pug')) {
				const filePath = path.join(directoryWatch, file);
				const hrefs = extractPaths(filePath, true);

				hrefs.forEach((href) => {
					// Предполагаем, что имя файла может быть использовано как часть пути
					const key = `${DDD(href)}`;
					if (!result[key]) {
						result[key] = [];
					}
					if (!result[key].includes(paths.src + '/' + href)) {
						result[key].push(paths.src + '/' + href); // Добавляем href в массив
					}
				});
			} else if (file.endsWith('.script.pug')) {
				const filePath = path.join(directoryWatch, file);
				const srcs = extractPaths(filePath);

				srcs.forEach((src) => {
					// Предполагаем, что имя файла может быть использовано как часть пути
					const key = `${DDD(src)}`;
					if (!result[key]) {
						result[key] = [];
					}

					if (!result[key].includes(paths.src + '/' + src)) {
						result[key].push(paths.src + '/' + src); // Добавляем src в массив
					}
				});
			}
		}
	});

	return result;
}

module.exports = watchIncludeLinkScript;
