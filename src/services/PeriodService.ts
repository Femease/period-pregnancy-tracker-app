import { PrismaClient } from '@prisma/client';
import { Logger } from '../utils/logger';
import { tensorFlowPredictor, TensorFlowPredictor } from '../utils/tensorFlowPredictor';
import { differenceInDays } from 'date-fns';

const prisma = new PrismaClient();

export async function getCycleInsights(userId: string): Promise<any> {
  try {
    const periodTracker = await prisma.periodTracker.findUnique({
      where: { userId },
      include: {
        periods: {
          orderBy: { startDate: 'desc' }
        },
        symptoms: true
      }
    });

    if (!periodTracker) {
      throw new Error('Period tracker not found');
    }

    // Get ML predictions
    const prediction = await tensorFlowPredictor.predict({
      periods: periodTracker.periods,
      symptoms: periodTracker.symptoms
    });

    const currentPhase = determinePhase(periodTracker);
    const phaseInfo = getPhaseInfo(currentPhase);

    return {
      currentDay: calculateCurrentDay(periodTracker),
      phase: currentPhase,
      phaseDetails: phaseInfo,
      predictedNextPeriod: prediction.nextPeriodDate,
      predictionConfidence: prediction.confidence,
      predictedSymptoms: prediction.predictedSymptoms,
      cycleDuration: prediction.cycleDuration,
      moodPatterns: analyzeMoodPatterns(periodTracker.symptoms),
      energyLevels: analyzeEnergyLevels(periodTracker.symptoms),
      dailyRecommendations: generateRecommendations(currentPhase),
      cycleMetrics: {
        averageCycle: calculateAverageCycle(periodTracker),
        regularity: determineRegularity(periodTracker),
        significantChanges: identifyChanges(periodTracker),
      },
    };
  } catch (error) {
    Logger.error('Failed to get cycle insights:', error);
    throw new Error('Failed to get cycle insights');
  }
}



export async function logPeriodStart(userId: string, date: Date): Promise<void> {
  try {
    const periodTracker = await prisma.periodTracker.findUnique({
      where: { userId },
      include: {
        periods: true,
        symptoms: true
      }
    });

    if (!periodTracker) {
      throw new Error('Period tracker not found');
    }

    const newPeriod = await prisma.period.create({
      data: {
        periodTrackerId: periodTracker.id,
        startDate: date
      }
    });

    // Retrain model with new period data
    await tensorFlowPredictor.train({
      periods: [...periodTracker.periods, newPeriod],
      symptoms: periodTracker.symptoms
    });
  } catch (error) {
    Logger.error('Failed to log period start:', error);
    throw new Error('Failed to log period start');
  }
}

export async function logPeriodEnd(userId: string, date: Date): Promise<void> {
  try {
    const periodTracker = await prisma.periodTracker.findUnique({
      where: { userId },
      include: {
        periods: {
          where: { endDate: null },
          orderBy: { startDate: 'desc' },
          take: 1
        },
        symptoms: true
      }
    });

    if (!periodTracker || !periodTracker.periods[0]) {
      throw new Error('No active period found');
    }

    const updatedPeriod = await prisma.period.update({
      where: { id: periodTracker.periods[0].id },
      data: { endDate: date }
    });

    // Retrain model with updated period data
    await tensorFlowPredictor.train({
      periods: [
        ...periodTracker.periods.filter(p => p.id !== updatedPeriod.id),
        updatedPeriod
      ],
      symptoms: periodTracker.symptoms
    });
  } catch (error) {
    Logger.error('Failed to log period end:', error);
    throw new Error('Failed to log period end');
  }
}

function calculateCurrentDay(tracker: any): number {
  try {
    const sortedPeriods = tracker.periods
      .sort((a: any, b: any) => b.startDate.getTime() - a.startDate.getTime());
    
    const lastPeriod = sortedPeriods[0];
    if (!lastPeriod) return 0;

    const today = new Date();
    const lastPeriodDate = new Date(lastPeriod.startDate);

    // Use date-fns to calculate the difference
    const diffDays = differenceInDays(today, lastPeriodDate);

    console.log({
      today: today.toISOString(),
      lastPeriodDate: lastPeriodDate.toISOString(),
      diffDays: diffDays
    }); 

    return diffDays + 1;
  } catch (error) {
    console.error('Error calculating current day:', error);
    return 0;
  }
}

function determinePhase(tracker: any): 'menstrual' | 'follicular' | 'ovulation' | 'luteal' {
  const currentDay = calculateCurrentDay(tracker);
  
  if (currentDay <= 5) return 'menstrual';
  if (currentDay <= 14) return 'follicular';
  if (currentDay <= 16) return 'ovulation';
  return 'luteal';
}

function getPhaseInfo(phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal') {
  const phaseInfo = {
    menstrual: {
      duration: '1-5 days',
      symptoms: ['cramping', 'fatigue', 'mood changes'],
      recommendations: [
        'Rest when needed',
        'Stay hydrated',
        'Light exercise if comfortable'
      ]
    },
    follicular: {
      duration: '6-14 days',
      symptoms: ['increased energy', 'improved mood'],
      recommendations: [
        'Good time for high-intensity workouts',
        'Start new projects'
      ]
    },
    ovulation: {
      duration: '15-16 days',
      symptoms: ['mild pain', 'increased energy'],
      recommendations: [
        'Peak energy time',
        'Good for social activities'
      ]
    },
    luteal: {
      duration: '17-28 days',
      symptoms: ['breast tenderness', 'mood changes', 'fatigue'],
      recommendations: [
        'Focus on self-care',
        'Gentle exercise'
      ]
    }
  };

  return phaseInfo[phase];
}

function analyzeMoodPatterns(symptoms: any[]): any[] {
  return symptoms
    .filter(s => s.type === 'mood_changes')
    .map(s => ({
      date: s.timestamp,
      mood: s.notes || 'unspecified',
      intensity: s.severity
    }));
}

function analyzeEnergyLevels(symptoms: any[]): any[] {
  return symptoms
    .filter(s => s.type === 'fatigue')
    .map(s => ({
      date: s.timestamp,
      level: 5 - s.severity
    }));
}

function generateRecommendations(phase: string): string[] {
  const phaseInfo = getPhaseInfo(phase as 'menstrual' | 'follicular' | 'ovulation' | 'luteal');
  return phaseInfo.recommendations;
}

function calculateAverageCycle(tracker: any): number {
  const periods = tracker.periods
    .sort((a: any, b: any) => a.startDate.getTime() - b.startDate.getTime());

  if (periods.length < 2) return 28;

  const cycleLengths = [];
  for (let i = 1; i < periods.length; i++) {
    const cycleLength = Math.floor(
      (periods[i].startDate.getTime() - periods[i-1].startDate.getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    cycleLengths.push(cycleLength);
  }

  return Math.round(
    cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length
  );
}

function determineRegularity(tracker: any): string {
  const periods = tracker.periods
    .sort((a: any, b: any) => a.startDate.getTime() - b.startDate.getTime());

  if (periods.length < 3) return 'insufficient data';

  const cycleLengths = [];
  for (let i = 1; i < periods.length; i++) {
    const cycleLength = Math.floor(
      (periods[i].startDate.getTime() - periods[i-1].startDate.getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    cycleLengths.push(cycleLength);
  }

  const variation = Math.max(...cycleLengths) - Math.min(...cycleLengths);
  
  if (variation <= 3) return 'very regular';
  if (variation <= 7) return 'regular';
  if (variation <= 14) return 'somewhat irregular';
  return 'irregular';
}

function identifyChanges(tracker: any): Array<{
  type: string;
  description: string;
  date: Date;
}> {
  const changes = [];
  const averageCycle = calculateAverageCycle(tracker);
  const periods = tracker.periods
    .sort((a: any, b: any) => b.startDate.getTime() - a.startDate.getTime());

  for (let i = 1; i < periods.length; i++) {
    const cycleLength = Math.floor(
      (periods[i-1].startDate.getTime() - periods[i].startDate.getTime()) / 
      (1000 * 60 * 60 * 24)
    );

    if (Math.abs(cycleLength - averageCycle) > 7) {
      changes.push({
        type: 'cycle_length_change',
        description: `Unusual cycle length of ${cycleLength} days`,
        date: periods[i-1].startDate
      });
    }
  }

  return changes;
}

export async function getSymptomHistory(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<Array<{ type: string; severity: number; notes?: string; timestamp: Date }>> {
  try {
    const periodTracker = await prisma.periodTracker.findUnique({
      where: { userId },
      include: {
        symptoms: {
          where: {
            timestamp: {
              gte: startDate,
              lte: endDate || new Date()
            }
          }
        }
      }
    });

    if (!periodTracker) {
      throw new Error('Period tracker not found');
    }

    return periodTracker.symptoms.map(s => ({
      type: s.type,
      severity: s.severity,
      notes: s.notes || undefined,
      timestamp: s.timestamp
    }));
  } catch (error) {
    Logger.error('Failed to get symptom history:', error);
    throw new Error('Failed to get symptom history');
  }
}

export async function getCycleAnalytics(userId: string): Promise<{
  averageCycle: number;
  regularity: string;
  symptoms: Record<string, number>;
}> {
  try {
    const periodTracker = await prisma.periodTracker.findUnique({
      where: { userId },
      include: {
        periods: true,
        symptoms: true
      }
    });

    if (!periodTracker) {
      throw new Error('Period tracker not found');
    }

    const symptomPatterns: Record<string, number> = {};
    periodTracker.symptoms.forEach(symptom => {
      symptomPatterns[symptom.type] = (symptomPatterns[symptom.type] || 0) + 1;
    });

    return {
      averageCycle: calculateAverageCycle(periodTracker),
      regularity: determineRegularity(periodTracker),
      symptoms: symptomPatterns
    };
  } catch (error) {
    Logger.error('Failed to get cycle analytics:', error);
    throw new Error('Failed to get cycle analytics');
  }
}

export function logSymptoms(userId: any, symptoms: any[]) {
  throw new Error('Function not implemented.');
}
export async function updatePeriodLength(periodTrackerId: string, lengthInDays: number) {
  try {
    // Validate input
    if (!periodTrackerId) {
      throw new Error('Period tracker ID is required');
    }

    if (typeof lengthInDays !== 'number' || lengthInDays < 1 || lengthInDays > 15) {
      throw new Error('Period length should be between 1 and 15 days');
    }

    // Get the existing period tracker
    const existingPeriodTracker = await prisma.periodTracker.findUnique({
      where: { id: periodTrackerId }
    });

    if (!existingPeriodTracker) {
      throw new Error('Period tracker not found');
    }

    // Get the most recent period
    const mostRecentPeriod = await prisma.period.findFirst({
      where: { 
        periodTrackerId,
        endDate: null  // Only get periods without an end date
      },
      orderBy: { startDate: 'desc' }
    });

    if (!mostRecentPeriod) {
      throw new Error('No active period found for this tracker');
    }

    // Calculate end date based on start date and length
    const endDate = new Date(mostRecentPeriod.startDate);
    endDate.setDate(endDate.getDate() + lengthInDays - 1); // -1 because the start date counts as day 1

    // Update the period using the period's ID, not the tracker ID
    const updatedPeriod = await prisma.period.update({
      where: { 
        id: mostRecentPeriod.id  // Use the period's ID here
      },
      data: {
        endDate: endDate
      }
    });

    return {
      success: true,
      message: `Updated period length to ${lengthInDays} days`,
      period: updatedPeriod
    };

  } catch (error: any) {
    Logger.error('Failed to update period length:', error);
    return {
      success: false,
      message: error.message || 'Failed to update period length'
    };
  }
}

export async function updateCycleLength(periodTrackerId: string, cycle_length: any) {
  try {
    // Validate input as number
    const cycleLengthNum = parseInt(cycle_length);
    if (isNaN(cycleLengthNum) || cycleLengthNum < 21 || cycleLengthNum > 45) {
      throw new Error('Cycle length must be between 21 and 45 days');
    }
console.log(periodTrackerId)

    // Get the most recent period for this tracker
    const mostRecentPeriod = await prisma.period.findFirst({
      where: { 
        periodTrackerId: periodTrackerId,
        endDate: null
      },
      orderBy: { startDate: 'desc' }
    });
console.log(mostRecentPeriod)
    if (!mostRecentPeriod) {
      throw new Error('No active period found for this tracker');
    }

    const updatedPeriod = await prisma.period.update({
      where: { 
        id: mostRecentPeriod.id
      },
      data: {
        cycleLength: cycleLengthNum
      }
    });

    return {
      success: true,
      message: `Cycle length updated to ${cycleLengthNum} days`,
      period: updatedPeriod
    };

  } catch (error: any) {
    Logger.error('Failed to update cycle length:', error);
    return {
      success: false,
      message: error.message || 'Failed to update cycle length'
    };
  }
}