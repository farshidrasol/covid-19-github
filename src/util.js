import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";
import './Styles/util.css'
import PN from "persian-number";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    rgb: "rgb(204, 16, 52)",
    half_op: "rgba(204, 16, 52, 0.5)",
    multiplier: 250,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125, 215, 29)",
    half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 300,
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(251, 68, 67)",
    half_op: "rgba(251, 68, 67, 0.5)",
    multiplier: 400,
  }
};

export const sortData = (data) => {
  let sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

export const sortDataRecoverd = (data) => {
    let sortedData = [...data];
    sortedData.sort((a, b) => {
      if (a.recovered > b.recovered) {
        return -1;
      } else {
        return 1;
      }
    });
    return sortedData;
  };
  export const sortDataDeaths = (data) => {
    let sortedData = [...data];
    sortedData.sort((a, b) => {
      if (a.deaths > b.deaths) {
        return -1;
      } else {
        return 1;
      }
    });
    return sortedData;
  };
  
export const prettyPrintStat = (stat) =>
  stat ? `+${PN.convertEnToPe(numeral(stat).format("0.0a"))}` : "+۰";

export const showDataOnMap = (data, casesType) =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            مبتلایان: {PN.convertEnToPe(numeral(country.cases).format("0,0"))}
          </div>
          <div className="info-recovered">
            بهبودیافتگان: {PN.convertEnToPe(numeral(country.recovered).format("0,0"))}
          </div>
          <div className="info-deaths">
            مرگ و میر: {PN.convertEnToPe(numeral(country.deaths).format("0,0"))}
          </div>
        </div>
      </Popup>
    </Circle>
  ));