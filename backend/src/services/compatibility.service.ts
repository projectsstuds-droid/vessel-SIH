import { Vessel, Port } from '@prisma/client';

export interface CompatibilityResult {
  isCompatible: boolean;
  reasons: string[];
}

export class CompatibilityService {
  /**
   * Checks if a vessel is physically compatible with a destination port.
   * @param vessel The vessel to check
   * @param port The destination port
   * @returns CompatibilityResult with reasons for rejection
   */
  static checkVesselPortCompatibility(vessel: Vessel, port: Port): CompatibilityResult {
    const reasons: string[] = [];
    let isCompatible = true;

    if (vessel.loa > port.maxLoa) {
      isCompatible = false;
      reasons.push(`Vessel LOA (${vessel.loa}m) exceeds port maximum (${port.maxLoa}m)`);
    }

    if (vessel.beam > port.maxBeam) {
      isCompatible = false;
      reasons.push(`Vessel Beam (${vessel.beam}m) exceeds port maximum (${port.maxBeam}m)`);
    }

    if (vessel.maxDraft > port.maxDraft) {
      isCompatible = false;
      reasons.push(`Vessel Draft (${vessel.maxDraft}m) exceeds port maximum (${port.maxDraft}m)`);
    }

    // Checking if vessel is available - assuming we need it to be AVAILABLE or soon to be
    if (vessel.status === 'FIXED') {
      isCompatible = false;
      reasons.push('Vessel is currently FIXED on another charter.');
    }

    return {
      isCompatible,
      reasons
    };
  }
}
