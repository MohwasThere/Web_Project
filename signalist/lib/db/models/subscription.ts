import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const subscriptionSchema = new Schema(
  {
    userId: { type: String, required: true },
    plan: {
      type: String,
      enum: ["Free", "Basic", "Premium", "Pro"],
      default: "Free",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "trialing", "canceled"],
      default: "active",
      required: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1 }, { unique: true });

export type SubscriptionDocument = InferSchemaType<typeof subscriptionSchema>;

export const SubscriptionModel: Model<SubscriptionDocument> =
  models.Subscription || model("Subscription", subscriptionSchema);
