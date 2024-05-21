declare module '*.pug' {
	const template: (locals?: object) => string;
	export default template;
}
