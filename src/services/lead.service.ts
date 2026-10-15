import type { z } from "zod";
import mongoose, { Types } from "mongoose";
import Lead, {
  type ILead,
  type LeadSource,
  type LeadStatus,
} from "../models/Lead.js";
import Note from "../models/Note.js";
import {
  createLeadSchema,
  updateLeadSchema,
} from "../validators/lead.validator.js";

const LEAD_SOURCES: readonly LeadSource[] = [
  "Facebook",
  "Google",
  "Referral",
  "Website",
  "Walk-in",
  "Other",
];

const LEAD_STATUSES: readonly LeadStatus[] = [
  "New",
  "Contacted",
  "Site Visit",
  "Closed",
];

export const createLead = async (data: z.infer<typeof createLeadSchema>) => {
  return Lead.create(data);
};

export const getLeads = async (query: {
  search?: string;
  source?: string;
  status?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  limit?: number;
}) => {
  const {
    search,
    source,
    status,
    sortBy = "createdAt",
    order = "desc",
    page = 1,
    limit = 10,
  } = query;

  const filter: mongoose.QueryFilter<ILead> = {};

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: { $regex: escapedSearch, $options: "i" } },
      { phone: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  if (source && LEAD_SOURCES.includes(source as LeadSource)) {
    filter.source = source as LeadSource;
  }
  if (status && LEAD_STATUSES.includes(status as LeadStatus)) {
    filter.status = status as LeadStatus;
  }

  const allowedSortFields = ["createdAt", "budget", "name"];
  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  const safePage = Math.max(1, Math.floor(page));
  const safeLimit = Math.min(100, Math.max(1, Math.floor(limit)));
  const sortOrder = order === "asc" ? 1 : -1;

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort({ [safeSortBy]: sortOrder })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean(),
    Lead.countDocuments(filter),
  ]);

  return {
    leads,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

export const getLeadById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;

  return Lead.findById(id).lean();
};

export const updateLead = async (
  id: string,
  data: z.infer<typeof updateLeadSchema>
) => {
  if (!Types.ObjectId.isValid(id)) return null;

  return Lead.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
};

export const deleteLead = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;

  const deletedLead = await Lead.findByIdAndDelete(id);

  if (deletedLead) {
    await Note.deleteMany({ lead: deletedLead._id });
  }

  return deletedLead;
};
