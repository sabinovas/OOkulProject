# OOkul

# 🗺️ OOkul KML Viewer

This project is a **KML file visualizer** built with **React** and **Leaflet**. It allows users to upload `.kml` files, parses their contents, displays key metadata in summary and detail tables, and visualizes geographic data such as markers, lines, and ground overlays on an interactive map.

---

## 🚀 Features

- 📂 Upload and parse `.kml` files.
- 📊 View summary table with counts of geometry types.
- 📏 View detailed table with geometry types and length info (if applicable).
- 🗺️ Display points, lines, and overlays on an interactive **Leaflet.js** map.
- 🖼️ Show `GroundOverlay` images in their specified bounds.

---

## 🛠️ Tech Stack

- React
- Leaflet.js (`react-leaflet`)
- KML to GeoJSON conversion using [`@tmcw/togeojson`](https://www.npmjs.com/package/@tmcw/togeojson)

---

## 📦 Installation



```bash
git clone https://github.com/sabinovas/OOkul.git
cd OOkul/frontend

npm install
npm start

🧪 How to Use
Run the app.
Upload a .kml file using the file input.
The app will:
Parse the KML data.
Show element summary and details.
Display the elements on the map.
Supported Elements:

Points (shown as markers)
LineStrings and MultiLineStrings
GroundOverlays (shown as image overlays)

