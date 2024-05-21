let nameComponent = null;
export default function STORYBOOK(componentFuncStory, componentPug, propsStory) {
	// # ОПРЕДЕЛЕНИЕ ИМЕНИ КОМПОНЕНТА # //
	if (propsStory.name) {
		nameComponent = propsStory.name;
	}

	// # КОЛОНКА СЛЕВА С ИМЕНАМИ КОМПОНЕНТОВ # //
	const LIST_COMPONENT = document.querySelector('.js-ui-kit-list-component');
	const ELEM_BUTTON_COMPONENT = LIST_COMPONENT.querySelector(`#${nameComponent}`);
	if (!ELEM_BUTTON_COMPONENT) {
		const COMPONENT_BUTTON_CREATE = document.createElement('button');
		COMPONENT_BUTTON_CREATE.id = nameComponent;
		COMPONENT_BUTTON_CREATE.textContent = nameComponent;

		// ## Навешивание события клика на кнопку ## //
		COMPONENT_BUTTON_CREATE.addEventListener('click', (event) => {
			const ARR_BUTTON_COMPONENT = document.querySelectorAll('.ui-kit__list-component button');
			const ID_BUTTON_COMPONENT = event.currentTarget.id;

			const ARR_CONTAINER_COMPONENT = document.querySelectorAll('[data-ui-kit-component]');
			ARR_CONTAINER_COMPONENT.forEach((item) => {
				item.style.display = '';
			});
			ARR_BUTTON_COMPONENT.forEach((item) => {
				item.classList.remove('js-ui-kit-active');
			});

			event.currentTarget.classList.add('js-ui-kit-active');
			const ID_COMPONENT = document.querySelector(`[data-ui-kit-component=${ID_BUTTON_COMPONENT}]`);
			ID_COMPONENT.style.display = 'grid';
		});

		LIST_COMPONENT.append(COMPONENT_BUTTON_CREATE);
	}

	// # КОЛОНКА СПРАВА С ВИЗУАЛЬНЫМ ПРЕДСТАВЛЕНИЕМ И ОПИСАНИЕМ # //
	const VIEW_COMPONENT = document.querySelector('.js-ui-kit-view-component');

	// ## Создание контейнера компонента для вызова в нем компонентов с разными props ## //
	let COMPONENT_CONTAINER = document.querySelector(`[data-ui-kit-component=${nameComponent}]`);
	if (!COMPONENT_CONTAINER) {
		const COMPONENT_CONTAINER_CREATE = document.createElement('div');
		COMPONENT_CONTAINER_CREATE.setAttribute('data-ui-kit-component', nameComponent);
		COMPONENT_CONTAINER_CREATE.classList.add('ui-kit__container-component');
		VIEW_COMPONENT.prepend(COMPONENT_CONTAINER_CREATE);
		COMPONENT_CONTAINER = document.querySelector(`[data-ui-kit-component=${nameComponent}]`);
	}

	// ## Создание заголовка для компонента ## //
	const COMPONENT_HEADING = COMPONENT_CONTAINER.querySelector('h1');
	if (!COMPONENT_HEADING) {
		const COMPONENT_HEADING_CREATE = document.createElement('h1');
		COMPONENT_HEADING_CREATE.classList.add('ui-kit__h1');
		COMPONENT_HEADING_CREATE.textContent = propsStory?.story?.heading || `компонент - ${nameComponent}`;
		// вкладывание компонента в контейнер
		COMPONENT_CONTAINER.append(COMPONENT_HEADING_CREATE);
	}

	// ## Создание заголовка для компонента ## //
	if (propsStory?.story?.description) {
		const COMPONENT_DESCRIPTION_CREATE = document.createElement('p');
		COMPONENT_DESCRIPTION_CREATE.classList.add('ui-kit__description');
		COMPONENT_DESCRIPTION_CREATE.innerHTML = propsStory.story.description;
		COMPONENT_CONTAINER.append(COMPONENT_DESCRIPTION_CREATE);
	}

	if (!propsStory.story) {
		// Получение компонента PUG и прокидывание props
		const COMPONENT_PUG = componentPug({ propsStory });
		// Создание обертки компонента и присвоение ему id
		const COMPONENT_WRAP = document.createElement('div');
		COMPONENT_WRAP.id = componentFuncStory.name;
		COMPONENT_WRAP.innerHTML = COMPONENT_PUG;
		// вкладывание компонента в контейнер
		COMPONENT_CONTAINER.append(COMPONENT_WRAP);
	}
}
