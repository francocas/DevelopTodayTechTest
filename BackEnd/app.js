const express = require("express");
const axios = require("axios");
var cors = require("cors");
const PORT = process.env.PORT || 3000;
const app = express();
const countryRouter = express.Router();
const whitelist = ["http://localhost:3000", "http://localhost:3001"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
const reducedBorders = (borders) => {
  const reducedBorders = borders.map((el) => {
    return el.commonName;
  });
  return reducedBorders;
};

const searchCountryDetails = (countryCode, countryFlag) => {
  const filteredFlag = countryFlag.filter((flag) => flag.iso2 === countryCode);
  return [filteredFlag[0]?.flag, filteredFlag[0]?.iso3];
};

const searchCountryPopulation = (iso3, countryPopulation) => {
  const populationHist = countryPopulation.filter(
    (country) => country.iso3 === iso3,
  );
  return populationHist[0]?.populationCounts;
};

const processCountryData = (countryInfo, countryPopulation, countryFlag) => {
  const borders = reducedBorders(countryInfo.borders);
  const [flag, iso3] = searchCountryDetails(
    countryInfo.countryCode,
    countryFlag,
  );
  const populationHist = searchCountryPopulation(iso3, countryPopulation);
  let result = {
    countryName: countryInfo.commonName,
    borders,
    populationData: populationHist,
    flagUrl: flag,
  };
  return result;
};
app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

countryRouter.route("/").get(async (req, res) => {
  const response = await axios.get(
    "https://date.nager.at/api/v3/AvailableCountries",
  );
  res.status(200).send(response.data);
});

countryRouter.route("/:countryCode").get(async (req, res) => {
  let countryInfo = await axios.get(
    `https://date.nager.at/api/v3/CountryInfo/${req.params.countryCode}`,
  );
  let countryPopulation = await axios.get(
    `https://countriesnow.space/api/v0.1/countries/population`,
  );
  let countryFlag = await axios.get(
    `https://countriesnow.space/api/v0.1/countries/flag/images`,
  );
  let result = processCountryData(
    countryInfo.data,
    countryPopulation.data.data,
    countryFlag.data.data,
  );
  res.status(200).send(result);
});

app.use("/country", countryRouter);
