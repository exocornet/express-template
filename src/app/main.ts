// # ПОДКЛЮЧЕНИЕ JS ДЛЯ HELPERS # //
import { Scroll } from '../shared/helpers/js/Scroll';

// # ПОДКЛЮЧЕНИЕ JS ДЛЯ SHARED # //
import { Slider, Tabs } from '../shared/ui';

// # ПОДКЛЮЧЕНИЕ JS ДЛЯ FEATURES # //
import { Header } from '../features';

document.addEventListener('DOMContentLoaded', () => {
	// # ВЫЗОВ JS ДЛЯ HELPERS # //
	new Scroll(1280);

	// # ВЫЗОВ JS ДЛЯ SHARED # //
	Slider();
	Tabs();

	// # ВЫЗОВ JS ДЛЯ FEATURES # //
	Header();
});
