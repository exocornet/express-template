import '../Button.scss';
import STORYBOOK from '../../../../../storybook';
import Button from './Button.story.pug';

// Чтобы дать описание компоненту требуется объявить функцию [name-component]_STORY_OPTIONS
function BUTTON_STORY_OPTIONS(thisFuncStory) {
	const PROPS_STORY = {
		name: 'Button',
		story: {
			description: 'Описание компонента: \n компонент Button служит для отрисовки кнопки',
		},
	};

	STORYBOOK(thisFuncStory, Button, PROPS_STORY);
}

function BUTTON_SIZE_XS(thisFuncStory) {
	const PROPS_STORY = {
		// name: 'Button',
		data: {
			text: 'Кнопка',
		},
		cn: {
			color: 'secondary',
		},
		opt: {
			isCircle: true,
		},
	};

	STORYBOOK(thisFuncStory, Button, PROPS_STORY);
}

function BUTTON_SIZE_XL(thisFuncStory) {
	const PROPS_STORY = {
		// name: 'Button',
		data: {
			href: '#',
			icon: 'youtube',
		},
		opt: {
			isCircle: true,
		},
	};

	STORYBOOK(thisFuncStory, Button, PROPS_STORY);
}

BUTTON_STORY_OPTIONS(BUTTON_STORY_OPTIONS);
BUTTON_SIZE_XS(BUTTON_SIZE_XS);
BUTTON_SIZE_XL(BUTTON_SIZE_XL);
