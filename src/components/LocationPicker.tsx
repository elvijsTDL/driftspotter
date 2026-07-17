"use client";

import { useEffect, useRef, useCallback } from "react";

interface LocationPickerProps {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({ lat, lng, onChange }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const initMap = useCallback(async () => {
    if (!containerRef.current || mapRef.current) return;

    const maplibregl = (await import("maplibre-gl")).default;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          "osm-tiles": {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
            ],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
        },
        layers: [
          {
            id: "osm-tiles",
            type: "raster",
            source: "osm-tiles",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [lng ?? 15, lat ?? 48],
      zoom: lat && lng ? 10 : 3,
    });

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");

    // Place initial marker if coords provided
    if (lat !== null && lng !== null) {
      const marker = new maplibregl.Marker({
        color: "#FF6B00",
        draggable: true,
      })
        .setLngLat([lng, lat])
        .addTo(map);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        onChangeRef.current(
          Math.round(lngLat.lat * 10000) / 10000,
          Math.round(lngLat.lng * 10000) / 10000
        );
      });

      markerRef.current = marker;
    }

    // Click to place / move marker
    map.on("click", (e: { lngLat: { lat: number; lng: number } }) => {
      const newLat = Math.round(e.lngLat.lat * 10000) / 10000;
      const newLng = Math.round(e.lngLat.lng * 10000) / 10000;

      if (markerRef.current) {
        (markerRef.current as InstanceType<typeof maplibregl.Marker>).setLngLat([newLng, newLat]);
      } else {
        const marker = new maplibregl.Marker({
          color: "#FF6B00",
          draggable: true,
        })
          .setLngLat([newLng, newLat])
          .addTo(map);

        marker.on("dragend", () => {
          const lngLat = marker.getLngLat();
          onChangeRef.current(
            Math.round(lngLat.lat * 10000) / 10000,
            Math.round(lngLat.lng * 10000) / 10000
          );
        });

        markerRef.current = marker;
      }

      onChangeRef.current(newLat, newLng);
    });

    mapRef.current = map;
  }, [lat, lng]);

  useEffect(() => {
    initMap();
    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div
        ref={containerRef}
        role="application"
        aria-label="Event location map. You can also enter coordinates below."
        className="w-full h-[250px] rounded-xl overflow-hidden border border-border"
      />
      <fieldset className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <legend className="sr-only">Event coordinates</legend>
        <div>
          <label htmlFor="event-latitude" className="block text-xs text-muted mb-1">Latitude</label>
          <input id="event-latitude" type="number" inputMode="decimal" min="-90" max="90" step="any" value={lat ?? ""} onChange={(e) => { const next = Number(e.target.value); if (e.target.value !== "" && Number.isFinite(next)) onChange(next, lng ?? 0); }} className="w-full px-3 py-2.5 bg-surface-lighter border border-border rounded-xl text-foreground" />
        </div>
        <div>
          <label htmlFor="event-longitude" className="block text-xs text-muted mb-1">Longitude</label>
          <input id="event-longitude" type="number" inputMode="decimal" min="-180" max="180" step="any" value={lng ?? ""} onChange={(e) => { const next = Number(e.target.value); if (e.target.value !== "" && Number.isFinite(next)) onChange(lat ?? 0, next); }} className="w-full px-3 py-2.5 bg-surface-lighter border border-border rounded-xl text-foreground" />
        </div>
      </fieldset>
      {lat !== null && lng !== null && (
        <p className="text-xs text-muted mt-2">
          Coordinates: {lat}, {lng}
        </p>
      )}
    </div>
  );
}
