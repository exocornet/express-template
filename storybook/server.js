/* eslint-disable @typescript-eslint/no-var-requires, no-console*/
const express = require('express');
const router = express.Router();
const os = require('node:os');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const open = require('open');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
let port = process.env.PORT || 9000;

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

// # СОЗДАНИЕ ПЕРЕМЕННЫХ ДЛЯ APP # //
const app = express();
const config = require('./webpack.config.js');
const path = require('node:path');
const compiler = webpack(config());

// # НАСТРОЙКА И ПОДКЛЮЧЕНИЕ WEBPACK'а # //
app.use(
	webpackDevMiddleware(compiler, {
		publicPath: config().output.publicPath,
		writeToDisk: true,
		stats: {
			children: true,
			errorDetails: true,
			loggingDebug: ['sass-loader'],
		},
	})
);

// # РЕДИРЕКТ НА STORYBOOK # //
router.get('/', function (req, res) {
	// PugLinter(res, './storybook', { isPageReload: true, isWebpack: false, filesStory });
	// res.render('/storybook.html');
	res.sendFile(path.join(__dirname, 'dist', 'storybook.html'));
});

// # ОПРЕДЕЛЕНИЕ МАРШРУТОВ ДЛЯ ЗАПРОСОВ # //
app.use(router);

// # СОЗДАНИЕ СЕРВЕРА # //
const server = createServer(app);
const io = new Server(server);
compiler.hooks.done.tap('reloadPage', function () {
	io.emit('webpackUpdate');
});

// # ЗАПУСК СЕРВЕРА # //
const SERVER_START = server.listen(port, () => {
	console.log(`Loopback: http://localhost:${port}`);
	console.log(`On Your Network (IPv4): http://${IPv4}:${port}`);
	open(`http://localhost:${port}`);
});

// # ОБРАБОТКА ОШИБОК # //
server.on('error', (err) => {
	if (err.code === 'EADDRINUSE') {
		SERVER_START.listen(++port);
	}
});
