"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface YandexMapProps {
  editable: boolean;
  initialCoordinates?: [number, number];
  onCoordinatesChange?: (coords: [number, number]) => void;
  height?: string;
}

declare global {
  interface Window {
    ymaps?: typeof ymaps;
  }
}

const YandexMap: React.FC<YandexMapProps> = ({
  editable,
  initialCoordinates = [53.909824, 27.583231],
  onCoordinatesChange = () => {},
  height = "500px",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const placemarkRef = useRef<ymaps.Placemark | null>(null);
  const mapInstanceRef = useRef<ymaps.Map | null>(null);
  const [ymapsLoaded, setYmapsLoaded] = useState(false);

  const initializeMap = () => {
    if (mapRef.current && !mapInstanceRef.current && window.ymaps) {
      console.log("Инициализация карты...");
      const map = new window.ymaps.Map(mapRef.current, {
        center: initialCoordinates,
        zoom: 15,
        controls: ["zoomControl", "fullscreenControl", "typeSelector" ],
      });

      mapInstanceRef.current = map;

      const placemark = new window.ymaps.Placemark(
        initialCoordinates,
        {},
        {
          draggable: editable,
          preset: "islands#redIcon",
        },
      );

      placemarkRef.current = placemark;
      map.geoObjects.add(placemark);

      const handlePlacemarkDragEnd = () => {
        const coords = placemark.geometry.getCoordinates();
        console.log("Placemark перемещён на:", coords);
        onCoordinatesChange(coords as [number, number]);
      };

      placemark.events.add("dragend", handlePlacemarkDragEnd);

      if (editable) {
        map.events.add("click", (e: ymaps.IEvent) => {
          const coords = e.get("coords") as [number, number];
          console.log("Клик на карте:", coords);
          placemark.geometry.setCoordinates(coords);
          onCoordinatesChange(coords);
        });
      }
    }
  };

  useEffect(() => {
    if (ymapsLoaded) {
      console.log("ymaps загружен, готов к инициализации карты");
      window.ymaps.ready(() => {
        console.log("ymaps.ready вызван");
        initializeMap();
      });
    }
  }, [ymapsLoaded, editable, initialCoordinates, onCoordinatesChange]);

  return (
    <div className="relative">
      <Script
        src={`https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY}`}
        strategy="afterInteractive"
        onLoad={() => setYmapsLoaded(true)}
      />
      <div ref={mapRef} className="w-full" style={{ height }}></div>
    </div>
  );
};

export default YandexMap;
