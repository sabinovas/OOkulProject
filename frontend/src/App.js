import React, { useState } from "react";
import { KMLParser } from "./components/KMLParser";
import { MapViewer } from "./components/MapViewer";

const App = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  const handleGeoJsonParsed = (data) => {
    console.log("Parsed GeoJSON Data:", data);
    setGeoJsonData(data);
  };

  return (
    <div>
      <h1>KML Viewer</h1>
      <KMLParser onGeoJsonParsed={handleGeoJsonParsed} />
      {geoJsonData && <MapViewer geoJsonData={geoJsonData} />}
    </div>
  );
};

export default App;
