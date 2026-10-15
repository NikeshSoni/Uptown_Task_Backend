import { Schema, model } from "mongoose";

export type LeadPropertyType =
  | "1 BHK"
  | "2 BHK"
  | "3 BHK"
  | "4 BHK"
  | "Plot"
  | "Commercial"
  | "Other";

export type LeadSource =
  | "Facebook"
  | "Google"
  | "Referral"
  | "Website"
  | "Walk-in"
  | "Other";

export type LeadStatus = "New" | "Contacted" | "Site Visit" | "Closed";

export interface ILead {
  name: string;
  phone: string;
  email?: string | undefined;
  budget: number;
  location: string;
  propertyType: LeadPropertyType;
  source: LeadSource;
  status: LeadStatus;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    propertyType: {
      type: String,
      required: true,
      enum: [
        "1 BHK",
        "2 BHK",
        "3 BHK",
        "4 BHK",
        "Plot",
        "Commercial",
        "Other",
      ],
    },
    source: {
      type: String,
      required: true,
      enum: [
        "Facebook",
        "Google",
        "Referral",
        "Website",
        "Walk-in",
        "Other",
      ],
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Site Visit", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

const Lead = model<ILead>("Lead", leadSchema);

export default Lead;
