/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Получаем аргументы командной строки
const [, ,] = process.argv;

// Создаем интерфейс для чтения ввода пользователя
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.question('Введите название страницы: ', (name) => {
	const dir = `./src/pages/${name}`;

	// Проверка существования папки
	if (!fs.existsSync(dir)) {
		// Создание папки
		fs.mkdirSync(dir);
		createIncludedDirs(dir, name);
		console.log('Страница создана.');
		rl.close();
	} else {
		console.log('Страница уже существует.');
		rl.close();
	}
});

function createIncludedDirs(dir, name) {
	// создание папки стора
	const storeDir = path.join(dir, 'store');
	// создание папки ассетов
	const stylesAndScriptsDir = path.join(dir, 'styles-and-scripts');
	// добавление папок
	fs.mkdirSync(storeDir);
	fs.mkdirSync(stylesAndScriptsDir);

	// создание store главного файла страницы
	fs.appendFile(`${storeDir}/${name}.store.pug`, '-\n' + '\tconst pageTitle = "";', function (err) {
		if (err) throw err;
	});

	// создание файла скриптов
	fs.appendFile(`${stylesAndScriptsDir}/${name}.script.pug`, '', function (err) {
		if (err) throw err;
	});

	// создание файла стилей
	fs.appendFile(`${stylesAndScriptsDir}/${name}.link.pug`, '', function (err) {
		if (err) throw err;
	});

	// создание файла страницы
	fs.appendFile(`${dir}/${name}.pug`, 'extends ../../shared/helpers/pug/layout', function (err) {
		if (err) throw err;
	});
}
