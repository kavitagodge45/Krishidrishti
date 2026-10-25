import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { supabase } from '../config/env.js';

export const calculateEconomics = (req: AuthenticatedRequest, res: Response): void => {
  const {
    landAreaAcres = 1.0,
    cropName = 'General Crop',
    expectedYieldQuintalsPerAcre = 10,
    expectedMandiPricePerQuintal = 3000,
    costs = {}
  } = req.body;

  const perAcreCost =
    (costs.landPreparation || 0) +
    (costs.seeds || 0) +
    (costs.fertilizers || 0) +
    (costs.pesticidesAndProtection || 0) +
    (costs.irrigationAndElectricity || 0) +
    (costs.labor || 0) +
    (costs.harvestingAndTransport || 0);

  const totalCost = perAcreCost * landAreaAcres;
  const totalProductionQuintals = expectedYieldQuintalsPerAcre * landAreaAcres;
  const grossRevenue = totalProductionQuintals * expectedMandiPricePerQuintal;
  const netProfit = grossRevenue - totalCost;
  const costPerQuintal = totalProductionQuintals > 0 ? totalCost / totalProductionQuintals : 0;
  const profitMarginPercent = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

  res.status(200).json({
    success: true,
    status: 'SUCCESS',
    message: 'Farm economics calculated based on genuine user inputs.',
    data: {
      cropName,
      landAreaAcres,
      totalProductionQuintals,
      grossRevenue,
      totalCost,
      netProfit,
      costPerQuintal,
      profitMarginPercent,
      breakdown: {
        costPerAcre: perAcreCost,
        totalCost,
        grossRevenue,
        netProfit
      }
    },
    meta: {
      dataSource: 'User Arithmetic Calculation Engine',
      apiStatus: 'Mathematical Calculation',
      databaseStatus: 'Not Required',
      timestamp: new Date().toISOString()
    }
  });
};

export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!supabase || !req.user) {
      res.status(200).json({
        success: true,
        status: 'EMPTY',
        message: 'No authenticated user session. Sign in to view and save farm planner tasks.',
        data: [],
        meta: {
          dataSource: 'Supabase farm_tasks',
          apiStatus: 'Unauthenticated',
          databaseStatus: 'Online',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    const { data, error } = await supabase
      .from('farm_tasks')
      .select('*')
      .eq('user_id', req.user.id)
      .order('planned_date', { ascending: true });

    if (error) throw error;

    res.status(200).json({
      success: true,
      status: data && data.length > 0 ? 'SUCCESS' : 'EMPTY',
      message: data && data.length > 0 ? 'Farm planner tasks retrieved.' : 'No tasks scheduled yet.',
      data: data || [],
      meta: {
        dataSource: 'Supabase farm_tasks (RLS)',
        apiStatus: 'Live',
        databaseStatus: 'Online',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
