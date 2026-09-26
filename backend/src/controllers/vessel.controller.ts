import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getVessels = async (req: Request, res: Response) => {
  try {
    const vessels = await prisma.vessel.findMany({
      include: { vesselType: true },
    });
    res.json(vessels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vessels' });
  }
};

export const getVesselById = async (req: Request, res: Response) => {
  try {
    const vessel = await prisma.vessel.findUnique({ 
      where: { id: req.params.id },
      include: { vesselType: true },
    });
    if (!vessel) return res.status(404).json({ error: 'Vessel not found' });
    res.json(vessel);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vessel' });
  }
};
