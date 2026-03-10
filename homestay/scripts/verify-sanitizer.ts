const PG_INT32_MAX = 2_147_483_647;

const sanitizeInt32Overflow = <T extends Record<string, any>>(obj: T): T => {
    for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (typeof val === 'number' && Number.isFinite(val) && (val > PG_INT32_MAX || val < -PG_INT32_MAX)) {
            console.warn(`[db-storage] INT32 OVERFLOW BLOCKED: field="${key}" value=${val} — clamping to 0`);
            (obj as any)[key] = 0;
        } else if (typeof val === 'string') {
            const num = Number(val);
            if (Number.isFinite(num) && (num > PG_INT32_MAX || num < -PG_INT32_MAX)) {
                console.warn(`[db-storage] INT32 OVERFLOW BLOCKED (string): field="${key}" value="${val}" — clamping to "0"`);
                (obj as any)[key] = 0;
            }
        }
    }
    return obj;
};

// Simulation
const testPayload = {
    normalIs: 123,
    overflowNum: 1771484329705, // The timestamp
    overflowStr: "1771484329705", // The timestamp as string
    negativeOverflow: -9999999999,
    mixedCase: 200,
    formCompletionTimeSeconds: 1771484329705
};

console.log("Before:", JSON.stringify(testPayload, null, 2));
sanitizeInt32Overflow(testPayload);
console.log("After:", JSON.stringify(testPayload, null, 2));

// Assertions
if (testPayload.normalIs !== 123) throw new Error("Sanitizer touched valid number");
if (testPayload.overflowNum !== 0) throw new Error("Sanitizer failed to clamp number overflow");
if (testPayload.overflowStr !== 0) throw new Error("Sanitizer failed to clamp string overflow");
if (testPayload.negativeOverflow !== 0) throw new Error("Sanitizer failed to clamp negative overflow");
if (testPayload.formCompletionTimeSeconds !== 0) throw new Error("Sanitizer failed to clamp target field");

console.log("✅ SANITIZER VERIFIED - LOGIC IS CORRECT");
