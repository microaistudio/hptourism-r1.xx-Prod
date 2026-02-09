import bcrypt from 'bcrypt';
import { db } from './db';
import { users, ddoCodes, homestayApplications, grievances, grievanceComments } from '../shared/schema';
import { eq, and, ne } from 'drizzle-orm';
import { getDistrictStaffManifest } from '../shared/districtStaffManifest';

/**
 * Database Seed Script
 * Creates default admin user and initial data for the HP Tourism portal
 * Safe to run multiple times (idempotent)
 */

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Check if admin user already exists
    const adminMobile = '9999999999';
    const adminPassword = 'admin123';
    const adminFirstName = 'Admin';
    const adminLastName = 'Admin';
    const adminUsername = 'admin';
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    const existingAdmin = await db.select()
      .from(users)
      .where(eq(users.mobile, adminMobile))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log(`✅ Admin user already exists (mobile: ${adminMobile})`);

      // Update to ensure role, status, and password are correct
      await db.update(users)
        .set({
          role: 'admin',
          isActive: true,
          password: hashedAdminPassword,
          fullName: 'Admin Admin',
          firstName: adminFirstName,
          lastName: adminLastName,
          username: adminUsername,
        })
        .where(eq(users.mobile, adminMobile));

      console.log('✅ Admin credentials verified/updated');
    } else {
      // Create default admin user
      await db.insert(users).values({
        mobile: adminMobile,
        password: hashedAdminPassword,
        fullName: 'Admin Admin',
        firstName: adminFirstName,
        lastName: adminLastName,
        username: adminUsername,
        role: 'admin',
        isActive: true,
      });

      console.log('✅ Admin user created successfully');
      console.log(`   Mobile: ${adminMobile}`);
      console.log(`   Password: ${adminPassword}`);
      console.log('   ⚠️  IMPORTANT: Change this password in production!');
    }

    // Seed DDO codes for district-wise payment routing
    console.log('🏛️  Seeding DDO codes for all districts...');

    const ddoData = [
      { district: 'Chamba', ddoCode: 'CHM00-532', ddoDescription: 'D.T.D.O. CHAMBA', treasuryCode: 'CHM00' },
      { district: 'Bharmour', ddoCode: 'CHM01-001', ddoDescription: 'S.D.O.(CIVIL) BHARMOUR', treasuryCode: 'CHM01' },
      { district: 'Shimla (Central)', ddoCode: 'CTO00-068', ddoDescription: 'A.C. (TOURISM) SHIMLA', treasuryCode: 'CTO00' },
      { district: 'Hamirpur', ddoCode: 'HMR00-053', ddoDescription: 'DISTRICT TOURISM DEVELOPMENT OFFICE HAMIRPUR (UNA)', treasuryCode: 'HMR00' },
      { district: 'Una', ddoCode: 'HMR00-053', ddoDescription: 'DISTRICT TOURISM DEVELOPMENT OFFICE HAMIRPUR (UNA)', treasuryCode: 'HMR00' },
      { district: 'Kullu (Dhalpur)', ddoCode: 'KLU00-532', ddoDescription: 'DEPUTY DIRECTOR TOURISM AND CIVIL AVIATION KULLU DHALPUR', treasuryCode: 'KLU00' },
      { district: 'Kangra', ddoCode: 'KNG00-532', ddoDescription: 'DIV.TOURISM DEV.OFFICER(DTDO) DHARAMSALA', treasuryCode: 'KNG00' },
      { district: 'Kinnaur', ddoCode: 'KNR00-031', ddoDescription: 'DISTRICT TOURISM DEVELOPMENT OFFICER KINNAUR AT RECKONG PEO', treasuryCode: 'KNR00' },
      { district: 'Lahaul-Spiti (Kaza)', ddoCode: 'KZA00-011', ddoDescription: 'PO ITDP KAZA', treasuryCode: 'KZA00' },
      { district: 'Lahaul', ddoCode: 'LHL00-017', ddoDescription: 'DISTRICT TOURISM DEVELOPMENT OFFICER', treasuryCode: 'LHL00' },
      { district: 'Mandi', ddoCode: 'MDI00-532', ddoDescription: 'DIV. TOURISM DEV. OFFICER MANDI', treasuryCode: 'MDI00' },
      { district: 'Pangi', ddoCode: 'PNG00-003', ddoDescription: 'PROJECT OFFICER ITDP PANGI', treasuryCode: 'PNG00' },
      { district: 'Shimla', ddoCode: 'SML00-532', ddoDescription: 'DIVISIONAL TOURISM OFFICER SHIMLA', treasuryCode: 'SML00' },
      { district: 'Sirmour', ddoCode: 'SMR00-055', ddoDescription: 'DISTRICT TOURISM DEVELOPMENT OFFICE NAHAN', treasuryCode: 'SMR00' },
      { district: 'Solan', ddoCode: 'SOL00-046', ddoDescription: 'DTDO SOLAN', treasuryCode: 'SOL00' },
    ];

    // Insert DDO codes (skip if already exist)
    for (const ddo of ddoData) {
      const existing = await db.select()
        .from(ddoCodes)
        .where(eq(ddoCodes.district, ddo.district))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(ddoCodes).values(ddo);
      }
    }

    console.log(`✅ DDO codes seeded successfully (${ddoData.length} districts)`);

    // Create super_admin account for system maintenance operations
    console.log('👑 Creating super admin account...');

    const superAdminMobile = '9999999998';
    const superAdminPassword = 'ulan@2025';
    const superAdminFirstName = 'Super';
    const superAdminLastName = 'Admin';
    const superAdminUsername = 'superadmin';
    const hashedSuperAdminPassword = await bcrypt.hash(superAdminPassword, 10);

    const existingSuperAdmin = await db.select()
      .from(users)
      .where(eq(users.mobile, superAdminMobile))
      .limit(1);

    if (existingSuperAdmin.length > 0) {
      console.log(`✅ Super admin user already exists (mobile: ${superAdminMobile})`);

      // Update to ensure role, status, and password are correct
      await db.update(users)
        .set({
          role: 'super_admin',
          isActive: true,
          password: hashedSuperAdminPassword,
          fullName: 'Super Admin',
          firstName: superAdminFirstName,
          lastName: superAdminLastName,
          username: superAdminUsername,
        })
        .where(eq(users.mobile, superAdminMobile));

      console.log('✅ Super admin credentials verified/updated');
    } else {
      // Create super admin user
      await db.insert(users).values({
        mobile: superAdminMobile,
        email: 'superadmin@himachaltourism.gov.in',
        password: hashedSuperAdminPassword,
        fullName: 'Super Admin',
        firstName: superAdminFirstName,
        lastName: superAdminLastName,
        username: superAdminUsername,
        role: 'super_admin',
        isActive: true,
      });

      console.log('✅ Super admin user created successfully');
      console.log(`   Mobile: ${superAdminMobile}`);
      console.log('   Email: superadmin@himachaltourism.gov.in');
      console.log(`   Password: ${superAdminPassword}`);
      console.log('   ⚠️  IMPORTANT: This account has full system access including reset operations!');
      console.log('   ⚠️  Change this password immediately after first login!');
    }

    // Environment Check: Skip demo data in production unless explicitly enabled
    if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_DEMO_DATA === 'true') {
      console.log('🚧 Non-production environment detected, seeding demo data...');

      // Create Dedicated TESTER account (as requested)
      const testerMobile = "9999999900";
      const testerPassword = "welcome@2025";
      const hashedTesterPassword = await bcrypt.hash(testerPassword, 10);

      // Check if tester exists
      const existingTester = await db.select().from(users).where(eq(users.username, "tester")).limit(1);

      if (existingTester.length === 0) {
        await db.insert(users).values({
          mobile: testerMobile,
          email: "tester@hptourism.gov.in",
          password: hashedTesterPassword,
          fullName: "System Tester",
          username: "tester",
          role: "system_admin", // Giving high-level access
          isActive: true,
        });
        console.log("✅ Tester account created: tester / welcome@2025");
      } else {
        // Ensure password is correct
        await db.update(users).set({ password: hashedTesterPassword, role: 'system_admin' }).where(eq(users.username, "tester"));
        console.log("✅ Tester account verified: tester / welcome@2025");
      }

      // Create DEMO OWNER account (as requested)
      const demoMobile = "9876543210";
      const demoPassword = "Demo@123";
      const hashedDemoPassword = await bcrypt.hash(demoPassword, 10);

      // Check if Demo Owner exists
      const existingDemo = await db.select().from(users).where(eq(users.mobile, demoMobile)).limit(1);
      let demoUserId = "";

      if (existingDemo.length === 0) {
        const inserted = await db.insert(users).values({
          mobile: demoMobile,
          email: "demo@himachaltourism.gov.in",
          password: hashedDemoPassword,
          fullName: "Demo Owner",
          username: "demo_owner",
          role: "property_owner",
          isActive: true,
        }).returning({ id: users.id });
        demoUserId = inserted[0].id;
        console.log("✅ Demo Owner account created: 9876543210 / Demo@123");
      } else {
        demoUserId = existingDemo[0].id;
        // Ensure password is correct
        await db.update(users).set({ password: hashedDemoPassword }).where(eq(users.mobile, demoMobile));
        console.log("✅ Demo Owner account verified: 9876543210 / Demo@123");
      }

      // Check if Demo Owner has any application
      const demoApps = await db.select().from(homestayApplications).where(eq(homestayApplications.userId, demoUserId)).limit(1);

      if (demoApps.length === 0) {
        console.log("📝 Creating sample Approved application for Demo Owner...");
        await db.insert(homestayApplications).values({
          userId: demoUserId,
          applicationNumber: "HP-SML-2025-00099",
          certificateNumber: "HP-SML-DEMO-001",
          status: "approved",
          projectType: "new_property",
          applicationKind: "new_registration",
          propertyName: "Demo Himalayan Heights",
          category: "gold",
          locationType: "mc",
          totalRooms: 3,
          district: "Shimla",
          tehsil: "Shimla Urban",
          address: "The Mall, Shimla",
          pincode: "171001",
          ownerName: "Demo Owner",
          ownerMobile: demoMobile,
          ownerGender: "male",
          ownerAadhaar: "123456789012",
          propertyOwnership: "owned",
          propertyArea: "500",
          propertyAreaUnit: "sqm",
          attachedWashrooms: 3,
          singleBedRooms: 1,
          singleBedBeds: 1,
          doubleBedRooms: 1,
          doubleBedBeds: 2,
          familySuites: 1,
          familySuiteBeds: 4,
          certificateIssuedDate: new Date(),
          certificateExpiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          approvedAt: new Date(),
          paymentStatus: "paid",
          paymentAmount: "5000",
          paymentDate: new Date(),
        });
        console.log("✅ Sample Approved application created.");
      }

      // Check if Demo Owner has any grievance
      const demoGrievances = await db.select().from(grievances).where(eq(grievances.userId, demoUserId)).limit(1);

      if (demoGrievances.length === 0) {
        console.log("📝 Creating sample Grievance for Demo Owner...");
        await db.insert(grievances).values({
          ticketNumber: "GRV-SML-2025-001",
          ticketType: "owner_grievance",
          userId: demoUserId,
          category: "application",
          subject: "Demo Grievance: Inquiry about subsidy",
          description: "This is a sample grievance ticket for demonstration purposes. I would like to know about available subsidies for homestay renovation.",
          status: "open",
          priority: "medium",
          lastReadByOwner: new Date(),
        });
        console.log("✅ Sample Grievance created.");
      }

      // Add Admin Reply if no admin reply exists
      const demoGrievance = (await db.select().from(grievances).where(eq(grievances.userId, demoUserId)).limit(1))[0];
      if (demoGrievance) {
        // Check for any comment NOT by the demo user (i.e. an admin response)
        const adminReplies = await db.select().from(grievanceComments).where(
          and(
            eq(grievanceComments.grievanceId, demoGrievance.id),
            ne(grievanceComments.userId, demoUserId)
          )
        );

        if (adminReplies.length === 0) {
          // Find Admin user
          const adminUser = await db.select().from(users).where(eq(users.mobile, '9999999999')).limit(1);

          if (adminUser.length > 0) {
            console.log("💬 Adding Admin reply to Demo Grievance...");
            await db.insert(grievanceComments).values({
              grievanceId: demoGrievance.id,
              userId: adminUser[0].id,
              comment: "Dear Property Owner, we have received your inquiry. Subsidies are available under the HPTDC Home Stay Scheme 2025. Please visit the nearest tourism office for details.",
              isInternal: false
            });

            // Update status to In Progress
            await db.update(grievances).set({
              status: 'in_progress',
              lastCommentAt: new Date(),
              lastReadByOfficer: new Date() // Admin read it
            }).where(eq(grievances.id, demoGrievance.id));

            console.log("✅ Admin reply added & Ticket updated to In Progress.");
          }
        }
      }
    } else {
      console.log('🏭 Production environment detected - skipping demo data seeding.');
    }

    // Seed all district staff (Dealing Assistants + DTDOs)
    console.log('👥 Seeding district staff accounts (DA & DTDO)…');
    const staffManifest = getDistrictStaffManifest();
    let daUpserts = 0;
    let dtdoUpserts = 0;

    for (const entry of staffManifest) {
      for (const roleKey of ['da', 'dtdo'] as const) {
        const staffRecord = entry[roleKey];
        const role =
          roleKey === 'da' ? 'dealing_assistant' : 'district_tourism_officer';
        const designation =
          roleKey === 'da'
            ? 'Dealing Assistant'
            : 'District Tourism Development Officer';
        const fullNameSuffix = roleKey === 'da' ? 'DA' : 'DTDO';
        const hashedPassword = await bcrypt.hash(staffRecord.password, 10);

        const existing = await db
          .select()
          .from(users)
          .where(eq(users.mobile, staffRecord.mobile))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(users)
            .set({
              role,
              district: entry.districtLabel,
              username: staffRecord.username,
              email: staffRecord.email,
              fullName: `${staffRecord.fullName} (${fullNameSuffix} ${entry.districtLabel})`,
              designation,
              password: hashedPassword,
              isActive: true,
            })
            .where(eq(users.mobile, staffRecord.mobile));
        } else {
          await db.insert(users).values({
            mobile: staffRecord.mobile,
            email: staffRecord.email,
            password: hashedPassword,
            fullName: `${staffRecord.fullName} (${fullNameSuffix} ${entry.districtLabel})`,
            role,
            district: entry.districtLabel,
            username: staffRecord.username,
            designation,
            isActive: true,
          });
        }

        if (roleKey === 'da') {
          daUpserts += 1;
        } else {
          dtdoUpserts += 1;
        }
      }
    }

    console.log(
      `✅ District staff accounts ensured (${daUpserts} DA, ${dtdoUpserts} DTDO)`
    );
    console.log(
      '   ➜ Reference credentials: seed_data/district-staff-accounts.csv'
    );

    const sampleEntry =
      staffManifest.find(
        (entry) =>
          entry.districtLabel.toLowerCase().includes('shimla') ||
          entry.da.username === 'da_shimla'
      ) ?? staffManifest[0];

    console.log('\n📋 Summary of Default Accounts:');
    console.log('┌────────────────────┬──────────────┬──────────────────┬──────────────────────┐');
    console.log('│ Role               │ Mobile       │ Password         │ Access Level         │');
    console.log('├────────────────────┼──────────────┼──────────────────┼──────────────────────┤');
    console.log('│ Admin              │ 9999999999   │ admin123         │ User Management      │');
    console.log('│ Super Admin        │ 9999999998   │ SuperAdmin@2025  │ Full System + Reset  │');
    console.log(`│ Dealing Assistants │ ${daUpserts
      .toString()
      .padEnd(12)} │ refer manifest   │ District Queues      │`);
    console.log(`│ DTDOs              │ ${dtdoUpserts
      .toString()
      .padEnd(12)} │ refer manifest   │ District Escalations │`);
    if (sampleEntry) {
      console.log('├────────────────────┼──────────────┼──────────────────┼──────────────────────┤');
      console.log(
        `│ Sample DA (${sampleEntry.districtLabel
          .slice(0, 12)
          .padEnd(12)}) │ ${sampleEntry.da.mobile.padEnd(12)} │ ${sampleEntry.da.password.padEnd(
            16
          )} │ ${sampleEntry.districtLabel.padEnd(20).slice(0, 20)} │`
      );
      console.log(
        `│ Sample DTDO (${sampleEntry.districtLabel
          .slice(0, 12)
          .padEnd(12)}) │ ${sampleEntry.dtdo.mobile.padEnd(12)} │ ${sampleEntry.dtdo.password.padEnd(
            16
          )} │ ${sampleEntry.districtLabel.padEnd(20).slice(0, 20)} │`
      );
    }
    console.log('└────────────────────┴──────────────┴──────────────────┴──────────────────────┘');

    console.log('\n🎉 Database seed completed successfully!');
    console.log('   Run this script anytime to ensure default accounts and DDO codes exist.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seed failed:', error);
    process.exit(1);
  }
}

// Run seed
seed();
