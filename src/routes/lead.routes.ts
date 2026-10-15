import { Router } from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from "../controllers/lead.controller.js";

const router = Router();

router.route("/").post(createLead).get(getLeads);

router
  .route("/:id")
  .get(getLeadById)
  .patch(updateLead)
  .delete(deleteLead);

export default router;