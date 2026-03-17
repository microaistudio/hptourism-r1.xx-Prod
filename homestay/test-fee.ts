import { recalculateFee } from './shared/fee-calculator';

function testKulluApplicant() {
  // Let's assume typical Kullu details where they upgrade
  // e.g. Gold, 1 year -> Diamond, 3 years
  // Or simply Gold, 3 years?
  
  // Try a few scenarios they might be facing
  const scenarios = [
    {
      name: "Upgrade from Gold (1 year) to Diamond (3 years) - MC Area",
      oldCategory: 'gold' as const,
      oldValidityYears: 1 as const,
      oldTotalFee: 5000,
      newCategory: 'diamond' as const,
      newValidityYears: 3 as const,
      oldLocationType: 'mc' as const,
      newLocationType: 'mc' as const,
      ownerGender: 'male' as const,
      isPangiSubDivision: false,
    },
    {
      name: "Upgrade from 1 year to 3 years - Diamond - GP Area",
      oldCategory: 'diamond' as const,
      oldValidityYears: 1 as const,
      oldTotalFee: 5000, 
      newCategory: 'diamond' as const,
      newValidityYears: 3 as const,
      oldLocationType: 'gp' as const,
      newLocationType: 'gp' as const,
      ownerGender: 'male' as const,
      isPangiSubDivision: false,
    },
    {
      name: "Kullu specific check: Diamond, 3 Years, GP, Male",
      oldCategory: 'silver' as const,
      oldValidityYears: 1 as const,
      oldTotalFee: 2500, // Silver GP 1 year
      newCategory: 'diamond' as const,
      newValidityYears: 3 as const,
      oldLocationType: 'gp' as const,
      newLocationType: 'gp' as const,
      ownerGender: 'male' as const,
      isPangiSubDivision: false,
    }
  ];

  console.log("--- Kullu/Chamba Fee Recalculation Check ---");
  for (const s of scenarios) {
    console.log(`\nScenario: ${s.name}`);
    const result = recalculateFee({
      oldCategory: s.oldCategory,
      oldValidityYears: s.oldValidityYears,
      oldTotalFee: s.oldTotalFee,
      newCategory: s.newCategory,
      newValidityYears: s.newValidityYears,
      locationType: s.newLocationType, 
      oldLocationType: s.oldLocationType, 
      newLocationType: s.newLocationType, 
      ownerGender: s.ownerGender,
      isPangiSubDivision: s.isPangiSubDivision,
    });
    
    console.log(`Original Paid: ₹${s.oldTotalFee}`);
    console.log(`New Target Total Fee: ₹${result.newTotalFee}`);
    console.log(`Difference (Amount due for top up): ₹${result.feeDelta}`);
    console.log(`Calculated Breakdown: 
      Base Fee: ${result.newFeeBreakdown.baseFee}
      Validity Disc: -${result.newFeeBreakdown.validityDiscount}
      Gross: ${result.newFeeBreakdown.totalBeforeDiscounts}`);
  }
}

testKulluApplicant();
