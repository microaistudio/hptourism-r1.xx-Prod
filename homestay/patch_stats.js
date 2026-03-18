const fs = require('fs');
const file = 'server/routes/stats.ts';
let code = fs.readFileSync(file, 'utf8');

// Fix 1: Add legacy_rc_review to pendingScrutiny hero stat
code = code.replace(
  "homestayApplications.status} in ('submitted', 'under_scrutiny')",
  "homestayApplications.status} in ('submitted', 'under_scrutiny', 'legacy_rc_review')"
);

// Fix 2: Update funnelData statuses to match modern ones
code = code.replace(
  '{ name: "Under Scrutiny", value: (funnelMap.get("document_verification") || 0) + (funnelMap.get("clarification_requested") || 0), fill: "#f59e0b" },',
  '{ name: "DA Scrutiny", value: (funnelMap.get("under_scrutiny") || 0) + (funnelMap.get("legacy_rc_review") || 0), fill: "#f59e0b" },'
).replace(
  '{ name: "Inspection", value: (funnelMap.get("site_inspection_scheduled") || 0) + (funnelMap.get("site_inspection_complete") || 0), fill: "#8b5cf6" },',
  '{ name: "Inspection", value: (funnelMap.get("inspection_scheduled") || 0) + (funnelMap.get("inspection_completed") || 0) + (funnelMap.get("inspection_under_review") || 0), fill: "#8b5cf6" },'
);

// Fix 3: Update pipeline_counts scrutiny to include legacy_rc_review
code = code.replace(
  'scrutiny: (funnelMap.get("under_scrutiny") || 0),',
  'scrutiny: (funnelMap.get("under_scrutiny") || 0) + (funnelMap.get("legacy_rc_review") || 0),'
);

fs.writeFileSync(file, code);
