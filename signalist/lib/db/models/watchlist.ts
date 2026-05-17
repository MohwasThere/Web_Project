import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const watchlistSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    items: {
      type: [
        new Schema(
          {
            symbol: { type: String, required: true },
            name: { type: String, required: true },
            entryPrice: { type: Number, required: true },
            addedAt: { type: Date, default: Date.now },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  { timestamps: true }
);

watchlistSchema.index({ userId: 1 }, { unique: true });

export type WatchlistDocument = InferSchemaType<typeof watchlistSchema>;

export const WatchlistModel: Model<WatchlistDocument> =
  models.Watchlist || model("Watchlist", watchlistSchema);
