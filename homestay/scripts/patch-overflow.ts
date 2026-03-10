const fs = require('fs');
const path = require('path');

const DIST_FILE = path.resolve(__dirname, '../dist/index.js');

if (!fs.existsSync(DIST_FILE)) {
    console.error(`❌ File not found: ${DIST_FILE}`);
    process.exit(1);
}

let content = fs.readFileSync(DIST_FILE, 'utf8');

console.log(`🔍 Patching ${DIST_FILE} (${content.length} bytes)...`);

// The minified/compiled code likely looks different.
// We search for "PG_INT32_MAX" or the function body.
// In previous versions, it was:
// const PG_INT32_MAX = 2147483647;
// const sanitizeInt32Overflow = (obj) => { ... }

// We will replace the entire function body if we can identify it.
// Or we can just hijack the call site?
// No, safely replacing the function definition is better.

// Attempt to find the specific pattern of the old sanitizer
// "const PG_INT32_MAX = 2147483647;"
// followed by "const sanitizeInt32Overflow"

const OLD_PATTERN_REGEX = /const [a-zA-Z0-9_]+ = 2147483647;\s*const ([a-zA-Z0-9_]+) = \(([a-zA-Z0-9_]+)\) => \{[\s\S]*?return \2;\s*\};/m;

// If we can't find it with regex (due to minification/formatting), we might append a global override?
// No, locals are scoped.

// Alternative:
// We read the file and look for the string "2147483647".
// Then we find the function containing it.

const seq = "2147483647";
const idx = content.indexOf(seq);

if (idx === -1) {
    console.error("❌ Could not find PG_INT32_MAX constant (2147483647) in the file. Already patched or different build?");
    process.exit(1);
}

console.log(`✅ Found PG_INT32_MAX at index ${idx}`);

// We will inject the new logic by REPLACING the function body.
// But minified code is hard to parse reliably with regex.

// STRATEGY B:
// We force the `formCompletionTimeSeconds` to 0 *before* usage?
// No, we need to fix the sanitizer.

// Let's try to replace the entire logic block.
// The old logic: 
// if (typeof val === 'number' && Number.isFinite(val) && (val > PG_INT32_MAX || val < -PG_INT32_MAX))
//
// New logic needs to handle string and keys.

// Let's just SEARCH AND REPLACE the specific condition.
// Old condition: `val > PG_INT32_MAX || val < -PG_INT32_MAX`
// We can replace it with: `(val > 2147483647 || val < -2147483647 || key.includes('form_completion'))`

// Wait, the variable 'key' might be minified to 'e' or 't'.
// We can't rely on variable names.

// STRATEGY C: "Nuclear Override" via `sed` on the specific text string in the file.
// If the file contains: `formattedApplicationNumber(sequence, district)`...
// We can find where `sanitizeInt32Overflow(appToInsert)` is called.
// It is called as `sanitizeInt32Overflow(appToInsert);`.
// Or `sanitizeInt32Overflow(normalizedInsert);` in some versions?

// In `db-storage.ts`: `sanitizeInt32Overflow(appToInsert);`

// Let's create a JS file that modifies the `dist/index.js` file using simple string replacement.

const NEW_SANITIZER_CODE = `
const sanitizeInt32Overflow = (obj) => {
    console.log('[PATCHED] Sanitizing keys:', Object.keys(obj));
    for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (key.includes('form') && key.includes('time')) {
             console.log('[PATCHED] Found time field:', key, val);
             obj[key] = 0; // FORCE CLAMP
        }
        if (typeof val === 'number' && Number.isFinite(val) && (val > 2147483647 || val < -2147483647)) {
            console.log('[PATCHED] Blocking overflow:', key, val);
            obj[key] = 0;
        } else if (typeof val === 'string' && /^-?\\d+$/.test(val)) {
             const num = Number(val);
             if (Number.isFinite(num) && (num > 2147483647 || num < -2147483647)) {
                console.log('[PATCHED] Blocking string overflow:', key, val);
                obj[key] = 0;
             }
        }
    }
    return obj;
};
`;

// This is too complex to inject cleanly into packed file.

// SIMPLEST FIX:
// We know `formCompletionTimeSeconds` is the culprit.
// We know where `createApplication` is.
// We can find the string `formCompletionTimeSeconds: integer("form_completion_time_seconds")`? No, that's schema.
// In `db-storage.ts`: `sanitizeInt32Overflow(appToInsert);`

// Let's assume the user can edit `dist/index.js` manually?
// No, it's 2MB of minified spaghetti.

// BETTER PLAN:
// Update `server/db-storage.ts` (Done locally).
// Rebuild locally.
// Upload `dist/index.js` to server.
//
// OR
//
// Run `npm run build` on the server!
// The user has the source code on the server?
// `ls -F /opt/hptourism/homestay/`
// If `server/` and `shared/` exist, user can build.
// `deploy-prod.sh` does NOT run build?
// Let's check `deploy-prod.sh`.
// I didn't verify if it runs build.
// User's `package-release.sh` builds artifact.
// The `install.sh` extracts it.
// The server has the compiled code.
// The server DOES NOT necessarily have the full source or `devDependencies` to build!
// (Production usually installs `--omit=dev` or just dist).

// If server cannot build, we MUST upload the fix.
// PROD server usually has `npm install --production`.
// Verify if `typescript` is installed?
// `npm list typescript`.
// If not, we cannot build on server.

// So, we must provide a **Hot Patch via `sed`** for the specific file?
// Or just upload a small script that monkey-patches?
// `node -r ./patch.js dist/index.js`?
// No, easy to mess up PM2 args.

// **Best option:** 
// Tells user to run a `sed` command to force `formCompletionTimeSeconds` to 0 in the source logic?
// No, dist is minified.

// **Wait!** The user said "dev local is fine".
// I can implement the fix in local `db-storage.ts` (which I did in Post 13505).
// Then tell user to:
// 1. Build locally.
// 2. SCP `dist/index.js` to server.
//
// But user seems to be editing on server directly?
// `nano scripts/...`
// `deploy-prod.sh` runs `kill-ghosts.sh` then `pm2 restart`.
// It does NOT build.

// **Conclusion:**
// The user is deploying PRE-BUILT artifacts (Offline Installer).
// OR the user is editing source on server and building?
// User has `/opt/hptourism/homestay`.
// Check if `node_modules` has `typescript`.
// If yes, user *can* build.

// I will write a script `scripts/rebuild.sh` to try building.
// If it fails, I'll know.
// If it works, problem solved (my local edits are syncing to server? No).
// I am editing `/home/subhash.../Projects...` (Local).
// User is on `root@homstyshmapp` (Remote).
// I am NOT editing Remote files directly.
// I am instructing User to edit Remote files.

// I edited **Local** `db-storage.ts`.
// I need to reflect this on **Remote** `db-storage.ts` AND build.
// OR
// Provide `dist/index.js` ready to go? No, can't generate binary here.

// **Action:**
// 1. Ask User to edit `server/db-storage.ts` on PROD.
// 2. Ask User to run `npm run build`.
// 3. Restart.

// But does PROD have `tsc`?
// Diagnostic: `npm run build` on PROD.

// I'll create `scripts/hot-fix.sh` that edits the file and attempts build.

const FILE_CONTENT = `
import { eq, and, desc, asc, sql } from 'drizzle-orm';
// ... (Full content of db-storage.ts with my fix)
`;

// Too large to paste.

// **The "Nuclear Patch"**:
// We only need to fix `sanitizeInt32Overflow` call.
// We can do it by modifying the `dist/index.js` if we are clever.
// But cleanest is finding if we can build.

// Let's ask user.
// "Do you have the ability to run `npm run build` on the server?"
// "If not, I can give you a `sed` command to patch the JS file directly."

// `sed` to replace `2147483647` with `2147483647` is useless.
// But we can `sed` to replace:
// `val > PG_INT32_MAX` 
// with `val > PG_INT32_MAX || key.includes('Seconds')` ?

// Let's assume the user has source code on server (since they have `scripts/` folder).
// And `package.json` calls `build` script.
// If `npm run build` works, that's the path.

console.log("Creating rebuild check script...");
