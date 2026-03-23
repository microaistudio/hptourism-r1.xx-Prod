import { Router } from "express";
import { requireAuth, requireRole } from "./core/middleware";
import { db } from "../db";
import { helpResources } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export function createHelpRouter() {
  const router = Router();

  // Public/All users: Get all active help resources
  router.get("/", async (req, res) => {
    try {
      const resources = await db
        .select()
        .from(helpResources)
        .where(eq(helpResources.isActive, true))
        .orderBy(desc(helpResources.displayOrder), desc(helpResources.createdAt));
      res.json({ resources });
    } catch (error) {
      console.error("[help] Failed to fetch resources:", error);
      res.status(500).json({ message: "Failed to fetch help resources" });
    }
  });

  // Admin: Get all help resources (including inactive)
  router.get("/admin", requireRole('super_admin', 'system_admin', 'state_officer'), async (req, res) => {
    try {
      const resources = await db
        .select()
        .from(helpResources)
        .orderBy(desc(helpResources.displayOrder), desc(helpResources.createdAt));
      res.json({ resources });
    } catch (error) {
      console.error("[help admin] Failed to fetch resources:", error);
      res.status(500).json({ message: "Failed to fetch help resources" });
    }
  });

  // Admin: Create resource
  router.post("/", requireRole('super_admin', 'system_admin', 'state_officer'), async (req, res) => {
    try {
      const { title, description, type, contentUrl, contentBody, isActive, displayOrder } = req.body;
      const userId = req.session.userId!;

      const [newResource] = await db
        .insert(helpResources)
        .values({
          title,
          description,
          type,
          contentUrl,
          contentBody,
          isActive: isActive !== false,
          displayOrder: displayOrder || 0,
          createdBy: userId,
        })
        .returning();

      res.json({ message: "Resource created successfully", resource: newResource });
    } catch (error) {
      console.error("[help] Failed to create resource:", error);
      res.status(500).json({ message: "Failed to create help resource" });
    }
  });

  // Admin: Update resource
  router.patch("/:id", requireRole('super_admin', 'system_admin', 'state_officer'), async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, type, contentUrl, contentBody, isActive, displayOrder } = req.body;

      const [updatedResource] = await db
        .update(helpResources)
        .set({
          title,
          description,
          type,
          contentUrl,
          contentBody,
          isActive,
          displayOrder,
          updatedAt: new Date(),
        })
        .where(eq(helpResources.id, id))
        .returning();

      if (!updatedResource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      res.json({ message: "Resource updated successfully", resource: updatedResource });
    } catch (error) {
      console.error("[help] Failed to update resource:", error);
      res.status(500).json({ message: "Failed to update help resource" });
    }
  });

  // Admin: Delete resource
  router.delete("/:id", requireRole('super_admin', 'system_admin', 'state_officer'), async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(helpResources).where(eq(helpResources.id, id));
      res.json({ message: "Resource deleted successfully" });
    } catch (error) {
      console.error("[help] Failed to delete resource:", error);
      res.status(500).json({ message: "Failed to delete help resource" });
    }
  });

  return router;
}
