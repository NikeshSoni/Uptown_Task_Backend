import { Schema, model, type Model, type Types } from "mongoose";


export interface INote {
  lead: Types.ObjectId;
  content: string;
}

const noteSchema = new Schema<INote>(
  {
    lead: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, "Note content is required"],
      trim: true,
      maxlength: [2000, "Note cannot exceed 2000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const Note: Model<INote> = model<INote>("Note", noteSchema);

export default Note;