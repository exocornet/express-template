// # ГЛОБАЛЬНЫЕ ТИП ДЛЯ PUG ПОДКЛЮЧЕННЫЙ В JS # //
declare module '*.pug' {
	const template: (locals?: object) => string;
	export default template;
}
