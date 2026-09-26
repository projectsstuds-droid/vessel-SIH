import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const getForecast = async (req: Request, res: Response) => {
  try {
    const { routeId, horizonDays = 30 } = req.query;

    if (!routeId) {
      return res.status(400).json({ error: 'routeId is required' });
    }

    // Fetch historical data
    const history = await prisma.historicalFreightRate.findMany({
      where: { routeId: String(routeId) },
      orderBy: { date: 'asc' },
    });

    let historical_dates = history.map(h => h.date.toISOString().split('T')[0]);
    let historical_rates = history.map(h => h.rate);

    if (history.length < 10) {
      // Fallback: Generate mock history so prototype ML can run even with empty DB
      console.log('No DB history found, generating synthetic fallback history...');
      const fallbackDates = [];
      const fallbackRates = [];
      const today = new Date();
      for (let i = 20; i > 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i * 7); // weekly points
        fallbackDates.push(d.toISOString().split('T')[0]);
        // Simulate rates around $18-$22
        fallbackRates.push(18 + Math.random() * 4);
      }
      historical_dates = fallbackDates;
      historical_rates = fallbackRates;
    }

    // Call ML Service
    const mlResponse = await fetch(`${ML_SERVICE_URL}/forecast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        historical_dates,
        historical_rates,
        horizon_days: Number(horizonDays)
      })
    });

    if (!mlResponse.ok) {
      const errorData = await mlResponse.text();
      throw new Error(`ML Service Error: ${errorData}`);
    }

    const forecastData = await mlResponse.json();
    
    // Combine for frontend
    res.json({
      history: history.slice(-30), // last 30 data points
      forecast: forecastData
    });

  } catch (error: any) {
    console.error('Forecast Error:', error);
    res.status(500).json({ error: 'Failed to generate forecast', details: error.message });
  }
};
