// # ПОДКЛЮЧЕНИЕ JS ДЛЯ HELPERS # //
import { Scroll } from '../shared/helpers/js/Scroll';

// # ПОДКЛЮЧЕНИЕ JS ДЛЯ SHARED # //
import { Slider, Tabs } from '../shared';

// # ПОДКЛЮЧЕНИЕ JS ДЛЯ FEATURES # //
import { Sidebar, Header, CatalogSearch, Cart, Catalog, Cookies } from '../features';

document.addEventListener('DOMContentLoaded', () => {
	// # ВЫЗОВ JS ДЛЯ HELPERS # //
	new Scroll(1280);

	// # ВЫЗОВ JS ДЛЯ SHARED # //
	Slider();
	Tabs();

	// # ВЫЗОВ JS ДЛЯ FEATURES # //
	Header();
	Sidebar();
	CatalogSearch();
	Cart();
	Catalog();
	Cookies();
});
