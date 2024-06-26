/* eslint-disable @typescript-eslint/no-var-requires */
// # ПЕРЕМЕННЫЕ NODE.JS # //
const os = require('node:os');
const { createServer } = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// # ПЕРЕМЕННЫЕ ПАКЕТОВ И ПЛАГИНОВ # //
const { router, express } = require('./routes.js');
const webpack = require('webpack');
const chokidar = require('chokidar');
const webpackDevMiddleware = require('webpack-dev-middleware');
const open = require('open');
const { Server } = require('socket.io');
const PugLintPlugin = require('puglint-webpack-plugin/lib/linter.js');
const beautifyHtml = require('js-beautify').html;
// const webpackHotMiddleware = require('webpack-hot-middleware');
// app.use(webpackHotMiddleware(compiler));

// # ПЕРЕМЕННЫЕ ПРОЕКТА # //
let port = process.env.PORT || 8000;
const { names: namePages } = require('./src/app/list-pages/namePages');
const paths = require('./configurations/paths');
// const creatingFilesForWebpack = require('./configurations/creating-files-for-webpack');
const VARIABLES = require('./configurations/variables');
const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'watch';
const isProd = !isDev;

// const watcher = chokidar.watch(`${paths.src}/pages`, {
// 	persistent: true,
// });
//
// ['ready', 'change'].forEach((event) => {
// 	watcher.on(event, () => {
// 		creatingFilesForWebpack(`${paths.src}/pages`, '.link.pug', 'link');
// 		creatingFilesForWebpack(`${paths.src}/pages`, '.script.pug', 'script');
// 	});
// });

// # СОЗДАНИЕ ПЕРЕМЕННЫХ ДЛЯ APP # //
const app = express();

/* можно заменить app на router, но требуется детальное изучение так как типы express говорят об неактуальности router */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const config = require('./webpack.config.js');

// # ПОДКЛЮЧЕНИЕ PUG В СРЕДЕ EXPRESS # //
app.set('views', `${paths.src}`);
app.set('view engine', 'pug');

let links = [];
let incrementalPagesWatch = null;
try {
	incrementalPagesWatch = require('./configurations/incremental-pages-watch');
} catch {
	incrementalPagesWatch = false;
}
const arrPages = process.env.NODE_ENV === 'watch' ? incrementalPagesWatch : fs.readdirSync(`${paths.src}/pages/`);

function replacementSCSSAndTS(htmlContent) {
	// Регулярное выражение для поиска <link> тегов с href, заканчивающимся на.scss
	const regexLink = /<link[^>]*?href="\/([^"]+\.scss)[^>]*?>/g;
	const regexScript = /<script[^>]*?src="\/([^"]+\.ts)[^>]*?>/g;

	// Функция для замены найденных совпадений
	function replacer(match, p1) {
		// ## Разбиваем путь на части и получаем имя файла без расширения ## //
		const PATH_PARTS_ARR = p1.split('/');
		const FILE_NAME_WITH_EXTENSION = PATH_PARTS_ARR.pop();
		const FILE_NAME = FILE_NAME_WITH_EXTENSION.split('.')[0];

		// ## Возвращаем новый тег с измененным путем ## //
		let newTag = `<link href="/css/${FILE_NAME}.css" rel="stylesheet" />`;
		if (FILE_NAME_WITH_EXTENSION.split('.')[1] === 'ts') {
			newTag = `<script src="/js/${FILE_NAME}.js" defer>`;
		}

		return newTag;
	}

	// ## Заменяем все найденные совпадения ## //
	htmlContent = htmlContent.replace(regexLink, replacer);
	htmlContent = htmlContent.replace(regexScript, replacer);

	return htmlContent;
}

function PugLinter(res, path, options) {
	PugLintPlugin({
		context: 'src',
		files: '**/*.pug',
		config: Object.assign({ emitError: true }, require('./.pug-lintrc.json')),
	}).then((errors) => {
		if (errors) {
			const htmlText = errors.replaceAll('[90m', '<b style="color:red;">').replaceAll('[39m', '</b>');
			res.send(`<pre>${htmlText}</pre>`);
			process.stderr.write(errors);
		} else {
			res.render(path, { ...options }, function (err, html) {
				if (err) {
					process.stderr.write(err);
					throw new Error('Something went wrong in render');
				} else {
					html = replacementSCSSAndTS(html);
					res.send(html);
				}
			});
		}
	});
}

const compiler = webpack(config({ isDev, isProd, paths, links, VARIABLES }));
arrPages.forEach((dirPage) => {
	if (isDev) {
		// # ROUTER СТРАНИЦЫ # //
		router.get(`/${dirPage}`, function (req, res) {
			PugLinter(res, `./pages/${dirPage}/${dirPage}`);
		});

		// # ПЕРЕАДРЕСАЦИЯ СТРАНИЦЫ ПРИ ДОБАВЛЕНИЕ В КОНЦЕ СЛЭША ("/") # //
		app.use((req, res, next) => {
			if (req.path === `/${dirPage}/`) {
				res.redirect(301, `/${dirPage}`);
			} else {
				next();
			}
		});
	}

	if (isProd) {
		// # BUILD СТРАНИЦ С ПОМОЩЬЮ EXPRESS # //
		compiler.hooks.done.tap('buildPages', function () {
			app.render(
				`${paths.src}/pages/${dirPage}/${dirPage}.pug`,
				{ pretty: true, compileDebug: true },
				function (err, html) {
					if (err) {
						process.stderr.write(err);
						throw new Error('Something went wrong in render');
					} else {
						html = replacementSCSSAndTS(html);
						const htmlPretty = beautifyHtml(html, {
							indent_size: 2,
							indent_char: ' ',
							indent_with_tabs: true,
							editorconfig: true,
						});

						fs.writeFileSync(path.join(`${paths.build}`, `${dirPage}.html`), htmlPretty, 'utf8');

						process.stderr.write(`Build page ${dirPage}\n`);
					}
				}
			);
		});
	}

	let arrPage = [];
	if (path.extname(dirPage) === '') {
		arrPage = fs.readdirSync(`${paths.src}/pages/${dirPage}/`);
	}

	arrPage.forEach((page) => {
		if (path.extname(page) === '.pug') {
			// Создание объекта с данными страниц
			links.push({
				link: `./${dirPage}`,
				title: dirPage,
				name: `${namePages(page)}`,
			});
		}
	});
});

// # НАСТРОЙКА И ПОДКЛЮЧЕНИЕ WEBPACK'а # //
app.use(
	webpackDevMiddleware(compiler, {
		publicPath: isDev ? '/' : './',
		writeToDisk: isProd,
		stats: {
			children: true,
			errorDetails: true,
			loggingDebug: ['sass-loader'],
		},
	})
);

// # ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ДЛЯ PUG ШАБЛОНОВ # //
app.locals = {
	isDev,
	// [START] ===> переменные окружения
	isServer: true,
	// <=== [END] переменные окружения
	// [START] ===> переменные фавиконки
	FAVICON: VARIABLES.FAVICON,
	FAVICON_TYPE: VARIABLES.FAVICON_TYPE,
	// переменные фавиконки <=== [END]
	media: VARIABLES.MEDIA,
	listLinks: links,
	// jsPath: isDev ? './assets/js' : './assets/js',
	// cssPath: isDev ? './assets/css' : './assets/css',
};

// # ROUTES ДЛЯ СТРАНИЦ INDEX И LIST-PAGES (в порядке исключения) # //
router.get('/', function (req, res) {
	PugLinter(res, './pages/index/index');
});

router.get('/list-pages', function (req, res) {
	PugLinter(res, './app/list-pages/list-pages');
});

// # ОПРЕДЕЛЕНИЕ МАРШРУТОВ ДЛЯ ЗАПРОСОВ # //
app.use(router);

// # СОЗДАНИЕ СЕРВЕРА # //
const server = createServer(app);
const io = new Server(server);
compiler.hooks.done.tap('reloadPage', function () {
	// io.emit('webpackUpdate');

	if (isProd) {
		setTimeout(() => {
			process.stderr.write('\n\x1b[32mBUILD COMPLETED SUCCESSFULLY\x1b[0m\n\n');
			process.exit(0);
		}, 0);
	}
});

if (isDev) {
	const watcher = chokidar.watch(__dirname + '/src');
	// Отслеживайте изменения в файлах Pug и перезагружайте страницу
	watcher.on('change', () => {
		io.emit('webpackUpdate');
	});

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
	const SERVER_START = server.listen(port, () => {
		process.stderr.write(`Loopback: http://localhost:${port}\n`);
		process.stderr.write(`On Your Network (IPv4): http://${IPv4}:${port}\n\n`);
		open(`http://localhost:${port}/list-pages`);
	});

	// # ОБРАБОТКА ОШИБОК # //
	server.on('error', (err) => {
		if (err.code === 'EADDRINUSE') {
			SERVER_START.listen(++port);
		}
	});
}
