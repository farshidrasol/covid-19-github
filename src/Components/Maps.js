import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { showDataOnMap } from "./../util";
import "./../Styles/Map.css";


function Maps({ countries, casesType, center, zoom }) {
  
  const [centerMap, setCenterMap] = useState({lat:33.807446, lng:51.9896});

  useEffect(() => {
    setCenterMap(center);
  },[center]);
 let keyMAP = Math.random();
  return (
    <div className="map">
     <MapContainer key={keyMAP} center={centerMap} zoom={zoom}>
    <TileLayer
     attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    { showDataOnMap(countries,casesType)}
  </MapContainer>
    </div>
  );
}

export default Maps;