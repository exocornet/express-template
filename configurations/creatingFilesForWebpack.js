/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('node:fs');
const path = require('node:path');
const paths = require('./paths');

function findFiles(directory, extension, sign) {
	let fileArr = [];
	const directoryArr = fs.readdirSync(directory);

	directoryArr.forEach((dir) => {
		const res = path.resolve(directory, dir);

		if (fs.lstatSync(res).isDirectory()) {
			fileArr.push(...findFiles(res, extension, sign));
		} else if (dir.endsWith(extension)) {
			const data = fs
				.readFileSync(res, 'utf8')
				.split('\n')
				.filter((line) => {
					return line.trim().startsWith(`+${sign}(`);
				});

			fileArr.push(...data);
		}
	});

	return fileArr;
}

function writeFile(arr, sign) {
	fs.writeFileSync(
		path.join(`${paths.src}/app/list-pages`, `include-${sign}.pug`),
		[...new Set(arr)].join('\n') + '\n'
	);
}

function creatingFilesForWebpack(directory, extension, sign) {
	const fileArr = findFiles(directory, extension, sign);
	writeFile(fileArr, sign);
}

module.exports = creatingFilesForWebpack;
