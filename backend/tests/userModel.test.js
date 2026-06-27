import assert from "node:assert/strict";
import { describe, it } from "node:test";

import User from "../model/userModel.js";

describe("User model auth providers", () => {
  it("allows Google users without a password", async () => {
    const googleUser = new User({
      name: "Jane Doe",
      email: "jane.google@example.com",
      authProvider: "google",
    });

    await assert.doesNotReject(() => googleUser.validate());
  });

  it("requires a password for local users", async () => {
    const localUser = new User({
      name: "Jane Doe",
      email: "jane.local@example.com",
    });

    await assert.rejects(
      () => localUser.validate(),
      /Path `password` is required/,
    );
  });
});
