declare module '*.pug' {
	const template: (locals?: object) => string;
	export default template;
}

declare type ProductType = {
	productId: string;
	productCount: number;
};

declare var _CSM: CartStateManager;
