import React, { useState, useMemo, useEffect } from "react";
import Select from "react-select";
import getCountryData from "./utils";

function CountrySelector(props) {
  const [value, setValue] = useState("");
  const options = useMemo(() => props.countries, []);
  useEffect(() => {
    if (props.pickedCountry) {
      changeHandler(props.pickedCountry);
    }
  }, [props.pickedCountry]);

  const changeHandler = (newValue) => {
    setValue(newValue);
    getCountryData(props.onSelect, newValue.value);
  };

  return <Select options={options} value={value} onChange={changeHandler} />;
}

export default CountrySelector;
