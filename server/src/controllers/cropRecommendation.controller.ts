import { Request, Response, NextFunction } from 'express';

export const getSoilTypes = (req: Request, res: Response): void => {
  const soilTypes = [
    { id: 'black_regur', nameEn: 'Black Cotton Soil (Regur)', nameMr: 'काळी रेगूर जमीन', nameHi: 'काली कपास मिट्टी (रेगुर)' },
    { id: 'medium_black', nameEn: 'Medium Black Soil', nameMr: 'मध्यम काळी जमीन', nameHi: 'मध्यम काली मिट्टी' },
    { id: 'red_laterite', nameEn: 'Red / Laterite Soil', nameMr: 'तांबडी / जांभी जमीन', nameHi: 'लाल / लेटराइट मिट्टी' },
    { id: 'alluvial_loam', nameEn: 'Alluvial Loam', nameMr: 'गाळाची पोयटा जमीन', nameHi: 'जलोढ़ दोमट मिट्टी' },
    { id: 'sandy_loam', nameEn: 'Sandy Loam', nameMr: 'वालुकामय हलकी जमीन', nameHi: 'बलुई दोमट मिट्टी' }
  ];

  res.status(200).json({
    success: true,
    status: 'SUCCESS',
    message: 'Maharashtra & Indian Soil Classification Master loaded.',
    data: soilTypes,
    meta: {
      dataSource: 'ICAR / NBSS&LUP Soil Classification',
      apiStatus: 'Static Verified Master',
      databaseStatus: 'Not Required',
      timestamp: new Date().toISOString()
    }
  });
};

export const recommendCrops = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { district, soilType, landAcres, waterSource } = req.body;

    if (!district || !soilType) {
      res.status(400).json({
        success: false,
        status: 'ERROR',
        message: 'District and Soil Type are required fields.',
        data: null,
        meta: {
          dataSource: 'Crop Recommendation Engine',
          apiStatus: 'Validation Error',
          databaseStatus: 'Active',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    // In Phase 3, this indicates Phase 7 ICAR agronomic rules engine
    res.status(200).json({
      success: true,
      status: 'READY',
      message: 'ICAR agronomic rule engine will be activated in Phase 7.',
      data: null,
      meta: {
        dataSource: 'ICAR Agronomic Package of Practices',
        apiStatus: 'Pending Phase 7',
        databaseStatus: 'Active',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
