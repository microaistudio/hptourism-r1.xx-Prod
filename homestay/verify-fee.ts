import 'dotenv/config';
import { db } from './server/db';
import { homestayApplications } from './shared/schema';
import { eq } from 'drizzle-orm';
import { recalculateFee, type RecalcCategoryType, type RecalcLocationType } from './shared/fee-recalculator';

async function verifyFee(applicationNumber: string) {
  const application = await db.query.homestayApplications.findFirst({
    where: eq(homestayApplications.applicationNumber, applicationNumber)
  });

  if (!application) {
    console.error(`Application ${applicationNumber} not found.`);
    process.exit(1);
  }

  console.log(`\n--- Inspecting Application ${applicationNumber} ---`);
  console.log(`Current Status: ${application.status}`);
  console.log(`Payment Status: ${application.paymentStatus}`);
  console.log(`Current Application State:
    Category: ${application.category}
    Area Type: ${application.locationType}
    Term: ${application.certificateValidityYears} years
    Gender: ${application.ownerGender}
    Pangi/Bharmour: ${application.isPangiSubDivision}
  `);

  console.log(`Current recorded monetary values in DB:
    paymentAmount (what Himkosh returned): ${application.paymentAmount}
    previousTotalFee (snapshot before recalculation): ${application.previousTotalFee}
    totalFee: ${application.totalFee}
  `);

  // Try to determine what the actual Paid Amount computes to using our logic
  const actualPaidAmount = Number(application.paymentAmount || application.previousTotalFee || application.totalFee || 0);
  console.log(`--> Logic determines ACTUAL PAID AMOUNT as: ₹${actualPaidAmount} (Derived natively from: paymentAmount || previousTotalFee || totalFee)\n`);

  console.log(`Now simulating the fee recalculation against current properties...`);
  const recalcResult = recalculateFee({
    oldCategory: (application.previousCategory || application.category || 'silver') as RecalcCategoryType,
    oldValidityYears: (application.previousValidityYears || application.certificateValidityYears || 1) as 1 | 3,
    oldTotalFee: actualPaidAmount,
    newCategory: (application.category || 'silver') as RecalcCategoryType,
    newValidityYears: (application.certificateValidityYears || 1) as 1 | 3,
    locationType: (application.locationType || 'gp') as RecalcLocationType,
    oldLocationType: (application.locationType || 'gp') as RecalcLocationType, 
    newLocationType: (application.locationType || 'gp') as RecalcLocationType,
    ownerGender: (application.ownerGender || 'male') as 'male' | 'female' | 'other',
    isPangiSubDivision: application.isPangiSubDivision || false,
  });

  console.log(`Simulation Result:
    Calculated Target Fee: ₹${recalcResult.newTotalFee}
    Already Paid: ₹${actualPaidAmount}
    -------------------------------
    Difference (Due): ₹${recalcResult.feeDelta}
  `);
  
  if (recalcResult.feeDelta === 13500) {
    console.log(`⚠️ DIAGNOSIS: The system calculated 13500 as the DUE DIFFERENCE.
    This means the calculated Target Fee was likely 13500 (e.g., Diamond, 1 Year, GP area) 
    AND the recognized "Already Paid" amount was evaluating to ZERO (0).`);
  }
}

// Get the app number from standard terminal arguments
const appNumber = process.argv[2];
if (!appNumber) {
  console.log("Usage: npx tsx verify-fee.ts HP-HS-202X-XXX-XXXXXX");
  process.exit(1);
}

verifyFee(appNumber).then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
