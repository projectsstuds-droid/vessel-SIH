export interface VoyageCostParams {
  distanceNauticalMiles: number;
  vesselSpeedKnots: number;
  fuelConsumptionPerDay: number;
  bunkerPricePerMT: number;
  portDays: number;
  portDailyCost: number;
  cargoQuantityMT: number;
}

export interface VoyageEconomics {
  sailingDays: number;
  totalDays: number;
  fuelCost: number;
  portCost: number;
  waitingCost: number;
  opexCost: number;
  totalVoyageCost: number;
  costPerTonne: number;
}

export class VoyageService {
  // Constant approximations for prototype
  private static readonly DAILY_OPEX = 5500; // USD per day
  private static readonly DAILY_WAIT_COST = 12000; // Demurrage/wait approximation USD

  /**
   * Calculates the full cost waterfall of a voyage
   */
  static calculateVoyageEconomics(params: VoyageCostParams): VoyageEconomics {
    // 1 knot = 1 nautical mile per hour -> 24 nm per day
    const distancePerDay = params.vesselSpeedKnots * 24;
    
    // Sailing time
    const sailingDays = params.distanceNauticalMiles / distancePerDay;
    const totalDays = sailingDays + params.portDays;

    // Fuel cost
    const fuelCost = sailingDays * params.fuelConsumptionPerDay * params.bunkerPricePerMT;
    
    // Port cost
    const portCost = params.portDays * params.portDailyCost;
    
    // Simulating waiting cost based on port days (assume 20% of port time is wait time)
    const waitDays = params.portDays * 0.2;
    const waitingCost = waitDays * this.DAILY_WAIT_COST;

    // OPEX
    const opexCost = totalDays * this.DAILY_OPEX;

    const totalVoyageCost = fuelCost + portCost + waitingCost + opexCost;
    const costPerTonne = totalVoyageCost / params.cargoQuantityMT;

    return {
      sailingDays: Number(sailingDays.toFixed(2)),
      totalDays: Number(totalDays.toFixed(2)),
      fuelCost: Number(fuelCost.toFixed(2)),
      portCost: Number(portCost.toFixed(2)),
      waitingCost: Number(waitingCost.toFixed(2)),
      opexCost: Number(opexCost.toFixed(2)),
      totalVoyageCost: Number(totalVoyageCost.toFixed(2)),
      costPerTonne: Number(costPerTonne.toFixed(2))
    };
  }
}
