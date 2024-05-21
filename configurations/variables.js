/* eslint-disable @typescript-eslint/no-var-requires */
const paths = require('./paths');
const faviconType = {
	ico: 'image/x-icon',
	png: 'image/png',
	svg: 'image/svg+xml',
	jpg: 'image/jpeg',
	gif: 'image/gif',
};

module.exports = {
	FAVICON_TYPE: `${faviconType[`${paths.favicon.slice(-3)}`]}`,
	FAVICON: paths.favicon,
	MEDIA: {
		xs: '767px',
		md: '1279px',
		lg: '1599px',
		xl: '1919px',
	},
};
