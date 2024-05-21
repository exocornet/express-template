import { LngLat, YMap, YMapListener, YMapLocationRequest, YMapMarker } from '@yandex/ymaps3-types';
import { YMapLocation } from '@yandex/ymaps3-types/imperative/YMap';
import { useMediaQuery } from '../../shared/helpers/js/useMediaQuery';

export class MapControl {
	block: HTMLElement;
	map: YMap;
	mapOptions: { center: LngLat; zoom: number; currentPlace: string };
	mapItems: { marker: YMapMarker | null };
	mapListener: YMapListener;
	observerList: any[] = [];

	constructor(block: HTMLElement) {
		this.block = block;
		this.mapOptions = { center: [37.588144, 55.733842], zoom: 9, currentPlace: '' };
		this.mapItems = { marker: null };

		this.#initMap();
	}

	async #initMap() {
		await ymaps3.ready;

		//## Импорт пакетов для создание карты ##//
		const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapListener } = ymaps3;

		//## Создание карты ##//
		this.map = new YMap(this.block, {
			location: {
				center: this.mapOptions.center,
				zoom: this.mapOptions.zoom,
			},
		});
		this.map.addChild(new YMapDefaultSchemeLayer({}));

		//## Создание элементов управления ##//
		this.#createMapControl();

		//## Создание кастомного маркера для карты ##//
		this.mapItems.marker = this.#createMapMarker();
		this.map.addChild(new YMapDefaultFeaturesLayer({ zIndex: 1800 }));
		this.map.addChild(this.mapItems.marker);

		//## Добавление событий для карты ##//
		//# Handler события при нажатии на карту #//
		const clickCallback = async (object: any, event: { coordinates: LngLat }) => {
			if (event && event.coordinates) {
				this.setLocation(event.coordinates, this.mapOptions.zoom);
				this.setMarkerLocation(event.coordinates);

				this.setCurrentPlace(event.coordinates);
			} else {
				throw new Error('Event not found');
			}
		};
		//# Handler события при обновлении карты #//
		const updateHandler = ({ location }: { location: YMapLocation }) => {
			/*if (this.mapOptions.zoom !== location.zoom) {
				this.setMarkerLocation(marker, location.center);
			}*/
			this.mapOptions.center = location.center;
			this.mapOptions.zoom = location.zoom;
		};

		this.mapListener = new YMapListener({
			layer: 'any',
			// Добавление обработчиков на слушатель.
			onClick: clickCallback,
			onUpdate: updateHandler,
		});
		this.map.addChild(this.mapListener);
	}

	addObserver(observer: any) {
		this.observerList.push(observer);
	}

	async setCurrentPlace(coordinates: LngLat) {
		const response = await this.findPlace(coordinates);
		let place = '';
		if (response[0].properties.description !== undefined) {
			place += response[0].properties.description + ', ';
		}
		if (response[0].properties.name !== undefined) {
			place += response[0].properties.name;
		}

		this.observerList.forEach((observer) => {
			observer.update(place);
		});
	}

	setLocation(coordinates: LngLat, zoom: number = this.mapOptions.zoom) {
		const LOCATION: YMapLocationRequest = {
			center: coordinates,
			zoom: zoom,
		};

		this.mapOptions.center = coordinates;
		this.map.update({ location: { ...LOCATION, duration: 600 } });
	}

	setMarkerLocation(coordinates: LngLat, marker?: YMapMarker) {
		if (marker) {
			marker.update({ coordinates: { ...coordinates } });
		} else {
			this.mapItems.marker?.update({ coordinates: { ...coordinates } });
		}
	}

	async findPlace(searchPlace: LngLat | string) {
		const { search } = ymaps3;

		let placeToFind = searchPlace;
		if (typeof placeToFind !== 'string') placeToFind = placeToFind.join(' ');

		return await search({ text: placeToFind }).then((response) => {
			return response;
		});
	}

	async suggestPlace(place: string) {
		const { suggest } = ymaps3;

		return await suggest({ text: place }).then((response) => {
			const places: string[] = [];

			response.forEach((place) => {
				places.push(place.value);
			});

			return places;
		});
	}

	async #createMapControl() {
		const { YMapControls } = ymaps3;

		//## Добавление элементов управления для карты ##//
		const { YMapZoomControl, YMapGeolocationControl } = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');

		useMediaQuery(
			1280,
			() => {
				//# Создание контейнера контроля #//
				const controls = new YMapControls({ position: 'right', orientation: 'vertical' });

				//# Создание элементов контроля #//
				const GEOLOCATION_CONTROL = new YMapGeolocationControl({
					onGeolocatePosition: (position) => {
						this.setCurrentPlace(position);
						this.setMarkerLocation(position);
					},
				});
				//# Добавление элементов контроля в контейнер #//
				controls.addChild(GEOLOCATION_CONTROL);

				//# Добавление элементов контроля в контейнер #//
				controls.addChild(GEOLOCATION_CONTROL);

				//# Добавление элементов контроля на карту #//
				this.map.addChild(controls);
			},
			() => {
				//# Создание контейнера контроля #//
				const controls = new YMapControls({ position: 'right', orientation: 'vertical' });

				//# Создание элементов контроля #//
				const ZOOM_CONTROL = new YMapZoomControl({});
				const GEOLOCATION_CONTROL = new YMapGeolocationControl({
					onGeolocatePosition: (position) => {
						this.setCurrentPlace(position);
						this.setMarkerLocation(position);
					},
				});
				//# Добавление элементов контроля в контейнер #//
				controls.addChild(ZOOM_CONTROL);
				controls.addChild(GEOLOCATION_CONTROL);

				//# Добавление элементов контроля в контейнер #//
				controls.addChild(ZOOM_CONTROL);
				controls.addChild(GEOLOCATION_CONTROL);

				//# Добавление элементов контроля на карту #//
				this.map.addChild(controls);
			}
		);
	}

	#createMapMarker() {
		const { YMapMarker } = ymaps3;

		const markerElement = document.createElement('div');
		markerElement.classList.add('map__marker');

		const onDragEndHandler = (coordinates: LngLat) => {
			this.setCurrentPlace(coordinates);
			this.setLocation(coordinates);
		};

		return new YMapMarker(
			{
				coordinates: this.mapOptions.center,
				draggable: true,
				onDragEnd: onDragEndHandler,
			},
			markerElement
		);
	}
}

export function Map(block: HTMLElement) {
	const BLOCK_CLASS = '.map';
	const element: HTMLElement | null = block.querySelector(`${BLOCK_CLASS}`);

	if (!element) return null;
	return new MapControl(element);
}
