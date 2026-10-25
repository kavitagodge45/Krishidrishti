import { Response } from 'express';
import { supabase } from '../config/env.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getFarmerProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!supabase || !req.user) {
    res.status(401).json({
      success: false,
      status: 'ERROR',
      message: 'Farmer authentication required.',
      data: null,
      meta: { dataSource: 'Supabase', apiStatus: 'Unauthorized', databaseStatus: 'Active', timestamp: new Date().toISOString() }
    });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!data) {
      res.status(200).json({
        success: true,
        status: 'EMPTY',
        message: 'No profile found for this farmer account. Please complete registration profile.',
        data: null,
        meta: { dataSource: 'Supabase profiles', apiStatus: 'Ready', databaseStatus: 'Online', timestamp: new Date().toISOString() }
      });
      return;
    }

    res.status(200).json({
      success: true,
      status: 'SUCCESS',
      message: 'Farmer profile retrieved successfully.',
      data,
      meta: { dataSource: 'Supabase PostgreSQL RLS', apiStatus: 'Live', databaseStatus: 'Online', timestamp: new Date().toISOString() }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      status: 'ERROR',
      message: `Failed to retrieve profile: ${err.message}`,
      data: null,
      meta: { dataSource: 'Supabase profiles', apiStatus: 'Error', databaseStatus: 'Online', timestamp: new Date().toISOString() }
    });
  }
};

export const updateFarmerProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!supabase || !req.user) {
    res.status(401).json({ success: false, status: 'ERROR', message: 'Authentication required.', data: null, meta: { dataSource: 'Supabase', apiStatus: 'Unauthorized', databaseStatus: 'Active', timestamp: new Date().toISOString() } });
    return;
  }

  const { full_name, phone_number, state, district, taluka, village, pincode, primary_soil_type, total_land_acres, preferred_language } = req.body;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: req.user.id,
        full_name,
        phone_number,
        state: state || 'Maharashtra',
        district,
        taluka,
        village,
        pincode,
        primary_soil_type,
        total_land_acres,
        preferred_language: preferred_language || 'mr',
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      status: 'SUCCESS',
      message: 'Farmer profile updated successfully.',
      data,
      meta: { dataSource: 'Supabase PostgreSQL RLS', apiStatus: 'Live', databaseStatus: 'Online', timestamp: new Date().toISOString() }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      status: 'ERROR',
      message: `Failed to update profile: ${err.message}`,
      data: null,
      meta: { dataSource: 'Supabase profiles', apiStatus: 'Error', databaseStatus: 'Online', timestamp: new Date().toISOString() }
    });
  }
};

export const getFarmerPlots = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!supabase || !req.user) {
    res.status(401).json({ success: false, status: 'ERROR', message: 'Authentication required.', data: null, meta: { dataSource: 'Supabase', apiStatus: 'Unauthorized', databaseStatus: 'Active', timestamp: new Date().toISOString() } });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('plots')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      status: data && data.length > 0 ? 'SUCCESS' : 'EMPTY',
      message: data && data.length > 0 ? 'Farm plots retrieved successfully.' : 'No registered plots found for this farmer.',
      data: data || [],
      meta: { dataSource: 'Supabase plots (RLS)', apiStatus: 'Live', databaseStatus: 'Online', timestamp: new Date().toISOString() }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      status: 'ERROR',
      message: `Failed to retrieve farm plots: ${err.message}`,
      data: null,
      meta: { dataSource: 'Supabase plots', apiStatus: 'Error', databaseStatus: 'Online', timestamp: new Date().toISOString() }
    });
  }
};
