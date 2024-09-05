import axios from "axios";

const getCountryData = (callback, countryCode) => {
  if (countryCode !== undefined) {
    const response = axios.get(`http://localhost:3000/country/${countryCode}`);
    response.then((res) => {
      callback(res.data);
    });
  }
};

export default getCountryData;
