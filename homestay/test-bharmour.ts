import { db } from './server/db';
import { homestayApplications } from './shared/schema';
import { ilike } from 'drizzle-orm';

async function run() {
  const apps = await db.select({
    id: homestayApplications.id,
    district: homestayApplications.district,
    tehsil: homestayApplications.tehsil
  }).from(homestayApplications)
    .where(ilike(homestayApplications.district, '%bharmour%'));
  
  console.log("Apps with Bharmour district:", apps);
  process.exit(0);
}
run();
