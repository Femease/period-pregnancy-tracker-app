import { Request, Response } from 'express';
import * as PeriodService from '../services/PeriodService';
import { Logger } from '../utils/logger';


// Define interface for symptom input
interface Symptom {
  type: string;
  severity: number;
  notes?: string;
}

export const getCycleInsights = async (req: any, res: any): Promise<void> => {
  try {
    const userId = req.user.id;
    const insights = await PeriodService.getCycleInsights(userId);
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    Logger.error('Failed to get cycle insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cycle insights'
    });
  }
};

//log symptoms api
export const logSymptoms = async (req: any, res: any): Promise<void> => {
  try {
    const userId = req.user.id;
    const symptoms: Symptom[] = req.body.symptoms;

    if (!Array.isArray(symptoms)) {
      res.status(400).json({
        success: false,
        error: 'Symptoms must be an array'
      });
      return;
    }

    await PeriodService.logSymptoms(userId, symptoms);
    res.json({
      success: true,
      message: 'Symptoms logged successfully'
    });
  } catch (error) {
    Logger.error('Failed to log symptoms:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to log symptoms'
    });
  }
};



// period start date api

  export const logPeriodStart = async (req: any, res: any): Promise<void> => {
  try {
    const userId = req.user.id;
    const { date } = req.body;

    if (!date) {
      res.status(400).json({
        success: false,
        error: 'Date is required'
      });
      return;
    }

    await PeriodService.logPeriodStart(userId, new Date(date));
    res.json({
      success: true,
      message: 'Period start logged successfully'
    });
  } catch (error) {
    console.log(error);
    Logger.error('Failed to log period start:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to log period star0t'
    });
  }
};

//period long last api
export const updatePeriodLength = async (req: any, res: any) => {
  try {
    const { periodTrackerId, lengthInDays } = req.body;

    if (!periodTrackerId || !lengthInDays) {
      return res.status(400).json({
        success: false,
        message: 'Period tracker ID and length are required'
      });
    }

    const period = await PeriodService.updatePeriodLength(
          periodTrackerId,
      lengthInDays
    );

    return res.status(200).json({
      success: true,
      data: period
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

export const updateCycleLength = async (req: any, res: any) => {
  try {
    const { periodTrackerId, cycle_length } = req.body;

          if (!periodTrackerId || !cycle_length) {
      return res.status(400).json({
        success: false,
        message: 'Period tracker ID and cycle length are required'
      });
    }

    const period = await PeriodService.updateCycleLength(
          periodTrackerId,
          cycle_length
    );

    return res.status(200).json({
      success: true,
      data: period
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

export const getSymptomHistory = async (req: any, res: any): Promise<void> => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const history = await PeriodService.getSymptomHistory(
      userId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    Logger.error('Failed to get symptom history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get symptom history'
    });
  }
};

export const getCycleAnalytics = async (req: any, res: any): Promise<void> => {
  try {
    const userId = req.user.id;
    const analytics = await PeriodService.getCycleAnalytics(userId);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.log(error);
    Logger.error('Failed to get cycle analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cycle analytics'
    });
  }
};