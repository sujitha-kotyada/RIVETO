import mongoose from "mongoose";

// Tracks products a user has explicitly dismissed from "Picks For You" so we
// don't keep recommending the same thing after they've said "not interested".
const dismissedPickSchema = new mongoose.Schema(
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
    dismissedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

dismissedPickSchema.index({ userId: 1, productId: 1 }, { unique: true });

const DismissedPick = mongoose.model("DismissedPick", dismissedPickSchema);

export default DismissedPick;
