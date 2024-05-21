import '../Checkbox.scss';
import STORYBOOK from '../../../../../storybook';
import Checkbox from './Checkbox.story.pug';

// Чтобы дать описание компоненту требуется объявить функцию [name-component]_STORY_OPTIONS
function CHECKBOX_STORY_OPTIONS(thisFuncStory) {
	const PROPS_STORY = {
		name: 'Checkbox',
		story: {
			description:
				'Описание компонента: \n компонент Checkbox служит для отрисовки чекбоксов, имеет два размера: body-m-m и body-m-l и может быть зеленым',
		},
	};

	STORYBOOK(thisFuncStory, Checkbox, PROPS_STORY);
}

function CHECKBOX_SIZE_BODY_M_M(thisFuncStory) {
	const PROPS_STORY = {
		// name: 'Button',
		data: {
			name: 'subscribe',
		},
		elem: {
			Text: {
				data: {
					tag: 'span',
					text: 'Соглашаюсь получать новости и специальные предложения',
				},
				cn: {
					size: 'body-m-m',
				},
			},
		},
		opt: {
			checked: false,
			disabled: false,
		},
	};

	STORYBOOK(thisFuncStory, Checkbox, PROPS_STORY);
}

CHECKBOX_STORY_OPTIONS(CHECKBOX_STORY_OPTIONS);
CHECKBOX_SIZE_BODY_M_M(CHECKBOX_SIZE_BODY_M_M);
