
import { Card, CardContent ,createMuiTheme,FormControl, Typography ,ThemeProvider,TextField } from '@material-ui/core';
import React ,{useState,useEffect} from 'react'
import './App.css';
import Infobox from './Components/Infobox'
import LineGraph from './Components/LineGraph';
import Map from './Components/Maps'
import Table from './Components/Table'
import { prettyPrintStat, sortData ,sortDataRecoverd, sortDataDeaths} from './util';
import "leaflet/dist/leaflet.css"
import RalewayWoff2 from './IRASans.ttf';
import numeral from "numeral";
import Autocomplete from '@material-ui/lab/Autocomplete';

const byekan = {
  fontFamily: 'IRASans',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('IRASans'),
    local('IRASans-Regular'),
    url(${RalewayWoff2}) format('ttf')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const theme = createMuiTheme({
  typography: {
    fontFamily: 'IRASans, Arial',
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [byekan],
      },
    },
  },
});

function App() {
  const[countries , setCountires] = useState([]);
    const [country , setCountry] = useState('worldwide');
    const [countryInfo , setCountryInfo] = useState({});
const [tableData , setTableData ] = useState([]);
const [mapCenter, setMapCenter] = useState({lat:33.807446, lng:51.9896});
const [mapZoom, setMapZoom] = useState(3);

const [mapCountries, setMapCountries] =useState([]);
const [casesType, setCasesType] =useState("cases");
const [defaultValue , setDefaultValue] = useState({"name":"تمام دنیا","value":"worldwide"})
    useEffect(() => {
      fetch ('https://disease.sh/v3/covid-19/all')
      .then(respopns => respopns.json())
      .then(data => {
        setCountryInfo(data);
      })           
    }, []);

    useEffect(() => {
  
      const getCountriesData = async() => {
        await fetch("https://disease.sh/v3/covid-19/countries")
          .then((respons) => respons.json())
          .then((data) => {
            const countries = data.map((country)  =>  (
              {
                name: country.country,
                value: country.countryInfo.iso2,
              }
              
            ))

            const sortedData = casesType === "cases" ? sortData(data) : casesType === "recovered"? sortDataRecoverd(data) : sortDataDeaths(data);
            setTableData(sortedData);
            setMapCountries(data);
            setCountires (countries);
          })
      }
      getCountriesData();
    }, [casesType]);

    const clickCountry = (e) => {
      console.log("click",e)
    }
const onTagsChange = (event, values) => {
 
  console.log('values', values);
    let countryCode ;
    if(values === null) {
      countryCode = "worldwide";
      setDefaultValue({"name":"","value":"worldwide"});
      setMapCenter({lat:33.807446, lng:51.9896});
      setMapZoom(3);
    }else{
      countryCode = values["value"];
      setDefaultValue(values);
    }

        const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`
        const fetchData = async () => {

        console.log(url)
        await fetch(url)
                .then(response => response.json())
                .then(data => {
                  setCountry(countryCode);
                  setCountryInfo(data);
                  if (countryCode !== "worldwide"){
                    setMapCenter([Number( numeral(data.countryInfo.lat).format("0.00")) ,Number( numeral(data.countryInfo.long).format("0.00"))]);
                    setMapZoom(4.5);
                  }
                  
                })
              }
              fetchData();
}
  return (
<div className="App">
  <ThemeProvider theme={theme} >
<Card className="app_right">
    <CardContent>
          <h3>{`جدول ${casesType==="cases"? "موارد ابتلا": casesType==="recovered"? "بهبودیافتگان":"موارد مرگ و میر"} جهانی`}</h3>
          {/* Table */}
          <Table key="table" casesType={casesType}  countres={tableData} onClick={clickCountry}/>

          <h3 style={{marginTop: "20px",marginBottom: "20px"}}>{`نمودار ${casesType==="cases"? "موارد ابتلا": casesType==="recovered"? "بهبودیافتگان":"موارد مرگ و میر"}`}</h3>
          {/* graph */}
          <div >
          <LineGraph country={country}  casesType={casesType}/>
          </div>
         
    </CardContent>
  </Card>
  <div className="app__left">
    {/* Header */}
    <div className="app__header">
        <Typography variant="h4" component="h2" color="secondary" > (COVID-19) کرونا </Typography>
        <FormControl className="app__dropdown">

        <Autocomplete
         className="app__select" 
            id="combo-box-demo"
            options={countries}
            value ={defaultValue}
            getOptionLabel={(option) => option.name}
            defaultValue = {defaultValue}
            style={{ width: 300 }}
            onChange={onTagsChange}
            renderInput={(params) => <TextField {...params} placeholder="تمام دنیا" label="" variant="outlined" />}
          />
        </FormControl>
       
      </div>
     {/* infoBoxs */}
    <div className="app__stats">
    <Infobox isRed active={casesType === "deaths"} onClick={e => setCasesType("deaths")} cases={prettyPrintStat(countryInfo.todayDeaths)} total={countryInfo.deaths} title="موارد مرگ" />
      <Infobox active={casesType === "recovered"} onClick={e => setCasesType("recovered")} cases={prettyPrintStat(countryInfo.todayRecovered)}  total={countryInfo.recovered} title="موارد بهبود یافته" />
      <Infobox isRed active={casesType === "cases"} onClick={e => setCasesType("cases")} cases={prettyPrintStat(countryInfo.todayCases)} total={countryInfo.cases} title="موارد ابتلا" />
     
    </div>
    {/* Map */}
    <Map key="map" countries={mapCountries} casesType={casesType} center ={mapCenter} zoom ={mapZoom}/>
  </div>
  </ThemeProvider>
</div>
  );
}

export default App;
