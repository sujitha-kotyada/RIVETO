import mongoose from "mongoose";

const viewHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

// One entry per (user, product) pair — re-viewing a product just bumps viewedAt
// instead of creating duplicate rows.
viewHistorySchema.index({ userId: 1, productId: 1 }, { unique: true });

// Speeds up "most recently viewed products for this user" queries.
viewHistorySchema.index({ userId: 1, viewedAt: -1 });

const ViewHistory = mongoose.model("ViewHistory", viewHistorySchema);

export default ViewHistory;
