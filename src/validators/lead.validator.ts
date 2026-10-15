import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 characters"),
  email: z.union([z.string().trim().email(), z.literal("")]).optional(),
  budget: z.coerce.number().min(0, "Budget cannot be negative"),
  location: z.string().trim().min(2, "Location is required"),
  propertyType: z.enum([
    "1 BHK",
    "2 BHK",
    "3 BHK",
    "4 BHK",
    "Plot",
    "Commercial",
    "Other",
  ]),
  source: z.enum([
    "Facebook",
    "Google",
    "Referral",
    "Website",
    "Walk-in",
    "Other",
  ]),
});

export const updateLeadSchema = createLeadSchema.partial().extend({
  status: z.enum(["New", "Contacted", "Site Visit", "Closed"]).optional(),
});