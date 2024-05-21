/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const fs = require('node:fs');
const readline = require('node:readline');

// Получаем аргументы командной строки
const [, ,] = process.argv;

// Создаем интерфейс для чтения ввода пользователя
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Запрашиваем ввод строки у пользователя
rl.question('Введите название страниц через запятую: ', (data) => {
	// Объединяем элементы массива в одну строку
	const textFile = `module.exports = [${data
		.split(',')
		.map((item) => `'${item.trim()}'`)
		.join(', ')}];`;

	// Записываем данные в файл
	fs.writeFile('configurations/incremental-pages-watch.js', textFile, (err) => {
		if (err) {
			console.error('Ошибка при записи в файл:', err);
		} else {
			console.log('Файл сформирован');
		}

		// Закрываем интерфейс чтения ввода
		rl.close();
	});
});
