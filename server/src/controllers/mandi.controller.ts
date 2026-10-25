import { Request, Response, NextFunction } from 'express';
import { fetchRealMandiPrices } from '../services/mandi.service.js';

export const getMandiPrices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commodity = req.query.commodity as string | undefined;
    const state = req.query.state as string | undefined;
    const search = req.query.search as string | undefined;

    const result = await fetchRealMandiPrices(commodity, state, search);

    if (!result.isConfigured) {
      res.status(503).json({
        success: false,
        status: 'UNCONFIGURED',
        message: result.message,
        data: [],
        meta: {
          dataSource: result.dataSource,
          apiStatus: 'KEY_NOT_CONFIGURED',
          databaseStatus: 'Active',
          timestamp: result.timestamp
        }
      });
      return;
    }

    if (!result.success) {
      res.status(502).json({
        success: false,
        status: 'ERROR',
        message: result.message,
        data: [],
        meta: {
          dataSource: result.dataSource,
          apiStatus: 'UPSTREAM_NOTICE',
          databaseStatus: 'Active',
          timestamp: result.timestamp
        }
      });
      return;
    }

    res.status(200).json({
      success: true,
      status: 'SUCCESS',
      message: result.message,
      data: result.records,
      meta: {
        dataSource: result.dataSource,
        apiStatus: 'LIVE_CONNECTED',
        databaseStatus: 'Active',
        totalRecords: result.totalRecords,
        timestamp: result.timestamp
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCommodities = (req: Request, res: Response): void => {
  // Verified commodities list
  const commodities = [
    'Soybean (Yellow)',
    'Onion (Red / Gavran)',
    'Wheat (Sharbati)',
    'Cotton (Medium Staple)',
    'Gram / Chana (Desi)',
    'Tomato (Hybrid)',
    'Grapes (Thompson Seedless)',
    'Pomegranate (Bhagwa)',
    'Maize (Yellow)'
  ];

  res.status(200).json({
    success: true,
    status: 'SUCCESS',
    message: 'Commodities list loaded.',
    data: commodities,
    meta: {
      dataSource: 'Agmarknet APMC Commodity Master',
      apiStatus: 'Static Verified Master',
      databaseStatus: 'Not Required',
      timestamp: new Date().toISOString()
    }
  });
};

export const getStates = (req: Request, res: Response): void => {
  const states = [
    'Maharashtra',
    'Madhya Pradesh',
    'Punjab',
    'Gujarat',
    'Rajasthan',
    'Karnataka',
    'Uttar Pradesh',
    'Haryana'
  ];

  res.status(200).json({
    success: true,
    status: 'SUCCESS',
    message: 'States list loaded.',
    data: states,
    meta: {
      dataSource: 'National APMC State Registry',
      apiStatus: 'Static Verified Master',
      databaseStatus: 'Not Required',
      timestamp: new Date().toISOString()
    }
  });
};
