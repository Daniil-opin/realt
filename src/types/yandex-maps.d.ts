// types/yandex-maps.d.ts

declare namespace ymaps {
  interface MapOptions {
    center: [number, number];
    zoom: number;
    controls?: string[]; // Например, ['zoomControl', 'typeSelector']
    behaviors?: string[]; // Например, ['default', 'scrollZoom']
  }

  // Интерфейс для обработчиков событий карты
  interface MapEvents {
    add(eventName: string, handler: (event: IEvent) => void): void;
  }

  // Класс Map
  class Map {
    constructor(
      container: string | HTMLElement,
      state: MapOptions,
      options?: Record<string, unknown>,
    );
    geoObjects: GeoObjectCollection;
    events: MapEvents;
    setCenter(coords: [number, number], zoom?: number): void;
  }

  // Опции для создания метки (Placemark)
  interface PlacemarkOptions {
    preset?: string;
    draggable?: boolean;
    iconLayout?: string;
    iconImageHref?: string;
    iconImageSize?: [number, number];
    // Добавьте другие опции по мере необходимости
  }

  // Свойства для Placemark
  interface PlacemarkProperties {
    balloonContent?: string;
    hintContent?: string;
    // Добавьте другие свойства по мере необходимости
  }

  // Интерфейс для обработчиков событий Placemark
  interface PlacemarkEvents {
    add(eventName: string, handler: (event: IEvent) => void): void;
  }

  // Класс Placemark
  class Placemark {
    constructor(
      coords: [number, number],
      properties?: PlacemarkProperties,
      options?: PlacemarkOptions,
    );
    geometry: {
      getCoordinates(): [number, number];
      setCoordinates(coords: [number, number]): void;
    };
    events: PlacemarkEvents;
  }

  // Класс для коллекции геообъектов
  class GeoObjectCollection {
    constructor(options?: Record<string, unknown>);
    add(object: Placemark | GeoObjectCollection): void;
    remove(object: Placemark | GeoObjectCollection): void;
    each(callback: (object: Placemark | GeoObjectCollection) => void): void;
  }

  // Интерфейс для событий
  interface IEvent {
    get(key: string): unknown;
  }

  // Функция готовности API
  function ready(callback: () => void): void;
}
