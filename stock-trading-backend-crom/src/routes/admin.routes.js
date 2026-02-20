import { Router } from "express";
import { z } from "zod";
import { validate } from "../shared/validate.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import * as AdminController from "../controllers/admin.controller.js";

const router = Router();

router.use(requireAuth, requireRole("ADMIN"));

const CreateStockSchema = z.object({
  body: z.object({
    ticker: z.string().min(1).max(10),
    name: z.string().min(1),
    lastPrice: z.number().positive().default(10),
    volatility: z.number().min(0).max(1).optional(),
    drift: z.number().min(-1).max(1).optional(),
  })
});

router.post("/stocks", validate(CreateStockSchema), AdminController.createStock);

const PatchStockSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    lastPrice: z.number().positive().optional(),
    volatility: z.number().min(0).max(1).optional(),
    drift: z.number().min(-1).max(1).optional(),
  })
});

router.patch("/stocks/:ticker", validate(PatchStockSchema), AdminController.patchStock);
router.delete("/stocks/:ticker", AdminController.removeStock);

router.get("/market/status", AdminController.marketStatus);
router.get("/market/hours", AdminController.getHours);

const UpsertHoursSchema = z.object({
  body: z.object({
    dayOfWeek: z.number().int().min(1).max(5),
    openTimeUtc: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
    closeTimeUtc: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  })
});

router.post("/market/hours", validate(UpsertHoursSchema), AdminController.upsertHours);

export default router;
