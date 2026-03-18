const fs = require('fs');
const file = 'server/routes/stats.ts';
let code = fs.readFileSync(file, 'utf8');

// Remove NOT LIKE 'LG-HS-%' entirely to align the top cards with the pipeline counts
code = code.replace(/AND \$\{homestayApplications\.applicationNumber\} NOT LIKE 'LG-HS-%'/g, '');
code = code.replace(/filter \(where \$\{homestayApplications\.applicationNumber\} NOT LIKE 'LG-HS-%'\)/g, '');

fs.writeFileSync(file, code);
