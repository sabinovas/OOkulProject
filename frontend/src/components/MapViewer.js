import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  ImageOverlay,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const UpdateMapView = ({ geoJsonData }) => {
  const map = useMap();

  useEffect(() => {
    if (geoJsonData && geoJsonData.features.length > 0) {
      const bounds = geoJsonData.features.flatMap((feature) => {
        if (feature.geometry.type === "Point") {
          return [
            [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
          ];
        }
        return feature.geometry.coordinates.map(([lat, lng]) => [lat, lng]);
      });

      if (bounds.length > 0) {
        map.fitBounds(bounds);
      }
    }
  }, [geoJsonData, map]);

  return null;
};

export const MapViewer = ({ geoJsonData }) => {
  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={[47.366514, 8.542123]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geoJsonData && (
          <>
            <GeoJSON data={geoJsonData} key={JSON.stringify(geoJsonData)} />
            {geoJsonData.features.map((feature, index) => {
              if (feature.geometry.type === "Point") {
                return (
                  <Marker
                    key={index}
                    position={[
                      feature.geometry.coordinates[0],
                      feature.geometry.coordinates[1],
                    ]}
                  >
                    <Popup>{feature.properties.name || "Point"}</Popup>
                  </Marker>
                );
              } else if (
                feature.geometry.type === "Polygon" &&
                feature.properties.href
              ) {
                const bounds = feature.geometry.coordinates[0].map(
                  ([lat, lng]) => [lat, lng]
                );
                return (
                  <ImageOverlay
                    key={index}
                    url={feature.properties.href}
                    bounds={bounds}
                    opacity={0.7}
                  />
                );
              }
              return null;
            })}
            <UpdateMapView geoJsonData={geoJsonData} />
          </>
        )}
      </MapContainer>
    </div>
  );
};
