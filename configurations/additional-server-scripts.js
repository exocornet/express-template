/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const PugLintPlugin = require('puglint-webpack-plugin/lib/linter');

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
		config: Object.assign({ emitError: true }, require('../.pug-lintrc.json')),
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

module.exports = { replacementSCSSAndTS, PugLinter };
