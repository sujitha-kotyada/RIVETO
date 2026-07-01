import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getAdmin, getCurrentUser } from "../controller/userController.js";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controller/addressController.js";
import adminAuth from "../middleware/adminAuth.js";
import { userRateLimiter, adminRateLimiter } from "../middleware/rateLimiters.js";
import validateRequest from "../middleware/validateRequest.js";
import { addressSchema } from "../validators/authSchemas.js";
import {
  logView,
  getRecentlyViewed,
  clearViewHistory,
  removeViewedItem,
  getPicksForYou,
  dismissPick,
} from "../controller/viewHistoryController.js";

let userRoutes = express.Router();

userRoutes.get("/getCurrentUser", isAuth, userRateLimiter, getCurrentUser);
userRoutes.get("/getadmin", adminAuth, adminRateLimiter, getAdmin);

// Recently Viewed + Picks For You — all protected by isAuth
userRoutes.post("/recently-viewed", isAuth, userRateLimiter, logView);
userRoutes.get("/recently-viewed", isAuth, userRateLimiter, getRecentlyViewed);
userRoutes.delete("/recently-viewed", isAuth, userRateLimiter, clearViewHistory);
userRoutes.delete("/recently-viewed/:productId", isAuth, userRateLimiter, removeViewedItem);
userRoutes.get("/picks-for-you", isAuth, userRateLimiter, getPicksForYou);
userRoutes.delete("/picks-for-you/:productId", isAuth, userRateLimiter, dismissPick);

// Address routes — all protected by isAuth
userRoutes.get("/address", isAuth, userRateLimiter, getAddresses);
userRoutes.post("/address", isAuth, userRateLimiter, validateRequest(addressSchema), addAddress);
userRoutes.put("/address/:addressId", isAuth, userRateLimiter, validateRequest(addressSchema), updateAddress);
userRoutes.delete("/address/:addressId", isAuth, userRateLimiter, deleteAddress);
userRoutes.patch("/address/:addressId/default", isAuth, userRateLimiter, setDefaultAddress);

export default userRoutes;
