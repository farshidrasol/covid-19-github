import React, { useState, useEffect } from "react";
import { Bar ,Chart } from "react-chartjs-2";
import numeral from "numeral";
import PN from "persian-number";


const options = {
  legend: {
    display: false,
    labels: {
      // This more specific font property overrides the global property
      fontFamily: 'IRANSans'
  },
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return  PN.convertEnToPe(numeral(tooltipItem.value).format("+0,0"));
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return PN.convertEnToPe(numeral(value).format("0a"));
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType,country) => {
  let chartData = [];
  let lastDataPoint;
if (country === "worldwide"){
  for (let date in data[casesType]) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
}else{
  for (let date in data.timeline[casesType]) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data.timeline[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data.timeline[casesType][date];
  }
}
 
  return chartData;
};

function LineGraph({ casesType ,country }) {
  const [dataChart, setData] = useState({});
  Chart.defaults.global.defaultFontFamily = 'IRASans';
  useEffect(() => {
    const fetchData = async () => {
      const url = country === 'worldwide' ? 'https://disease.sh/v3/covid-19/historical/all?lastdays=60' : `https://disease.sh/v3/covid-19/historical/${country}?lastdays=60`
      await fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType,country);
          setData(chartData);
          // buildChart(chartData);
        });
    };

    fetchData();
  }, [casesType,country]);

  return (
    <div>
      {dataChart?.length > 0 && (
        <Bar height={200} 
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                fontFamily: "IRASans",
                data: dataChart,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;