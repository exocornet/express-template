/* eslint-disable @typescript-eslint/no-var-requires, no-console*/
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const router = express.Router();

// # ОПРЕДЕЛЕНИЕ МАРШРУТОВ ДЛЯ ЗАПРОСОВ # //

// [START] ==> api-fake company
router.get('/company/4', function (req, res) {
	const data = fs.readFileSync(path.join(__dirname, 'src/app/public/fake-api/company.html')).toString();
	res.write(data);
	res.end();
});

router.post('/company', function (req, res) {
	const data = fs.readFileSync(path.join(__dirname, 'src/app/public/fake-api/company.json')).toString();
	res.write(data);
	res.end();
});

router.delete('/company', function (req, res) {
	const data = fs.readFileSync(path.join(__dirname, 'src/app/public/fake-api/company.json')).toString();
	res.write(data);
	res.end();
});
// api-fake company <== [END]

// [START] ==> api-fake company
router.post('/feedback', function (req, res) {
	const data = fs.readFileSync(path.join(__dirname, 'src/app/public/fake-api/feedback.json')).toString();
	res.write(data);
	res.end();
});
// api-fake company <== [END]

// [START] ==> api-fake catalog
router.get('/api/catalog/', function (req, res) {
	const data = fs.readFileSync(path.join(__dirname, 'src/app/public/fake-api/catalogPagination2.json')).toString();
	res.write(data);
	res.end();
});
router.get('/api/catalogPagination/:id', function (req, res) {
	const response = {
		1: 'src/app/public/fake-api/catalogPagination1.json',
		2: 'src/app/public/fake-api/catalogPagination2.json',
		3: 'src/app/public/fake-api/catalogPagination3.json',
	};

	const data = fs.readFileSync(path.join(__dirname, response[req.params.id])).toString();
	res.write(data);
	res.end();
});

router.get('/catalog/product/:id', function (req, res) {
	const data = fs.readFileSync(path.join(__dirname, 'src/app/public/fake-api/catalogModalProduct.html')).toString();
	res.write(data);
	res.end();
});

router.get('/catalog/product-redirect/:id', function (req, res) {
	const data = fs.readFileSync(path.join(__dirname, 'src/app/public/fake-api/catalogModalRedirect.html')).toString();
	res.write(data);
	res.end();
});

router.get('/catalog', (req, res, next) => {
	const queryParams = req.query;
	if (JSON.stringify(queryParams) !== '{}') {
		let data = fs.readFileSync(path.join(__dirname, 'src/app/public/fake-api/catalogFilter.json')).toString();
		res.write(data);
		res.end();
	} else {
		next();
	}
});
// api-fake catalog <== [END]

// [START] ==> api-fake lk-orders-history pagination
router.get('/api/lk-orders-history', function (req, res) {
	const data = fs
		.readFileSync(path.join(__dirname, 'src/app/public/fake-api/lk-orders-history-pagination2.json'))
		.toString();
	res.write(data);
	res.end();
});
router.get('/api/lk-orders-history-pagination/:id', function (req, res) {
	const response = {
		1: 'src/app/public/fake-api/lk-orders-history-pagination1.json',
		2: 'src/app/public/fake-api/lk-orders-history-pagination2.json',
	};

	const data = fs.readFileSync(path.join(__dirname, response[req.params.id])).toString();
	res.json(JSON.parse(data));
});
// api-fake lk-orders-history pagination <== [END]

// [START] ==> api-fake auth
router.post('/auth', function (req, res) {
	const data = fs.readFileSync(path.join(__dirname, 'src/app/public/fake-api/auth.json'));
	res.json(JSON.parse(data));
});
// api-fake auth <== [END]

// [START] ==> api-fake changeData
router.post('/changeData', function (req, res) {
	const data = fs.readFileSync(path.join(__dirname, 'src/app/public/fake-api/changeData.json'));
	res.json(JSON.parse(data));
});
// api-fake auth <== [END]

// [START] ==> cart
router.get('/api/cart', function (req, res) {
	const data = fs.readFileSync(path.join(__dirname, 'src/app/public/fake-api/cartWrapper.html'));
	res.write(data);
	res.end();
});

router.post('/api/cart', function (req, res) {
	const data = req.body;
	res.send(data);
});

router.delete('/api/cart', function (req, res) {
	const data = req.body;
	res.send(data);
});
// cart <== [END]

// [START] ==> create-order
router.post('/create-order', function (req, res) {
	/*const data = req.body;
	console.log(data);
	res.send(data);*/
	const data = fs.readFileSync(path.join(__dirname, 'src/app/public/fake-api/order.json'));
	res.json(JSON.parse(data));
});
// create-order <== [END]

// [START] ==> search
router.get('/search', (req, res, next) => {
	const queryParams = req.query;
	if (JSON.stringify(queryParams) !== '{}') {
		let data = fs.readFileSync(path.join(__dirname, 'src/app/public/fake-api/searchFilter.json')).toString();
		res.write(data);
		res.end();
	} else {
		next();
	}
});
router.get('/api/search-result', function (req, res) {
	const data = fs.readFileSync(path.join(__dirname, 'src/app/public/fake-api/search-result.json'));
	res.json(JSON.parse(data));
});
// search <== [END]

// [START] ==> api-fake auth
router.post('/code', function (req, res) {
	const data = fs.readFileSync(path.join(__dirname, 'src/app/public/fake-api/code.json'));
	res.json(JSON.parse(data));
});
// api-fake auth <== [END]

// # ЭКСПОРТ РОУТЕРА И EXPRESS ДЛЯ ИСПОЛЬЗОВАНИЯ В ОСНОВНОМ ФАЙЛЕ ПРИЛОЖЕНИЯ # //
module.exports = { router, express };
