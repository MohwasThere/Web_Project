import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const predictionSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, index: true },
    direction: {
      type: String,
      enum: ["bullish", "bearish", "neutral"],
      required: true,
    },
    confidence: { type: Number, required: true, min: 0, max: 100 },
    target: { type: String, required: true },
    reason: { type: String, required: true },
    raw: { type: String, required: true },
  },
  { timestamps: true }
);

predictionSchema.index({ userId: 1, createdAt: -1 });

export type PredictionDocument = InferSchemaType<typeof predictionSchema>;

export const PredictionModel: Model<PredictionDocument> =
  models.Prediction || model("Prediction", predictionSchema);
