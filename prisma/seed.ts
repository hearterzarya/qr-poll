import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import {
  PrismaClient,
  ReportPriority,
  ReportStatus,
  PoleStatus,
  UserRole,
} from "../src/generated/prisma";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const poles = [
  {
    poleCode: "NH44-UP-AGRA-0001",
    highwayName: "NH-44 (Yamuna Expressway)",
    state: "Uttar Pradesh",
    district: "Agra",
    kmMarker: "142.5",
    latitude: 27.1767,
    longitude: 78.0081,
    nearestLandmark: "Near Agra Toll Plaza",
    authorityName: "NHAI Agra Division",
    contractorName: "Highway Care Pvt Ltd",
  },
  {
    poleCode: "NH44-UP-AGRA-0002",
    highwayName: "NH-44 (Yamuna Expressway)",
    state: "Uttar Pradesh",
    district: "Agra",
    kmMarker: "145.2",
    latitude: 27.185,
    longitude: 78.02,
    nearestLandmark: "Service Road Junction",
    authorityName: "NHAI Agra Division",
    contractorName: "Highway Care Pvt Ltd",
  },
  {
    poleCode: "NH44-UP-AGRA-0003",
    highwayName: "NH-44 (Yamuna Expressway)",
    state: "Uttar Pradesh",
    district: "Agra",
    kmMarker: "148.0",
    latitude: 27.192,
    longitude: 78.035,
    nearestLandmark: "Rest Area North",
    authorityName: "NHAI Agra Division",
    contractorName: "Highway Care Pvt Ltd",
  },
  {
    poleCode: "NH48-HR-GGN-0001",
    highwayName: "NH-48 (Delhi-Jaipur)",
    state: "Haryana",
    district: "Gurugram",
    kmMarker: "42.8",
    latitude: 28.4089,
    longitude: 77.0378,
    nearestLandmark: "Near Kherki Daula Toll",
    authorityName: "NHAI Gurugram",
    contractorName: "RoadSafe Contractors",
  },
  {
    poleCode: "NH48-HR-GGN-0002",
    highwayName: "NH-48 (Delhi-Jaipur)",
    state: "Haryana",
    district: "Gurugram",
    kmMarker: "45.1",
    latitude: 28.42,
    longitude: 77.05,
    nearestLandmark: "Manesar Exit Ramp",
    authorityName: "NHAI Gurugram",
    contractorName: "RoadSafe Contractors",
  },
  {
    poleCode: "NH07-UK-DDN-0001",
    highwayName: "NH-07 (Dehradun Highway)",
    state: "Uttarakhand",
    district: "Dehradun",
    kmMarker: "18.3",
    latitude: 30.3165,
    longitude: 78.0322,
    nearestLandmark: "Mussoorie Diversion",
    authorityName: "NHAI Uttarakhand",
    contractorName: "Himalaya Infra Works",
  },
  {
    poleCode: "NH07-UK-DDN-0002",
    highwayName: "NH-07 (Dehradun Highway)",
    state: "Uttarakhand",
    district: "Dehradun",
    kmMarker: "21.7",
    latitude: 30.33,
    longitude: 78.05,
    nearestLandmark: "Forest Check Post",
    authorityName: "NHAI Uttarakhand",
    contractorName: "Himalaya Infra Works",
  },
  {
    poleCode: "NH44-UP-AGRA-0231",
    highwayName: "NH-44 (Yamuna Expressway)",
    state: "Uttar Pradesh",
    district: "Agra",
    kmMarker: "231.0",
    latitude: 27.25,
    longitude: 78.1,
    nearestLandmark: "Mathura Bypass",
    authorityName: "NHAI Agra Division",
    contractorName: "Highway Care Pvt Ltd",
  },
  {
    poleCode: "NH48-HR-GGN-0015",
    highwayName: "NH-48 (Delhi-Jaipur)",
    state: "Haryana",
    district: "Gurugram",
    kmMarker: "52.0",
    latitude: 28.45,
    longitude: 77.08,
    nearestLandmark: "Industrial Area Flyover",
    authorityName: "NHAI Gurugram",
    contractorName: "RoadSafe Contractors",
  },
  {
    poleCode: "NH07-UK-DDN-0008",
    highwayName: "NH-07 (Dehradun Highway)",
    state: "Uttarakhand",
    district: "Dehradun",
    kmMarker: "28.4",
    latitude: 30.35,
    longitude: 78.08,
    nearestLandmark: "River Bridge Section",
    authorityName: "NHAI Uttarakhand",
    contractorName: "Himalaya Infra Works",
  },
];

async function main() {
  console.log("🌱 Seeding PoleSafe QR database...");

  const passwordHash = await bcrypt.hash("Admin@12345", 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@polesafe.in" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@polesafe.in",
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      phone: "+919999999999",
    },
  });

  const contractor = await prisma.user.upsert({
    where: { email: "contractor@polesafe.in" },
    update: {},
    create: {
      name: "Field Contractor",
      email: "contractor@polesafe.in",
      passwordHash: await bcrypt.hash("Contractor@123", 12),
      role: UserRole.CONTRACTOR,
      phone: "+919888888888",
    },
  });

  const createdPoles = [];
  for (const pole of poles) {
    const p = await prisma.pole.upsert({
      where: { poleCode: pole.poleCode },
      update: pole,
      create: { ...pole, status: PoleStatus.ACTIVE },
    });
    createdPoles.push(p);
  }

  const reportData = [
    {
      category: "ACCIDENT",
      emergencyType: "ACCIDENT",
      priority: ReportPriority.P1,
      status: ReportStatus.NEW,
      description: "Multi-vehicle collision reported near toll",
      poleIndex: 0,
    },
    {
      category: "STREET_LIGHT",
      priority: ReportPriority.P2,
      status: ReportStatus.ASSIGNED,
      description: "Street light not working for 200m stretch",
      poleIndex: 1,
    },
    {
      category: "ROAD_DAMAGE",
      priority: ReportPriority.P2,
      status: ReportStatus.IN_PROGRESS,
      description: "Large pothole on main carriageway",
      poleIndex: 2,
    },
    {
      category: "VEHICLE_BREAKDOWN",
      priority: ReportPriority.P3,
      status: ReportStatus.VERIFIED,
      description: "Truck breakdown blocking slow lane",
      poleIndex: 3,
    },
    {
      category: "WATERLOGGING",
      priority: ReportPriority.P2,
      status: ReportStatus.NEW,
      description: "Water accumulation after rain",
      poleIndex: 4,
    },
    {
      category: "FIRE",
      emergencyType: "FIRE",
      priority: ReportPriority.P1,
      status: ReportStatus.IN_PROGRESS,
      description: "Vehicle fire on highway shoulder",
      poleIndex: 5,
    },
    {
      category: "ANIMAL_OBSTRUCTION",
      priority: ReportPriority.P2,
      status: ReportStatus.RESOLVED,
      description: "Cattle on road - cleared",
      poleIndex: 6,
      resolved: true,
    },
    {
      category: "POLE_DAMAGED",
      priority: ReportPriority.P2,
      status: ReportStatus.NEW,
      description: "Pole bent after vehicle impact",
      poleIndex: 7,
    },
    {
      category: "SIGNBOARD",
      priority: ReportPriority.P3,
      status: ReportStatus.REJECTED,
      description: "Duplicate signboard complaint",
      poleIndex: 8,
    },
    {
      category: "OTHER_COMPLAINT",
      priority: ReportPriority.P3,
      status: ReportStatus.NEW,
      description: "Garbage dumped near service road",
      poleIndex: 9,
    },
  ];

  const year = new Date().getFullYear();
  let reportNum = 1;

  for (const r of reportData) {
    const reportCode = `PS-${year}-${String(reportNum).padStart(6, "0")}`;
    reportNum++;

    const pole = createdPoles[r.poleIndex];
    const report = await prisma.report.upsert({
      where: { reportCode },
      update: {},
      create: {
        reportCode,
        poleId: pole.id,
        category: r.category,
        emergencyType: r.emergencyType,
        priority: r.priority,
        description: r.description,
        userPhone: "+919876543210",
        userLatitude: pole.latitude + 0.001,
        userLongitude: pole.longitude + 0.001,
        status: r.status,
        assignedToId:
          r.status === ReportStatus.ASSIGNED ||
          r.status === ReportStatus.IN_PROGRESS
            ? contractor.id
            : undefined,
        resolvedAt: r.resolved ? new Date() : undefined,
      },
    });

    await prisma.reportStatusLog.create({
      data: {
        reportId: report.id,
        oldStatus: null,
        newStatus: ReportStatus.NEW,
        note: "Report submitted by citizen",
      },
    });

    if (r.status !== ReportStatus.NEW) {
      await prisma.reportStatusLog.create({
        data: {
          reportId: report.id,
          oldStatus: ReportStatus.NEW,
          newStatus: r.status,
          note: "Status updated during seed",
          changedById: superAdmin.id,
        },
      });
    }
  }

  console.log(`✅ Seeded ${createdPoles.length} poles, ${reportData.length} reports`);
  console.log("   Super Admin: admin@polesafe.in / Admin@12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
