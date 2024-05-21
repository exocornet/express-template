/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('node:path');

const PAGES_OBJECT = {
	'index': 'Главная',
	'catalog': 'Каталог',
	'search': 'Поиск',
	'lk': 'Личный кабинет',
	'lk-your-company': 'Ваша компания',
	'lk-orders-history': 'История заказов',
	'lk-order-detailed': 'Детальная заказа',
	'error': 'Страница ошибок',
};

module.exports = {
	names: (page) => {
		return PAGES_OBJECT[path.basename(page, '.pug')] || 'name page';
	},
};
