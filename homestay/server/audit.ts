import { db } from "./db";
import { applicationActions } from "@shared/schema";
import { logger } from "./logger";

export type LogApplicationActionPayload = {
  applicationId: string;
  actorId?: string | null;
  action: string;
  previousStatus?: string | null;
  newStatus?: string | null;
  feedback?: string | null;
  correctionType?: string | null; // v1.3.0: 'general', 'category_correction', 'payment_term_correction'
};

export async function logApplicationAction({
  applicationId,
  actorId,
  action,
  previousStatus,
  newStatus,
  feedback,
  correctionType,
}: LogApplicationActionPayload) {
  if (!actorId) {
    logger.warn("[timeline] Skipping log due to missing actor", {
      applicationId,
      action,
    });
    return;
  }

  try {
    await db.insert(applicationActions).values({
      applicationId,
      officerId: actorId,
      action,
      previousStatus: previousStatus ?? null,
      newStatus: newStatus ?? null,
      feedback: feedback ?? null,
      correctionType: correctionType ?? null,
    });
  } catch (error) {
    logger.error({ err: error, applicationId, action }, "[timeline] Failed to log application action");
  }
}
