import React from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const GameMap = ({ geoJSONData, mapStyle, onEachFeature, colorScheme }) => (
  <div className="map-container" style={{ height: '350px', width: '100%', marginTop: '20px' }}>
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
      />
      {geoJSONData && <GeoJSON data={geoJSONData} style={mapStyle} onEachFeature={onEachFeature} />}
    </MapContainer>
  </div>
);

export default GameMap;