import axios from 'axios';
import { HourlyWeatherResponse } from '@models/external/types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');

  if (!latitude || !longitude) {
    return Response.json({
      status: 400,
      error: 'Missing required latitude or longitude parameters',
    });
  }

  const tomorrowIoApiKey = process.env.TOMORROW_IO_API_KEY;
  if (!tomorrowIoApiKey) {
    return Response.json({
      status: 500,
      message: 'TomorrowIO API Key not found',
    });
  }

  try {
    const response = await axios.get('https://api.tomorrow.io/v4/timelines', {
      params: {
        location: `${latitude},${longitude}`,
        fields: [
          'temperature',
          'temperatureApparent',
          'humidity',
          'windSpeed',
          'windGust',
          'windDirection',
          'precipitationProbability',
          'precipitationIntensity',
          'precipitationType',
          'rainAccumulation',
          'snowAccumulation',
          'cloudCover',
          'cloudBase',
          'weatherCode',
        ].join(','),
        timesteps: '1h',
        units: 'imperial',
        timezone: 'auto',
      },
      headers: {
        'Content-Type': 'application/json',
        apikey: tomorrowIoApiKey,
      },
    });

    const hourlyWeatherData: HourlyWeatherResponse[] = response.data.data.timelines[0]
      .intervals.map((interval: any) => ({
        startTime: interval.startTime,
        values: {
          cloudBase: interval.values.cloudBase,
          cloudCover: interval.values.cloudCover,
          humidity: interval.values.humidity,
          precipitationIntensity: interval.values.precipitationIntensity,
          precipitationProbability: interval.values.precipitationProbability,
          precipitationType: interval.values.precipitationType,
          rainAccumulation: interval.values.rainAccumulation,
          snowAccumulation: interval.values.snowAccumulation,
          temperature: interval.values.temperature,
          temperatureApparent: interval.values.temperatureApparent,
          weatherCode: interval.values.weatherCode,
          windDirection: interval.values.windDirection,
          windGust: interval.values.windGust,
          windSpeed: interval.values.windSpeed,
        },
      }));

    return Response.json(hourlyWeatherData, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return Response.json({
        status: error.response.status,
        error: error.message,
        details: error.response.data,
      });
    }
    return Response.json({
      status: 500,
      error: 'An unexpected error occurred',
    });
  }
}
