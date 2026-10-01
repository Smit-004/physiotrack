import mongoose from "mongoose";

export const BODY_PARTS = [
  "knee", "shoulder", "lower back", "neck", "ankle", "hip", "elbow", "wrist", "other",
];

const logSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true },
    bodyPart: { type: String, enum: BODY_PARTS, required: true },
    exercise: { type: String, required: true, trim: true, maxlength: 80 },
    durationMin: { type: Number, required: true, min: 1, max: 300 },
    pain: { type: Number, required: true, min: 1, max: 10 },
    notes: { type: String, trim: true, maxlength: 300 },
  },
  { timestamps: true }
);

export default mongoose.model("Log", logSchema);