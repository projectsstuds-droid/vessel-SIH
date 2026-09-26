import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CompatibilityService } from '../services/compatibility.service';
import { VoyageService, VoyageCostParams } from '../services/voyage.service';

const prisma = new PrismaClient();
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const optimizeCharter = async (req: Request, res: Response) => {
  try {
    const { routeId, cargoQuantity = 70000, bunkerPrice = 600 } = req.body;

    if (!routeId) {
      return res.status(400).json({ error: 'routeId is required' });
    }

    // 1. Fetch Route and Ports
    const route = await prisma.route.findUnique({
      where: { id: routeId },
      include: {
        origin: true,
        destination: true
      }
    });

    if (!route) return res.status(404).json({ error: 'Route not found' });

    // 2. Fetch all available vessels
    const vessels = await prisma.vessel.findMany({
      include: { vesselType: true }
    });

    // 3. Filter vessels using Compatibility Engine
    const compatibilityResults = vessels.map(vessel => {
      const comp = CompatibilityService.checkVesselPortCompatibility(vessel, route.destination);
      return {
        vessel,
        isCompatible: comp.isCompatible,
        reasons: comp.reasons
      };
    });

    const compatibleVessels = compatibilityResults.filter(r => r.isCompatible).map(r => r.vessel);

    // 4. Calculate Voyage Economics for compatible vessels
    const voyageOptions = compatibleVessels.map(vessel => {
      const params: VoyageCostParams = {
        distanceNauticalMiles: route.distance,
        vesselSpeedKnots: vessel.speed,
        fuelConsumptionPerDay: vessel.fuelConsumption,
        bunkerPricePerMT: Number(bunkerPrice),
        portDays: route.destination.historicalTurnaround,
        portDailyCost: 15000, // approximation
        cargoQuantityMT: Number(cargoQuantity)
      };

      return {
        vesselId: vessel.id,
        vesselName: vessel.name,
        vesselType: vessel.vesselType.name,
        economics: VoyageService.calculateVoyageEconomics(params)
      };
    });

    // 5. Fetch ML Forecast (simulating 3 scenarios: Now, 7 Days, 14 Days)
    const history = await prisma.historicalFreightRate.findMany({
      where: { routeId: String(routeId) },
      orderBy: { date: 'asc' },
    });

    let forecastData = null;
    if (history.length >= 10) {
      const mlResponse = await fetch(`${ML_SERVICE_URL}/forecast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          historical_dates: history.map(h => h.date.toISOString().split('T')[0]),
          historical_rates: history.map(h => h.rate),
          horizon_days: 30
        })
      });
      if (mlResponse.ok) {
        forecastData = await mlResponse.json();
      }
    }

    // 6. Build Scenarios
    const scenarios = [];
    if (forecastData && forecastData.forecast_rates.length >= 2) {
        // Scenario 1: Charter Now (use current spot / first forecast)
        scenarios.push({
            name: "CHARTER NOW",
            expectedFreight: forecastData.forecast_rates[0],
            riskLevel: "MODERATE"
        });
        
        // Scenario 2: Wait 7 Days
        scenarios.push({
            name: "WAIT 7 DAYS",
            expectedFreight: forecastData.forecast_rates[1],
            riskLevel: "MODERATE"
        });
        
        // Scenario 3: Wait 14 Days
        if(forecastData.forecast_rates.length > 2) {
             scenarios.push({
                name: "WAIT 14 DAYS",
                expectedFreight: forecastData.forecast_rates[2],
                riskLevel: "ELEVATED"
            });
        }
    }

    res.json({
      route: `${route.origin.name} to ${route.destination.name}`,
      compatibility: compatibilityResults.map(r => ({
        vessel: r.vessel.name,
        isCompatible: r.isCompatible,
        reasons: r.reasons
      })),
      voyageOptions,
      scenarios,
      fpiInsights: forecastData ? {
          score: forecastData.fpi_score,
          breakdown: forecastData.fpi_breakdown
      } : null
    });

  } catch (error: any) {
    console.error('Optimization Error:', error);
    res.status(500).json({ error: 'Optimization failed', details: error.message });
  }
};
