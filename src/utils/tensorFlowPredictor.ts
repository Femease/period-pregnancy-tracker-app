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
    nextPeriodDate: Date;
    cycleDuration: number;
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

      const nextPeriodDate = new Date(lastPeriod?.startDate || new Date());
      nextPeriodDate.setDate(nextPeriodDate.getDate() + Math.round(nextPeriodDays));
      console.log('nextPeriodDate', nextPeriodDate);
      return {
        nextPeriodDate,
        cycleDuration: Math.round(cycleDuration),
        confidence: this.calculateConfidence(data),
        predictedSymptoms: this.predictSymptoms(data, symptomLikelihood)
      };
    } catch (error) {
      console.error('Prediction error:', error);
      return this.getFallbackPrediction(data);
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

    return tf.tensor2d([[
      lastCycleLength,
      symptomSeverity,
      daysSinceLastPeriod,
      seasonalEffect,
      data.age || 25, // default age
      data.stress || 0.5, // default stress level
      data.temperature || 36.5 // default temperature
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