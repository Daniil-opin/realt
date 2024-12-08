"use client";

import { useEffect, useRef } from "react";
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
  initialCoordinates = [53.9025, 27.5615],
  onCoordinatesChange = () => {},
  height = "500px",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const placemarkRef = useRef<ymaps.Placemark | null>(null);
  const mapInstanceRef = useRef<ymaps.Map | null>(null);

  useEffect(() => {
    if (!window.ymaps) return;

    ymaps.ready(() => {
      if (mapRef.current && !mapInstanceRef.current) {
        const map = new ymaps.Map(mapRef.current, {
          center: initialCoordinates,
          zoom: 15,
          controls: ["zoomControl", "fullscreenControl", "typeSelector"],
        });

        mapInstanceRef.current = map;

        const placemark = new ymaps.Placemark(
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
          onCoordinatesChange(coords);
        };

        placemark.events.add("dragend", handlePlacemarkDragEnd);

        if (editable) {
          map.events.add("click", (e: ymaps.IEvent) => {
            const coords = e.get("coords") as [number, number];
            placemark.geometry.setCoordinates(coords);
            onCoordinatesChange(coords);
          });
        }
      }
    });
  }, [editable, initialCoordinates, onCoordinatesChange]);

  return (
    <div className="relative">
      <Script
        src="https://api-maps.yandex.ru/2.1/?lang=ru_RU"
        strategy="beforeInteractive"
      />
      <div ref={mapRef} className="w-full" style={{ height }}></div>
    </div>
  );
};

export default YandexMap;
