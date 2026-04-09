import * as dotenv from 'dotenv';
dotenv.config();
import { pool } from '../src/config/database.config';

const properties = [
  {
    title: 'Former Steel Works Site, Birmingham',
    site_type: 'brownfield',
    acres: 12.5,
    price: 1800000,
    region: 'Midlands',
    city: 'Birmingham',
    planning_status: 'outline_permission',
    description: 'Large former industrial site with outline planning for 200 residential units',
  },
  {
    title: 'Derelict Factory Site, Coventry',
    site_type: 'brownfield',
    acres: 7.2,
    price: 950000,
    region: 'Midlands',
    city: 'Coventry',
    planning_status: 'no_permission',
    description: 'Former manufacturing facility, suitable for mixed-use redevelopment',
  },
  {
    title: 'Former Gasworks, Wolverhampton',
    site_type: 'brownfield',
    acres: 9.8,
    price: 1200000,
    region: 'Midlands',
    city: 'Wolverhampton',
    planning_status: 'pending',
    description: 'Remediated brownfield site with pending planning for commercial use',
  },
  {
    title: 'Agricultural Land, Peak District',
    site_type: 'greenfield',
    acres: 45.0,
    price: 2200000,
    region: 'Midlands',
    city: 'Matlock',
    planning_status: 'no_permission',
    description: 'Prime agricultural greenfield site with scenic views',
  },
  {
    title: 'Waterfront Development Site, Manchester',
    site_type: 'brownfield',
    acres: 6.3,
    price: 3500000,
    region: 'North West',
    city: 'Manchester',
    planning_status: 'full_permission',
    description: 'Former docklands site with full planning for 150 luxury apartments',
  },
  {
    title: 'Green Belt Land, Cheshire',
    site_type: 'greenfield',
    acres: 22.0,
    price: 1100000,
    region: 'North West',
    city: 'Chester',
    planning_status: 'no_permission',
    description: 'Greenfield site on edge of Chester with potential for residential',
  },
  {
    title: 'Office Development Site, Leeds',
    site_type: 'commercial',
    acres: 3.1,
    price: 2800000,
    region: 'Yorkshire',
    city: 'Leeds',
    planning_status: 'full_permission',
    description: 'Prime city centre commercial site with full planning for Grade A offices',
  },
  {
    title: 'Residential Development Land, Sheffield',
    site_type: 'residential',
    acres: 8.4,
    price: 1650000,
    region: 'Yorkshire',
    city: 'Sheffield',
    planning_status: 'outline_permission',
    description: 'Allocated residential land in established suburb, 80 units approved',
  },
  {
    title: 'Mixed Use Regeneration Site, Newcastle',
    site_type: 'mixed_use',
    acres: 14.7,
    price: 4200000,
    region: 'North East',
    city: 'Newcastle',
    planning_status: 'outline_permission',
    description: 'Former shipyard site allocated for major mixed-use regeneration scheme',
  },
  {
    title: 'Retail Park Site, Gateshead',
    site_type: 'commercial',
    acres: 5.5,
    price: 3100000,
    region: 'North East',
    city: 'Gateshead',
    planning_status: 'full_permission',
    description: 'Consented retail development site adjacent to Metro Centre',
  },
  {
    title: 'Prime Development Land, Surrey',
    site_type: 'residential',
    acres: 4.2,
    price: 5500000,
    region: 'South East',
    city: 'Guildford',
    planning_status: 'full_permission',
    description: 'Exclusive residential site in commuter belt with full planning',
  },
  {
    title: 'Logistics Hub Site, Milton Keynes',
    site_type: 'commercial',
    acres: 18.0,
    price: 6800000,
    region: 'South East',
    city: 'Milton Keynes',
    planning_status: 'outline_permission',
    description: 'Strategic logistics site adjacent to M1 motorway junction',
  },
  {
    title: 'Brownfield Regeneration Site, Bristol',
    site_type: 'brownfield',
    acres: 11.2,
    price: 4700000,
    region: 'South West',
    city: 'Bristol',
    planning_status: 'pending',
    description: 'Former harbour industrial site earmarked for creative quarter development',
  },
  {
    title: 'Tech Campus Site, East London',
    site_type: 'mixed_use',
    acres: 2.8,
    price: 7900000,
    region: 'London',
    city: 'Stratford',
    planning_status: 'full_permission',
    description: 'Consented mixed-use tech campus site in Olympic legacy zone',
  },
  {
    title: 'Greenfield Housing Allocation, Cornwall',
    site_type: 'greenfield',
    acres: 31.5,
    price: 980000,
    region: 'South West',
    city: 'Truro',
    planning_status: 'outline_permission',
    description: 'Council allocated housing site in local plan for 120 dwellings',
  },
];

async function seed(): Promise<void> {
  console.log('Seeding database...');
  await pool.query('TRUNCATE properties RESTART IDENTITY CASCADE');
  for (const p of properties) {
    await pool.query(
      `INSERT INTO properties (title, site_type, acres, price, region, city, planning_status, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [p.title, p.site_type, p.acres, p.price, p.region, p.city, p.planning_status, p.description],
    );
  }
  console.log(`Seeded ${properties.length} properties successfully`);
  await pool.end();
}

seed().catch(console.error);
