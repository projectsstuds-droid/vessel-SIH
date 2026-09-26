import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPorts = async (req: Request, res: Response) => {
  try {
    const ports = await prisma.port.findMany();
    res.json(ports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ports' });
  }
};

export const getPortById = async (req: Request, res: Response) => {
  try {
    const port = await prisma.port.findUnique({ where: { id: req.params.id } });
    if (!port) return res.status(404).json({ error: 'Port not found' });
    res.json(port);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch port' });
  }
};

export const checkCompatibility = async (req: Request, res: Response) => {
  try {
    const { portId, vesselId } = req.body;
    
    const port = await prisma.port.findUnique({ where: { id: portId } });
    const vessel = await prisma.vessel.findUnique({ where: { id: vesselId } });

    if (!port || !vessel) {
      return res.status(404).json({ error: 'Port or Vessel not found' });
    }

    const reasons = [];
    if (vessel.loa > port.maxLoa) reasons.push(`Vessel LOA (${vessel.loa}m) exceeds port maximum (${port.maxLoa}m)`);
    if (vessel.beam > port.maxBeam) reasons.push(`Vessel beam (${vessel.beam}m) exceeds port maximum (${port.maxBeam}m)`);
    if (vessel.maxDraft > port.maxDraft) reasons.push(`Vessel draft (${vessel.maxDraft}m) exceeds port maximum (${port.maxDraft}m)`);

    const compatible = reasons.length === 0;

    res.json({
      compatible,
      reasons,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check compatibility' });
  }
};
