/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('node:fs');
const readline = require('node:readline');
const path = require('node:path');
require('colors');

let apiDataENV = null;
try {
	apiDataENV = fs.readFileSync(path.resolve(__dirname, './apiENV.json'), 'utf8');
} catch {
	apiDataENV = false;
}
const apiENV = apiDataENV && JSON.parse(apiDataENV);

function getFetch(tokenAPI, projectId) {
	const gitlabApiUrl = `https://git.zaryad.tech/api/v4/projects/${projectId}/variables/ENV_LOC_ARG`;

	process.stderr.write('Tокен GitLab: '.green + `${tokenAPI}\n`);
	process.stderr.write('Идентификатор GitLab: '.green + `${projectId}\n`);
	process.stderr.write('Ссылка на переменную GitLab: '.green + `${gitlabApiUrl}\n\n`);

	fetch(gitlabApiUrl, {
		method: 'GET',
		headers: {
			'PRIVATE-TOKEN': tokenAPI,
		},
	})
		.then((response) => {
			if (!response.ok) {
				process.stderr.write('сформирован неверный путь до переменной перепроверьте введенные данные'.bgRed + '\n');
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then((data) => {
			const variableValue = data.value;
			fs.writeFileSync('.env', variableValue);
			process.stderr.write('env файл создан и обновлен'.bgBrightGreen.bold + '\n');
		})
		.catch((error) => {
			process.stderr.write('Ошибка при получении переменной:'.red, error);
		});
}

if (apiENV.token && apiENV.projectId) {
	getFetch(apiENV.token, apiENV.projectId);
} else {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question('Введите личный токен доступа GitLab: '.green, (token) => {
		rl.question('Введите идентификатор проекта в GitLab: '.green, (projectId) => {
			if (token && projectId) {
				process.stderr.write(
					'\n' +
						'Вы можете создать файл apiENV.json для хранения личного токена GitLab и идентификатора проекта'.bgBlue +
						'\n\n'
				);

				rl.question('Создать файл apiENV.json? (Y/N): ', (answer) => {
					if (answer.toUpperCase() === 'Y') {
						fs.writeFileSync(
							path.resolve(__dirname, './apiENV.json'),
							`{"token": "${token}", "projectId": ${projectId}}`
						);
						process.stderr.write('Файл apiENV.json создан'.bgBrightGreen + '\n\n');
					}

					rl.close();

					getFetch(token, projectId);
				});
			} else {
				process.stderr.write('Не указан личный токен или идентификатор проекта'.bgRed + '\n');

				rl.close();
			}
		});
	});
}
