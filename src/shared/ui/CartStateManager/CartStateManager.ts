import { CardProductCounterControl, CounterControl } from '../Counter/Counter';
import { CardProductControl } from '../../../components/CardProduct/CardProduct';

type SubscriberType = {
	observer: ObserverType;
	observerElement: any;
	callback: (value: ProductType) => void;
};
type ObserverType = CounterControl | CardProductControl | CardProductCounterControl;

class CartStateManager {
	private static instance: CartStateManager;

	subscribers: SubscriberType[] = [];
	products: ProductType[] = [];
	cart: HTMLElement | null;
	apiCartUrl: string | null;

	private constructor() {
		this.cart = document.querySelector('.cart');

		const dataApiCartUrl: HTMLElement | null = document.querySelector('[data-api-cart-url]');
		this.apiCartUrl = dataApiCartUrl && dataApiCartUrl.getAttribute('data-api-cart-url');
	}

	public static getInstance() {
		if (!CartStateManager.instance) {
			CartStateManager.instance = new CartStateManager();
		}
		return CartStateManager.instance;
	}

	set setProducts(value: ProductType[]) {
		this.products = value;
	}

	updateProduct(product: ProductType) {
		const productPos = this.products.findIndex((item) => item.productId === product.productId);
		if (productPos !== -1) {
			this.products[productPos] = product;
		} else {
			this.products.push(product);
		}

		//this.informEveryone(product);
		this.#postApi(product);
	}

	informEveryone(product: ProductType) {
		this.subscribers.forEach((subscriber) => {
			if (!(subscriber.observer instanceof CardProductControl) || subscriber.observer.productId === product.productId) {
				subscriber.callback(product);
			}
		});
		document.dispatchEvent(new Event('updateCartProduct'));
	}

	deleteAllAndInform() {
		this.subscribers.forEach((subscriber) => {
			if (this.products.find((item) => item.productId === subscriber.observer.productId)) {
				const productId = subscriber.observer.productId;
				productId && subscriber.callback({ productId: productId, productCount: 0 });
			}
		});
		document.dispatchEvent(new Event('updateCartProduct'));
		this.products = [];
	}

	subscribe(observer: ObserverType, observerElement: any, callback: (value: ProductType) => void) {
		const subscriber = { observer, observerElement, callback };
		const index = this.subscribers.findIndex((subscriber) => subscriber.observer === observer);
		index === -1 && this.subscribers.push(subscriber);
	}

	unsubscribeArr(observerArr: NodeListOf<HTMLElement> | HTMLElement[]) {
		observerArr.forEach((observer) => {
			const index = this.subscribers.findIndex((item) => item.observerElement === observer);
			if (index > -1) {
				this.subscribers.splice(index, 1);
			}
		});
	}

	removeAllProducts() {
		this.#deleteApi();
	}

	#postApi(product: ProductType) {
		this.apiCartUrl &&
			fetch(this.apiCartUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
					'X-Requested-With': 'XMLHttpRequest',
				},
				body: JSON.stringify({
					productId: product.productId,
					productCount: product.productCount,
				}),
			})
				.then((response) => {
					if (response.status > 199 && response.status < 400) {
						this.informEveryone(product);
					}
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.error(err);
				});
	}

	#deleteApi() {
		this.apiCartUrl &&
			fetch(this.apiCartUrl, {
				method: 'DELETE',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
				},
			})
				.then((data) => data.text())
				.then(() => {
					this.deleteAllAndInform();
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.error(err);
				});
	}
}

globalThis._CSM = CartStateManager.getInstance();

export function GetCartStateManager() {
	return globalThis._CSM;
}
