/* eslint-disable @typescript-eslint/no-var-requires */
// # ПЕРЕМЕННЫЕ ПРОЕКТА # //
const os = require('node:os');
const open = require('open');
const express = require('express');
const app = express();
const port = 3000;

// # УКАЗЫВАЕМ Express.js ОБСЛУЖИВАТЬ СТАТИЧЕСКИЕ ФАЙЛЫ ИЗ ПАПКИ build # //
app.use(express.static('build'));

// # ОПРЕДЕЛЕНИЕ IPv4 # //
let IPv4 = '';
const networkInterfaces = os.networkInterfaces();
for (const name of Object.keys(networkInterfaces)) {
	for (const netInterface of networkInterfaces[name]) {
		// Проверка на IPv4 адрес и исключение внешних и внутренних адресов
		if (!netInterface.internal && netInterface.family === 'IPv4') {
			IPv4 = netInterface.address;
		}
	}
}

// # ЗАПУСК СЕРВЕРА # //
app.listen(port, () => {
	process.stderr.write(`Loopback: http://127.0.0.1:${port}\n`);
	process.stderr.write(`On Your Network (IPv4): http://${IPv4}:${port}\n\n`);
	open(`http://127.0.0.1:${port}/list-pages.html`);
});
