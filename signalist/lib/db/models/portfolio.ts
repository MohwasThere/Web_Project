import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const holdingSchema = new Schema(
  {
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    shares: { type: Number, required: true },
    buyPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
  },
  { _id: false }
);

const portfolioSchema = new Schema(
  {
    userId: { type: String, required: true },
    holdings: { type: [holdingSchema], default: [] },
  },
  { timestamps: true }
);

portfolioSchema.index({ userId: 1 }, { unique: true });

export type PortfolioDocument = InferSchemaType<typeof portfolioSchema>;

export const PortfolioModel: Model<PortfolioDocument> =
  models.Portfolio || model("Portfolio", portfolioSchema);
