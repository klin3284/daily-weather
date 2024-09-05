import axios from 'axios';
import { SunriseSunsetResponse } from '@modelsexternal/types';

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

  try {
    const response = await axios.get('https://api.sunrisesunset.io/json', {
      params: {
        lat: latitude,
        lng: longitude,
        formatted: 0,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const mappedResults: SunriseSunsetResponse = {
      sunrise: response.data.results.sunrise,
      sunset: response.data.results.sunset,
      date: response.data.results.date,
    };

    return Response.json(mappedResults, { status: response.status });
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
