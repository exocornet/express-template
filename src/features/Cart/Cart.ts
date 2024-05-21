import { useMediaQuery } from '../../shared/helpers/js/useMediaQuery';
import useTemplate from '../../shared/helpers/js/useTemplate';
import { CartItem, CartItemControl } from '../../components/CartItem/CartItem';
import { GetCartStateManager } from '../../shared/ui/CartStateManager/CartStateManager';

class CartControl {
	block: HTMLElement;
	body: HTMLElement | null;
	buttonShow: HTMLElement | null;
	buttonHide: HTMLElement | null;
	buttonAddress: HTMLElement | null;
	wrapper: HTMLElement | null;
	isNotDesktop: boolean;
	isMobile: boolean;
	cartWrapper: HTMLElement | null;
	apiUrl: string | null;
	dataIdComponent: string | null;
	deleteAllButton: HTMLElement | null;
	cartItemArr: CartItemControl[];

	constructor(block: HTMLElement, blockClass: string) {
		this.block = block;
		this.body = document.querySelector('body');
		this.buttonShow = this.block.querySelector(`.${blockClass}__button-cart`);
		this.buttonHide = this.block.querySelector(`.${blockClass}__button-back`);
		this.buttonAddress = this.block.querySelector(`.${blockClass}__button-address`);
		this.wrapper = this.block.querySelector(`.${blockClass}__wrapper`);
		this.isNotDesktop = window.matchMedia('only screen and (max-width:  1280px)').matches;
		this.isMobile = window.matchMedia('only screen and (max-width:  768px)').matches;
		this.cartWrapper = this.block.querySelector(`.${blockClass}__wrapper`);
		this.apiUrl = this.block.getAttribute('data-api-cart-url');
		this.dataIdComponent = this.block.getAttribute('data-id-component');
		this.deleteAllButton = this.block.querySelector(`.${blockClass}__button-empty`);
		this.cartItemArr = CartItem(this.block);

		this.#init();
	}

	#init() {
		this.#cutBtn();
		this.#setButtonListeners();
		this.#bindCartUpdate();
		this.#bindDeleteAllButton();
	}

	#cutBtn() {
		const isDesktopController = (isMobile?: boolean) => {
			const clone = useTemplate('template-cart-button-address', this.block);
			const btn = this.block.querySelector('.cart__button-address');
			btn?.remove();

			if (isMobile) {
				this.wrapper?.prepend(clone);
			} else {
				this.wrapper?.parentNode?.insertBefore(clone, this.wrapper);
			}
		};

		const isMobileController = () => {
			isDesktopController(true);
		};

		useMediaQuery(768, isMobileController, isDesktopController);
	}

	#onHide = () => {
		this.buttonShow?.removeAttribute('state');
		this.block?.classList.remove('js-show');
		this.body?.classList.remove('overflow-hidden');
	};

	#onShow = () => {
		this.buttonShow?.setAttribute('state', `${Number(this.buttonShow?.getAttribute('state')) + 1}`);
		this.block?.classList.add('js-show');
		this.body?.classList.add('overflow-hidden');
	};

	#onShowCart = () => {
		this.buttonHide?.addEventListener('click', this.#onHide);
		this.buttonShow?.addEventListener('click', this.#onShow);
	};

	#removeShowCart = () => {
		this.buttonHide?.removeEventListener('click', this.#onHide);
		this.buttonShow?.removeEventListener('click', this.#onShow);
	};

	#setButtonListeners() {
		useMediaQuery(1280, this.#onShowCart, this.#removeShowCart);
	}

	/** Обновление корзины.
	 * При работе с корзиной из других шаредов/компонентов/секций нужно сгенерировать событие updateCartProduct **/
	#bindCartUpdate() {
		document.addEventListener('updateCartProduct', () => {
			this.#apiFetch();
		});
	}

	#apiFetch() {
		this.apiUrl &&
			fetch(this.apiUrl, {
				method: 'GET',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'X-Component': `${this.dataIdComponent}`,
				},
			})
				.then((data) => data.text())
				.then((response) => {
					if (this.cartWrapper) {
						GetCartStateManager().unsubscribeArr(this.cartWrapper.querySelectorAll('.cart-item'));
						this.cartWrapper.innerHTML = response;
						this.cartItemArr = CartItem(this.cartWrapper);
						this.#updateCartInstanceAttributes();
						this.#bindDeleteAllButton();
					}
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.error(err);
				});
	}

	#updateCartInstanceAttributes() {
		this.deleteAllButton = this.block.querySelector('.cart__button-empty');
		this.buttonShow = this.block.querySelector('.cart__button-cart');
		this.buttonHide = this.block.querySelector('.cart__button-back');
		this.buttonAddress = this.block.querySelector('.cart__button-address');

		this.#setButtonListeners();
	}

	#bindDeleteAllButton() {
		this.deleteAllButton?.addEventListener('click', () => {
			_CSM.removeAllProducts();
		});
	}
}

export function Cart() {
	const elem = document.querySelector('.cart') as HTMLElement;
	if (elem) {
		new CartControl(elem, 'cart');
	}
}
