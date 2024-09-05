export type OpenCageResponse = {
  components: {
    city: string;
    country: string;
  };
  geometry: {
    lat: number;
    lng: number;
  };
  confidence: number;
};

export type SunriseSunsetResponse = {
  sunrise: string;
  sunset: string;
  date: string;
};

export type HourlyWeatherResponse = {
  startTime: string;
  values: {
    cloudBase: number | null;
    cloudCover: number;
    humidity: number;
    precipitationIntensity: number;
    precipitationProbability: number;
    precipitationType: number;
    rainAccumulation: number;
    snowAccumulation: number;
    temperature: number;
    temperatureApparent: number;
    weatherCode: number;
    windDirection: number;
    windGust: number;
    windSpeed: number;
  };
};
