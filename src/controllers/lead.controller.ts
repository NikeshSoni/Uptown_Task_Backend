import type { Request, Response, NextFunction } from "express";
import {
  createLeadSchema,
  updateLeadSchema,
} from "../validators/lead.validator.js";
import * as leadService from "../services/lead.service.js";

type LeadIdParams = { id: string };

export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = createLeadSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten(),
      });
      return;
    }

    const lead = await leadService.createLead(validation.data);

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 100",
      });
      return;
    }

    const result = await leadService.getLeads({
      search: String(req.query.search ?? ""),
      source: String(req.query.source ?? ""),
      status: String(req.query.status ?? ""),
      sortBy: String(req.query.sortBy ?? "createdAt"),
      order: String(req.query.order ?? "desc"),
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      data: result.leads,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (
  req: Request<LeadIdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      return;
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: Request<LeadIdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = updateLeadSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten(),
      });
      return;
    }

    if (Object.keys(validation.data).length === 0) {
      res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
      return;
    }

    const lead = await leadService.updateLead(
      req.params.id,
      validation.data
    );

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: Request<LeadIdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const lead = await leadService.deleteLead(req.params.id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};