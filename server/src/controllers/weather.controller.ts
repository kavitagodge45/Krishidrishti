import { Request, Response, NextFunction } from 'express';
import { fetchRealWeatherForecast } from '../services/weather.service.js';

export const getWeatherAdvisory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const location = (req.query.location as string) || (req.query.district as string);
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : undefined;
    const state = req.query.state as string | undefined;
    const district = req.query.district as string | undefined;
    const taluka = req.query.taluka as string | undefined;

    const weatherData = await fetchRealWeatherForecast({
      location: location || 'Dindori Block, Nashik, MH (422202)',
      lat,
      lon,
      state,
      district,
      taluka
    });

    res.status(200).json({
      success: true,
      status: 'SUCCESS',
      message: `Live verified weather telemetry fetched from Open-Meteo for ${weatherData.locationName}.`,
      data: weatherData,
      meta: {
        dataSource: weatherData.dataSource,
        apiStatus: 'LIVE_CONNECTED',
        databaseStatus: 'Active',
        forecastTimestamp: weatherData.forecastTimestamp,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    res.status(502).json({
      success: false,
      status: 'ERROR',
      message: `Open-Meteo live weather telemetry request failed: ${error.message}. Under KrishiDrishti Zero Fake Data policy, fabricated weather values are strictly prohibited.`,
      data: null,
      meta: {
        dataSource: 'Open-Meteo API',
        apiStatus: 'UPSTREAM_ERROR',
        databaseStatus: 'Active',
        timestamp: new Date().toISOString()
      }
    });
  }
};
