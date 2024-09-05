import axios from 'axios';
import { OpenCageResponse } from '@models/external/types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const zipcode = searchParams.get('zipcode');
  const country = searchParams.get('country') ?? 'US';

  if (!zipcode) {
    return Response.json({
      status: 400,
      error: 'Missing required zipcode parameters',
    });
  }

  const openCageApiKey = process.env.OPEN_CAGE_API_KEY;
  if (!openCageApiKey) {
    return Response.json({
      status: 500,
      message: 'OpenCage API Key not found',
    });
  }

  try {
    const response = await axios.get(
      'https://api.opencagedata.com/geocode/v1/json',
      {
        params: {
          q: `${zipcode}, ${country}`,
          key: openCageApiKey,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const mappedResults: OpenCageResponse[] = response.data.results.map(
      (result: any) => ({
        components: {
          city: result.components.city,
          country: result.components.country,
        },
        geometry: {
          lat: result.geometry.lat,
          lng: result.geometry.lng,
        },
        confidence: result.confidence,
      }),
    );

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
