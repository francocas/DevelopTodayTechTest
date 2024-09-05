import "./App.css";
import React, { useState } from "react";
import axios from "axios";
import CountrySelector from "./countryList";
import { CChart } from "@coreui/react-chartjs";

const url = "http://localhost:3000/country/";
const response = await axios.get(url);
const parsedData = response.data.map((country) => {
  return {
    value: country.countryCode,
    label: country.name,
  };
});

const parsePopulationData = (selectedCountry) => {
  if (selectedCountry?.populationData) {
    const years = selectedCountry.populationData.map((el) => {
      return el.year;
    });
    const values = selectedCountry.populationData.map((el) => {
      return el.value;
    });
    return [years, values];
  }
  return [0, 0];
};

const App = () => {
  const [selectedCountry, setSelectedCountry] = useState({});
  const [pickedCountry, setpickedCountry] = useState("");
  const borderOnClick = (val) => {
    const result = parsedData.filter((el) => el.label === val);
    setpickedCountry(result[0]);
  };
  const borderCountries = selectedCountry.borders?.map((c) => (
    <p
      onClick={(c) => {
        borderOnClick(c.target.textContent);
      }}
      className="borderCountry"
    >
      {c}
    </p>
  ));
  const [popDataYear, popDataValue] = parsePopulationData(selectedCountry);
  return (
    <>
      <div className="App">
        <CountrySelector
          pickedCountry={pickedCountry}
          countries={parsedData}
          onSelect={setSelectedCountry}
        ></CountrySelector>
      </div>
      {selectedCountry.countryName ? (
        <div className="countryInfoContainer">
          <div className="selectedCountry">{selectedCountry.countryName}</div>
          <div className="countryFlag">
            <img src={selectedCountry.flagUrl} height={100} width={160} />
          </div>
          <div className="borderCountries">{borderCountries}</div>
          <div className="populationChart">
            <CChart
              type="bar"
              data={{
                labels: popDataYear,
                datasets: [
                  {
                    label: "Population",
                    backgroundColor: "#007979",
                    data: popDataValue,
                  },
                ],
              }}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default App;
