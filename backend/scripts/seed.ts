import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo data...');

  // 1. Create Vessel Types
  const handysize = await prisma.vesselType.upsert({
    where: { name: 'Handysize' },
    update: {},
    create: { name: 'Handysize', typicalDwt: 35000, typicalDraft: 10, typicalLoa: 170, typicalBeam: 27 },
  });
  
  const panamax = await prisma.vesselType.upsert({
    where: { name: 'Panamax' },
    update: {},
    create: { name: 'Panamax', typicalDwt: 75000, typicalDraft: 14, typicalLoa: 225, typicalBeam: 32.2 },
  });

  const capesize = await prisma.vesselType.upsert({
    where: { name: 'Capesize' },
    update: {},
    create: { name: 'Capesize', typicalDwt: 180000, typicalDraft: 18, typicalLoa: 290, typicalBeam: 45 },
  });

  // 2. Create Ports
  const paradip = await prisma.port.create({
    data: {
      name: 'Paradip',
      country: 'India',
      latitude: 20.26,
      longitude: 86.67,
      maxLoa: 260,
      maxBeam: 40,
      maxDraft: 14.5,
      cargoHandlingRate: 40000,
      historicalTurnaround: 3,
      congestionLevel: 'MEDIUM',
    },
  });

  const newcastle = await prisma.port.create({
    data: {
      name: 'Newcastle',
      country: 'Australia',
      latitude: -32.92,
      longitude: 151.78,
      maxLoa: 300,
      maxBeam: 50,
      maxDraft: 15.2,
      cargoHandlingRate: 80000,
      historicalTurnaround: 2,
      congestionLevel: 'LOW',
    },
  });

  // 3. Create Route
  const route = await prisma.route.create({
    data: {
      originId: newcastle.id,
      destinationId: paradip.id,
      distance: 5200, // NM approximate
      estimatedDays: 18,
    },
  });

  // 4. Create Historical Freight Rates
  console.log('Generating 2 years of synthetic freight data...');
  const rates = [];
  let currentDate = new Date('2024-01-01');
  const endDate = new Date('2026-09-01');
  
  // Base rate $18/MT
  let currentRate = 18.0;

  while (currentDate <= endDate) {
    // Add some random walk and seasonality
    const month = currentDate.getMonth();
    // Demand higher in winter
    const seasonality = (month > 9 || month < 2) ? 1.05 : 0.95; 
    const randomWalk = (Math.random() - 0.5) * 1.5;
    currentRate = Math.max(10, currentRate * seasonality + randomWalk);

    rates.push({
      routeId: route.id,
      date: new Date(currentDate),
      rate: parseFloat(currentRate.toFixed(2)),
    });
    
    currentDate.setDate(currentDate.getDate() + 7); // weekly data
  }

  await prisma.historicalFreightRate.createMany({
    data: rates,
  });

  // 5. Create demo vessels
  await prisma.vessel.create({
    data: {
      imo: '9123456',
      name: 'Demo Panamax 1',
      vesselTypeId: panamax.id,
      dwt: 76000,
      gt: 40000,
      loa: 225,
      beam: 32.2,
      maxDraft: 14.2,
      speed: 13.5,
      fuelConsumption: 30,
      age: 5,
    },
  });
  
  await prisma.vessel.create({
    data: {
      imo: '9765432',
      name: 'Demo Capesize 1',
      vesselTypeId: capesize.id,
      dwt: 180000,
      gt: 90000,
      loa: 290,
      beam: 45,
      maxDraft: 18.1, // Too deep for Paradip!
      speed: 14.0,
      fuelConsumption: 55,
      age: 2,
    },
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
