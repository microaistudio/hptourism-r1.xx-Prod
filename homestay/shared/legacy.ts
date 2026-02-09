import type { ApplicationServiceContext, HomestayApplication } from "./schema";

const LEGACY_STATUS = new Set(["legacy_rc_review"]);

const isLegacyContext = (context?: ApplicationServiceContext | null) => {
  if (!context) {
    return false;
  }

  if (typeof context.legacyOnboarding === "boolean") {
    return context.legacyOnboarding;
  }

  if (typeof context.legacyGuardianName === "string" && context.legacyGuardianName.trim().length > 0) {
    return true;
  }

  return false;
};

export const isLegacyApplication = (application?: HomestayApplication | null) => {
  if (!application) {
    return false;
  }

  if (LEGACY_STATUS.has(application.status ?? "")) {
    return true;
  }

  if (LEGACY_STATUS.has(application.currentStage ?? "")) {
    return true;
  }

  const context = application.serviceContext as ApplicationServiceContext | null | undefined;
  if (isLegacyContext(context)) {
    return true;
  }

  if (application.applicationKind === "renewal" && application.projectType === "existing_property") {
    return true;
  }

  return false;
};
