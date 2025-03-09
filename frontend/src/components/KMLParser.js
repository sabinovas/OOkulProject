import React, { useState } from "react";
import * as toGeoJSON from "@tmcw/togeojson";
import { SummaryTable } from "./SummaryTable";
import { DetailsTable } from "./DetailsTable";

export const KMLParser = ({ onGeoJsonParsed }) => {
  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      const geoJson = toGeoJSON.kml(xmlDoc);
      const convertedGeoJson = convertToLeafletGeoJson(geoJson, xmlDoc);

      if (typeof onGeoJsonParsed === "function") {
        onGeoJsonParsed(convertedGeoJson);
      }
      processKMLData(convertedGeoJson);
    };
    reader.readAsText(file);
  };

  const convertToLeafletGeoJson = (geoJson, kmlDoc) => {
    const features = geoJson.features.map((feature) => {
      if (feature.geometry.type === "Point") {
        const [lng, lat] = feature.geometry.coordinates;
        return {
          ...feature,
          geometry: { type: "Point", coordinates: [lat, lng] },
        };
      } else if (
        feature.geometry.type === "LineString" ||
        feature.geometry.type === "MultiLineString"
      ) {
        return {
          ...feature,
          geometry: {
            ...feature.geometry,
            coordinates: feature.geometry.coordinates.map(([lng, lat]) => [
              lat,
              lng,
            ]),
          },
        };
      }
      return feature;
    });

    const groundOverlays = kmlDoc.getElementsByTagName("GroundOverlay");
    for (let overlay of groundOverlays) {
      const name =
        overlay.getElementsByTagName("name")[0]?.textContent ||
        "Unknown Overlay";
      const href = overlay.getElementsByTagName("href")[0]?.textContent || null;
      const latLonBox = overlay.getElementsByTagName("LatLonBox")[0];

      if (latLonBox) {
        const north = parseFloat(
          latLonBox.getElementsByTagName("north")[0]?.textContent
        );
        const south = parseFloat(
          latLonBox.getElementsByTagName("south")[0]?.textContent
        );
        const east = parseFloat(
          latLonBox.getElementsByTagName("east")[0]?.textContent
        );
        const west = parseFloat(
          latLonBox.getElementsByTagName("west")[0]?.textContent
        );

        const polygonFeature = {
          type: "Feature",
          properties: { name, href },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [north, west],
                [north, east],
                [south, east],
                [south, west],
                [north, west],
              ],
            ],
          },
        };
        features.push(polygonFeature);
      }
    }
    return { type: "FeatureCollection", features };
  };

  const calculateLineStringLength = (coordinates) => {
    let totalLength = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      const [lat1, lon1] = coordinates[i];
      const [lat2, lon2] = coordinates[i + 1];
      const R = 6371e3; // Earth radius in meters
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalLength += R * c;
    }
    return totalLength.toFixed(2) + " m";
  };

  const processKMLData = (geoJson) => {
    const summaryData = {};
    const detailsData = [];

    geoJson.features.forEach((feature) => {
      const type = feature.geometry.type;
      summaryData[type] = (summaryData[type] || 0) + 1;

      if (type === "LineString") {
        const length = calculateLineStringLength(feature.geometry.coordinates);
        detailsData.push({ type, totalLength: length });
      } else if (type === "MultiLineString") {
        let totalLength = feature.geometry.coordinates.reduce(
          (sum, line) => sum + parseFloat(calculateLineStringLength(line)),
          0
        );
        detailsData.push({ type, totalLength: totalLength.toFixed(2) + " m" });
      } else if (type === "Polygon") {
        detailsData.push({ type, totalLength: "N/A (GroundOverlay)" });
      } else {
        detailsData.push({ type, totalLength: "N/A" });
      }
    });

    setSummary(summaryData);
    setDetails(detailsData);
  };

  return (
    <div>
      <input type="file" accept=".kml" onChange={handleFileUpload} />
      {summary && <SummaryTable summary={summary} />}
      {details && <DetailsTable details={details} />}
    </div>
  );
};
