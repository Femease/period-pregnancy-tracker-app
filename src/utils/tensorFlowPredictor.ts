import * as tf from '@tensorflow/tfjs';  // Changed import
import { Period, Symptom } from '@prisma/client';

export class TensorFlowPredictor {
  private model: tf.Sequential;

  constructor() {
    this.model = this.createModel();
  }

  private createModel(): tf.Sequential {
    const model = tf.sequential();
    
    // Input layer with features
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [8] // [lastCycleLength, avgCycleLength, symptomSeverity, daysSinceLastPeriod, seasonalEffect, age, stress, temperature]
    }));
    
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 3 })); // [nextPeriodDays, cycleDuration, symptomLikelihood]

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    return model;
  }

  async predict(data: {
    periods: Period[];
    symptoms: Symptom[];
    age?: number;
    stress?: number;
    temperature?: number;
  }): Promise<{
    nextPeriodDates: { start: Date; end: Date }[];
    cycleDurations: number[];
    ovulationWindows: { start: Date; end: Date }[];
    fertileWindows: { start: Date; end: Date }[];
    confidence: number;
    predictedSymptoms: string[];
  }> {
    try {
      const input = this.prepareInput(data);
      const prediction = this.model.predict(input) as tf.Tensor;
      const [nextPeriodDays, cycleDuration, symptomLikelihood] = await prediction.data();
  
      const lastPeriod = [...data.periods].sort((a, b) =>
        b.startDate.getTime() - a.startDate.getTime()
      )[0];
  
      // Ensure there was at least one period to calculate from
      if (!lastPeriod) {
        throw new Error('No period data available');
      }
  
      // Calculate the average cycle length if multiple periods are available
      const cycleDurations: number[] = [];
      let totalCycleLength = 0;
      for (let i = 1; i < data.periods.length; i++) {
        const prevPeriod = data.periods[i - 1];
        const currentPeriod = data.periods[i];
        const cycleLength = (currentPeriod.startDate.getTime() - prevPeriod.startDate.getTime()) / (1000 * 3600 * 24);
        cycleDurations.push(cycleLength);
        totalCycleLength += cycleLength;
      }
  
      const avgCycleDuration = totalCycleLength / cycleDurations.length || 28; // Default to 28 days if no data
  
      // Calculate next period date and ovulation/fertile windows based on the average cycle length
      const nextPeriodDates: { start: Date; end: Date }[] = [];
      const ovulationWindows: { start: Date; end: Date }[] = [];
      const fertileWindows: { start: Date; end: Date }[] = [];
      
      let currentStartDate = new Date(lastPeriod.startDate);
      
      // Predict for the next 4 periods
      for (let i = 0; i < 4; i++) {
        // Predict the next period start date based on the average cycle length
        currentStartDate.setDate(currentStartDate.getDate() + Math.round(avgCycleDuration));
        const nextPeriodStartDate = new Date(currentStartDate);
        
        // Calculate the end date of the period (usually 5-7 days after the start)
        const nextPeriodEndDate = new Date(nextPeriodStartDate);
        nextPeriodEndDate.setDate(nextPeriodEndDate.getDate() + 5); // Assuming a 5-day period
  
        nextPeriodDates.push({ start: nextPeriodStartDate, end: nextPeriodEndDate });
  
        // Ovulation calculation: Ovulation happens around 14 days before the next period
        const ovulationStartDate = new Date(nextPeriodStartDate);
        ovulationStartDate.setDate(ovulationStartDate.getDate() - (cycleDuration - 14)); // Ovulation 14 days before period
        const ovulationEndDate = new Date(ovulationStartDate);
        ovulationEndDate.setDate(ovulationEndDate.getDate() + 1); // Ovulation lasts 1-2 days
  
        ovulationWindows.push({ start: ovulationStartDate, end: ovulationEndDate });
  
        // Fertile window calculation: 5 days before ovulation and 1 day after ovulation
        const fertileWindowStartDate = new Date(ovulationStartDate);
        fertileWindowStartDate.setDate(fertileWindowStartDate.getDate() - 5);
        const fertileWindowEndDate = new Date(ovulationStartDate);
        fertileWindowEndDate.setDate(fertileWindowEndDate.getDate() + 1);
  
        fertileWindows.push({ start: fertileWindowStartDate, end: fertileWindowEndDate });
  
        // Update currentStartDate for the next period
        currentStartDate = new Date(nextPeriodStartDate);
      }
  
      // Return the prediction results
      return {
        nextPeriodDates,
        cycleDurations: Array(4).fill(Math.round(avgCycleDuration)), // Using the average cycle duration for predictions
        ovulationWindows,
        fertileWindows,
        confidence: this.calculateConfidence(data),
        predictedSymptoms: this.predictSymptoms(data, symptomLikelihood),
      };
    } catch (error) {
      console.error('Prediction error:', error);
      return {
        nextPeriodDates: [],
        cycleDurations: [],
        ovulationWindows: [],
        fertileWindows: [],
        confidence: 0,
        predictedSymptoms: [],
      };
    }
  }
  
  
  async train(data: {
    periods: Period[];
    symptoms: Symptom[];
    age?: number;
    stress?: number;
    temperature?: number;
  }): Promise<void> {
    try {
      const { inputs, outputs } = this.prepareTrainingData(data);
      await this.model.fit(inputs, outputs, {
        epochs: 100,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
          }
        }
      });
    } catch (error) {
      console.error('Training error:', error);
    }
  }

  private prepareInput(data: {
    periods: Period[];
    symptoms: Symptom[];
    age?: number;
    stress?: number;
    temperature?: number;
  }): tf.Tensor2D {
    const periods = [...data.periods].sort((a, b) =>
      b.startDate.getTime() - a.startDate.getTime()
    );
  
    const lastCycleLength = periods.length >= 2
      ? this.calculateCycleLength(periods[0], periods[1])
      : 28;
  
    const symptomSeverity = this.calculateAverageSymptomSeverity(data.symptoms);
    const daysSinceLastPeriod = this.calculateDaysSinceLastPeriod(periods[0]);
    const seasonalEffect = this.calculateSeasonalEffect(new Date());
  
    // Add the missing feature. You can set it as a constant or derive it from the data
    const additionalFeature = 0;  // Replace with the actual feature if needed
  
    return tf.tensor2d([[  // Add the additional feature here
      lastCycleLength,
      symptomSeverity,
      daysSinceLastPeriod,
      seasonalEffect,
      data.age || 25, // default age
      data.stress || 0.5, // default stress level
      data.temperature || 36.5, // default temperature
      additionalFeature   // Add the additional feature
    ]]);
  }
  
  private prepareTrainingData(data: {
periods: Period[];
    symptoms: Symptom[];
  }): { inputs: tf.Tensor2D; outputs: tf.Tensor2D } {
    const inputs: number[][] = [];
    const outputs: number[][] = [];
    const periods = [...data.periods].sort((a, b) => 
      a.startDate.getTime() - b.startDate.getTime()
    );

    for (let i = 1; i < periods.length - 1; i++) {
      const cycleLength = this.calculateCycleLength(periods[i], periods[i-1]);
      const symptomSeverity = this.calculateAverageSymptomSeverity(
        data.symptoms.filter(s => 
          s.timestamp >= periods[i-1].startDate && 
          s.timestamp <= periods[i].startDate
        )
      );

      inputs.push([
        cycleLength,
        symptomSeverity,
        this.calculateDaysSinceLastPeriod(periods[i]),
        this.calculateSeasonalEffect(periods[i].startDate),
        25, // default age
        0.5, // default stress
        36.5 // default temperature
      ]);

      outputs.push([
        this.calculateCycleLength(periods[i+1], periods[i]),
        cycleLength,
        symptomSeverity
      ]);
    }

    return {
      inputs: tf.tensor2d(inputs),
      outputs: tf.tensor2d(outputs)
    };
  }

  // Helper methods...
  private calculateCycleLength(period1: Period, period2: Period): number {
    return Math.abs(Math.floor(
      (period1.startDate.getTime() - period2.startDate.getTime()) / 
      (1000 * 60 * 60 * 24)
    ));
  }

  private calculateAverageSymptomSeverity(symptoms: Symptom[]): number {
    if (symptoms.length === 0) return 0;
    return symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length;
  }

  private calculateDaysSinceLastPeriod(lastPeriod?: Period): number {
    if (!lastPeriod) return 28;
    return Math.floor(
      (new Date().getTime() - lastPeriod.startDate.getTime()) / 
      (1000 * 60 * 60 * 24)
    );
  }

  private calculateSeasonalEffect(date: Date): number {
    const month = date.getMonth();
    return Math.sin(2 * Math.PI * month / 12) * 0.1 + 0.5;
  }

  private calculateConfidence(data: { periods: Period[]; symptoms: Symptom[] }): number {
    let confidence = 0.5; // Base confidence
    
    if (data.periods.length >= 3) confidence += 0.1;
    if (data.periods.length >= 6) confidence += 0.1;
    if (data.symptoms.length > 0) confidence += 0.1;
    if (data.periods.length >= 12) confidence += 0.2;

    return Math.min(confidence, 1);
  }

  private predictSymptoms(
    data: { periods: Period[]; symptoms: Symptom[] },
    symptomLikelihood: number
  ): string[] {
    const commonSymptoms = [
      'cramps',
      'fatigue',
      'mood changes',
      'bloating',
      'breast tenderness',
      'headache'
    ];

    // Get historical symptoms
    const historicalSymptoms = new Set(
      data.symptoms.map(s => s.type)
    );

    // Combine common and historical symptoms based on likelihood
    return [...new Set([
      ...commonSymptoms.slice(0, Math.floor(symptomLikelihood * commonSymptoms.length)),
      ...Array.from(historicalSymptoms)
    ])];
  }

  private getFallbackPrediction(data: { 
    periods: Period[]; 
    symptoms: Symptom[] 
  }): {
    nextPeriodDate: Date;
    cycleDuration: number;
    confidence: number;
    predictedSymptoms: string[];
  } {
    const lastPeriod = [...data.periods].sort((a, b) => 
      b.startDate.getTime() - a.startDate.getTime()
    )[0];

    const nextPeriodDate = new Date(lastPeriod?.startDate || new Date());
    nextPeriodDate.setDate(nextPeriodDate.getDate() + 28);

    return {
      nextPeriodDate,
      cycleDuration: 28,
      confidence: 0.5,
      predictedSymptoms: ['cramps', 'fatigue', 'mood changes']
    };
  }
}

export const tensorFlowPredictor = new TensorFlowPredictor();