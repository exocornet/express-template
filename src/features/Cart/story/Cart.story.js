import '../../../app/public/media/img/features/cart/cart-item.png';
import '../../../shared/shared.scss';
import '../../../components/CartItem/CartItem.scss';
import '../../../components/ButtonCart/ButtonCart.scss';
import '../../../components/ButtonAddress/ButtonAddress.scss';
import '../Cart.scss';
import '../../../app/main.scss';
import { Cart as CartTest } from '../Cart';
import STORYBOOK from '../../../../storybook';
import Cart from './Cart.story.pug';

// Чтобы дать описание компоненту требуется объявить функцию [name-component]_STORY_OPTIONS
function CART_STORY_OPTIONS(thisFuncStory) {
	const PROPS_STORY = {
		name: 'Cart',
		story: {
			description: 'Описание компонента: Корзина',
		},
	};

	STORYBOOK(thisFuncStory, Cart, PROPS_STORY);
}

function CART_EMPTY(thisFuncStory) {
	const PROPS_STORY = {
		data: {
			iconDesktop: 'close',
			iconMobile: 'trash',
		},
		elem: {
			ButtonAddress: {
				data: {
					text: 'Смотреть зоны доставки',
					icon: 'location',
				},
			},
			ButtonBack: {
				data: {
					icon: 'arrow-left',
				},
				opt: {
					isCircle: true,
				},
			},
			TextButton: {
				data: {
					tag: 'span',
					text: 'Очистить',
				},
				cn: {
					size: 'caption',
					color: 'gray',
				},
			},
			Heading: {
				data: {
					tag: 'p',
					text: 'Корзина',
				},
				cn: {
					size: 'h2',
				},
			},
			CartItemArr: false,
			ButtonCart: {
				opt: {
					isDisabled: true,
				},
				elem: {
					TextPrice: {
						data: {
							tag: 'span',
							text: '60 ₽',
						},
						cn: {
							size: 'body-h2',
						},
					},
					Text: {
						data: {
							tag: 'span',
							text: 'Заказ от 1200₽',
						},
						cn: {
							size: 'button-l',
						},
					},
				},
			},
		},
	};

	STORYBOOK(thisFuncStory, Cart, PROPS_STORY);
}

function CART_NOT_ENOUGH(thisFuncStory) {
	const PROPS_STORY = {
		data: {
			iconDesktop: 'close',
			iconMobile: 'trash',
		},
		elem: {
			ButtonAddress: {
				data: {
					text: 'Смотреть зоны доставки',
					icon: 'location',
				},
			},
			ButtonBack: {
				data: {
					icon: 'arrow-left',
				},
				opt: {
					isCircle: true,
				},
			},
			TextButton: {
				data: {
					tag: 'span',
					text: 'Очистить',
				},
				cn: {
					size: 'caption',
					color: 'gray',
				},
			},
			Heading: {
				data: {
					tag: 'p',
					text: 'Корзина',
				},
				cn: {
					size: 'h2',
				},
			},
			CartItemArr: [
				{
					data: {
						img: './assets/img/features/cart/cart-item.png',
						imgWebp: './assets/img/features/cart/cart-item.png',
					},
					elem: {
						TextName: {
							data: {
								tag: 'span',
								text: 'Горошек Heinz зеленый Нежный',
							},
							cn: {
								size: 'body-m-m',
							},
						},
						TextPrice: {
							data: {
								tag: 'span',
								text: '160 ₽',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						TextWeight: {
							data: {
								tag: 'span',
								text: '400 г',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						CounterCart: {
							data: {
								value: '1',
								unit: 'шт',
							},
						},
					},
				},
			],
			ButtonCart: {
				elem: {
					TextPrice: {
						data: {
							tag: 'span',
							text: '60 ₽',
						},
						cn: {
							size: 'body-h2',
						},
					},
					Text: {
						data: {
							tag: 'span',
							text: 'Заказ от 1200₽',
						},
						cn: {
							size: 'button-l',
						},
					},
					TextCaption: {
						data: {
							tag: 'span',
							text: 'Не хватает ещё 1140₽',
						},
						cn: {
							size: 'caption',
						},
					},
				},
				cn: {
					state: 'disabled',
				},
			},
		},
	};

	STORYBOOK(thisFuncStory, Cart, PROPS_STORY);
}

function CART_READY(thisFuncStory) {
	const PROPS_STORY = {
		data: {
			iconDesktop: 'close',
			iconMobile: 'trash',
		},
		elem: {
			ButtonAddress: {
				data: {
					text: 'Смотреть зоны доставки',
					icon: 'location',
				},
			},
			ButtonBack: {
				data: {
					icon: 'arrow-left',
				},
				opt: {
					isCircle: true,
				},
			},
			TextButton: {
				data: {
					tag: 'span',
					text: 'Очистить',
				},
				cn: {
					size: 'caption',
					color: 'gray',
				},
			},
			Heading: {
				data: {
					tag: 'p',
					text: 'Корзина',
				},
				cn: {
					size: 'h2',
				},
			},
			CartItemArr: [
				{
					data: {
						img: './assets/img/features/cart/cart-item.png',
						imgWebp: './assets/img/features/cart/cart-item.png',
					},
					elem: {
						TextName: {
							data: {
								tag: 'span',
								text: 'Горошек Heinz зеленый Нежный',
							},
							cn: {
								size: 'body-m-m',
							},
						},
						TextPrice: {
							data: {
								tag: 'span',
								text: '160 ₽',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						TextWeight: {
							data: {
								tag: 'span',
								text: '400 г',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						CounterCart: {
							data: {
								value: '1',
								unit: 'шт',
							},
						},
					},
				},
				{
					data: {
						img: './assets/img/features/cart/cart-item.png',
						imgWebp: './assets/img/features/cart/cart-item.png',
					},
					elem: {
						TextName: {
							data: {
								tag: 'span',
								text: 'Горошек Heinz зеленый Нежный',
							},
							cn: {
								size: 'body-m-m',
							},
						},
						TextPrice: {
							data: {
								tag: 'span',
								text: '160 ₽',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						TextWeight: {
							data: {
								tag: 'span',
								text: '400 г',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						CounterCart: {
							data: {
								value: '1',
								unit: 'шт',
							},
						},
					},
				},
				{
					data: {
						img: './assets/img/features/cart/cart-item.png',
						imgWebp: './assets/img/features/cart/cart-item.png',
					},
					elem: {
						TextName: {
							data: {
								tag: 'span',
								text: 'Горошек Heinz зеленый Нежный',
							},
							cn: {
								size: 'body-m-m',
							},
						},
						TextPrice: {
							data: {
								tag: 'span',
								text: '160 ₽',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						TextWeight: {
							data: {
								tag: 'span',
								text: '400 г',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						CounterCart: {
							data: {
								value: '1',
								unit: 'шт',
							},
						},
					},
				},
				{
					data: {
						img: './assets/img/features/cart/cart-item.png',
						imgWebp: './assets/img/features/cart/cart-item.png',
					},
					elem: {
						TextName: {
							data: {
								tag: 'span',
								text: 'Горошек Heinz зеленый Нежный',
							},
							cn: {
								size: 'body-m-m',
							},
						},
						TextPrice: {
							data: {
								tag: 'span',
								text: '160 ₽',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						TextWeight: {
							data: {
								tag: 'span',
								text: '400 г',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						CounterCart: {
							data: {
								value: '1',
								unit: 'шт',
							},
						},
					},
				},
				{
					data: {
						img: './assets/img/features/cart/cart-item.png',
						imgWebp: './assets/img/features/cart/cart-item.png',
					},
					elem: {
						TextName: {
							data: {
								tag: 'span',
								text: 'Горошек Heinz зеленый Нежный',
							},
							cn: {
								size: 'body-m-m',
							},
						},
						TextPrice: {
							data: {
								tag: 'span',
								text: '160 ₽',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						TextWeight: {
							data: {
								tag: 'span',
								text: '400 г',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						CounterCart: {
							data: {
								value: '1',
								unit: 'шт',
							},
						},
					},
				},
				{
					data: {
						img: './assets/img/features/cart/cart-item.png',
						imgWebp: './assets/img/features/cart/cart-item.png',
					},
					elem: {
						TextName: {
							data: {
								tag: 'span',
								text: 'Горошек Heinz зеленый Нежный',
							},
							cn: {
								size: 'body-m-m',
							},
						},
						TextPrice: {
							data: {
								tag: 'span',
								text: '160 ₽',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						TextWeight: {
							data: {
								tag: 'span',
								text: '400 г',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						CounterCart: {
							data: {
								value: '1',
								unit: 'шт',
							},
						},
					},
				},
				{
					data: {
						img: './assets/img/features/cart/cart-item.png',
						imgWebp: './assets/img/features/cart/cart-item.png',
					},
					elem: {
						TextName: {
							data: {
								tag: 'span',
								text: 'Горошек Heinz зеленый Нежный',
							},
							cn: {
								size: 'body-m-m',
							},
						},
						TextPrice: {
							data: {
								tag: 'span',
								text: '160 ₽',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						TextWeight: {
							data: {
								tag: 'span',
								text: '400 г',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						CounterCart: {
							data: {
								value: '1',
								unit: 'шт',
							},
						},
					},
				},
				{
					data: {
						img: './assets/img/features/cart/cart-item.png',
						imgWebp: './assets/img/features/cart/cart-item.png',
					},
					elem: {
						TextName: {
							data: {
								tag: 'span',
								text: 'Горошек Heinz зеленый Нежный',
							},
							cn: {
								size: 'body-m-m',
							},
						},
						TextPrice: {
							data: {
								tag: 'span',
								text: '160 ₽',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						TextWeight: {
							data: {
								tag: 'span',
								text: '400 г',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						CounterCart: {
							data: {
								value: '1',
								unit: 'шт',
							},
						},
					},
				},
				{
					data: {
						img: './assets/img/features/cart/cart-item.png',
						imgWebp: './assets/img/features/cart/cart-item.png',
					},
					elem: {
						TextName: {
							data: {
								tag: 'span',
								text: 'Горошек Heinz зеленый Нежный',
							},
							cn: {
								size: 'body-m-m',
							},
						},
						TextPrice: {
							data: {
								tag: 'span',
								text: '160 ₽',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						TextWeight: {
							data: {
								tag: 'span',
								text: '400 г',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						CounterCart: {
							data: {
								value: '1',
								unit: 'шт',
							},
						},
					},
				},
				{
					data: {
						img: './assets/img/features/cart/cart-item.png',
						imgWebp: './assets/img/features/cart/cart-item.png',
					},
					elem: {
						TextName: {
							data: {
								tag: 'span',
								text: 'Горошек Heinz зеленый Нежный',
							},
							cn: {
								size: 'body-m-m',
							},
						},
						TextPrice: {
							data: {
								tag: 'span',
								text: '160 ₽',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						TextWeight: {
							data: {
								tag: 'span',
								text: '400 г',
							},
							cn: {
								size: 'caption',
								color: 'gray',
							},
						},
						CounterCart: {
							data: {
								value: '1',
								unit: 'шт',
							},
						},
					},
				},
			],
			ButtonCart: {
				//- opt: {
				//- 	isDisabled: true,
				//- },
				elem: {
					TextPrice: {
						data: {
							tag: 'span',
							text: '1746 ₽',
						},
						cn: {
							size: 'body-h2',
						},
					},
					Text: {
						data: {
							tag: 'span',
							text: 'Далее',
						},
						cn: {
							size: 'button-l',
						},
					},
					//- TextCaption: {
					//- 	data: {
					//- 		tag: 'span',
					//- 		text: 'Не хватает ещё 1140₽',
					//- 	},
					//- 	cn: {
					//- 		size: 'caption',
					//- 	}
					//- },
				},
				//- cn: {
				//- 	state: 'disabled',
				//- },
			},
		},
	};

	STORYBOOK(thisFuncStory, Cart, PROPS_STORY);
}

CART_STORY_OPTIONS(CART_STORY_OPTIONS);
CART_EMPTY(CART_EMPTY);
CART_NOT_ENOUGH(CART_NOT_ENOUGH);
CART_READY(CART_READY);
CartTest();
