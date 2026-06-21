import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  addReviewSchema,
  addToCartSchema,
  loginSchema,
  registerSchema,
  updateCartSchema,
} from "../validators/authSchemas.js";

const validObjectId = "507f1f77bcf86cd799439011";

const getErrorDetails = (schema, payload) => {
  const { error } = schema.validate(payload, { abortEarly: false });

  return error?.details.map(({ path, type, message }) => ({
    path: path.join("."),
    type,
    message,
  })) ?? [];
};

const getErrorMessages = (schema, payload) =>
  getErrorDetails(schema, payload).map(({ message }) => message);

const getErrorTypes = (schema, payload) =>
  getErrorDetails(schema, payload).map(({ path, type }) => ({ path, type }));

describe("registerSchema", () => {
  const validRegistration = {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
  };

  it("accepts a valid registration payload", () => {
    const { error, value } = registerSchema.validate(validRegistration);

    assert.equal(error, undefined);
    assert.deepEqual(value, validRegistration);
  });

  it("accepts boundary values for name and password length", () => {
    const minimumPayload = {
      name: "Jon",
      email: "jon@example.com",
      password: "12345678",
    };

    const maximumPayload = {
      name: "A".repeat(30),
      email: "avery@example.com",
      password: "12345678",
    };

    assert.equal(registerSchema.validate(minimumPayload).error, undefined);
    assert.equal(registerSchema.validate(maximumPayload).error, undefined);
  });

  it("rejects missing required fields with custom messages", () => {
    assert.deepEqual(getErrorMessages(registerSchema, {}), [
      "Name is a required field",
      "Email is a required field",
      "Password is a required field",
    ]);
  });

  it("rejects empty strings and invalid formats", () => {
    const payload = {
      name: "",
      email: "not-an-email",
      password: "short",
    };

    assert.deepEqual(getErrorTypes(registerSchema, payload), [
      {
        path: "name",
        type: "string.empty",
      },
      {
        path: "email",
        type: "string.email",
      },
      {
        path: "password",
        type: "string.min",
      },
    ]);

    assert.deepEqual(getErrorMessages(registerSchema, payload), [
      "Name cannot be empty",
      "Please provide a valid email address",
      "Password must be at least 8 characters long",
    ]);
  });

  it("rejects empty email and password strings", () => {
    assert.deepEqual(getErrorTypes(registerSchema, {
      name: "Jane Doe",
      email: "",
      password: "",
    }), [
      {
        path: "email",
        type: "string.empty",
      },
      {
        path: "password",
        type: "string.empty",
      },
    ]);
  });

  it("rejects names outside the configured length boundaries", () => {
    assert.deepEqual(getErrorDetails(registerSchema, {
      ...validRegistration,
      name: "Al",
    }), [
      {
        path: "name",
        type: "string.min",
        message: "Name must be at least 3 characters",
      },
    ]);

    assert.deepEqual(getErrorTypes(registerSchema, {
      ...validRegistration,
      name: "A".repeat(31),
    }), [
      {
        path: "name",
        type: "string.max",
      },
    ]);
  });
});

describe("loginSchema", () => {
  it("accepts a valid login payload", () => {
    const payload = {
      email: "jane@example.com",
      password: "password123",
    };

    const { error, value } = loginSchema.validate(payload);

    assert.equal(error, undefined);
    assert.deepEqual(value, payload);
  });

  it("rejects missing required fields", () => {
    assert.deepEqual(getErrorDetails(loginSchema, {}), [
      {
        path: "email",
        type: "any.required",
        message: "Email is a required field",
      },
      {
        path: "password",
        type: "any.required",
        message: "\"password\" is required",
      },
    ]);
  });

  it("rejects invalid email and short password values", () => {
    const payload = {
      email: "invalid-email",
      password: "short",
    };

    assert.deepEqual(getErrorTypes(loginSchema, payload), [
      {
        path: "email",
        type: "string.email",
      },
      {
        path: "password",
        type: "string.min",
      },
    ]);

    assert.equal(
      getErrorMessages(loginSchema, payload)[0],
      "Please provide a valid email address",
    );
  });

  it("rejects empty email and password strings", () => {
    assert.deepEqual(getErrorTypes(loginSchema, {
      email: "",
      password: "",
    }), [
      {
        path: "email",
        type: "string.empty",
      },
      {
        path: "password",
        type: "string.empty",
      },
    ]);
  });
});

describe("addToCartSchema", () => {
  it("accepts a valid cart item payload", () => {
    const payload = {
      itemId: validObjectId,
      size: "M",
    };

    const { error, value } = addToCartSchema.validate(payload);

    assert.equal(error, undefined);
    assert.deepEqual(value, payload);
  });

  it("rejects missing item and size fields with custom messages", () => {
    assert.deepEqual(getErrorMessages(addToCartSchema, {}), [
      "Item ID is required",
      "Size is required",
    ]);
  });

  it("rejects empty item and size values with custom messages", () => {
    assert.deepEqual(getErrorMessages(addToCartSchema, {
      itemId: "",
      size: "",
    }), [
      "Item ID cannot be empty",
      "Size cannot be empty",
    ]);
  });
});

describe("updateCartSchema", () => {
  const validUpdate = {
    itemId: validObjectId,
    size: "L",
    quantity: 1,
  };

  it("accepts valid quantity boundary values", () => {
    assert.equal(updateCartSchema.validate(validUpdate).error, undefined);
    assert.equal(updateCartSchema.validate({
      ...validUpdate,
      quantity: 0,
    }).error, undefined);
  });

  it("rejects missing fields with custom messages", () => {
    assert.deepEqual(getErrorMessages(updateCartSchema, {}), [
      "Item ID is required",
      "Size is required",
      "Quantity is required",
    ]);
  });

  it("rejects invalid item, size, and quantity values", () => {
    assert.deepEqual(getErrorDetails(updateCartSchema, {
      itemId: "",
      size: "",
      quantity: -1,
    }), [
      {
        path: "itemId",
        type: "string.empty",
        message: "Item ID cannot be empty",
      },
      {
        path: "size",
        type: "string.empty",
        message: "Size cannot be empty",
      },
      {
        path: "quantity",
        type: "number.min",
        message: "Quantity must be at least 0",
      },
    ]);
  });

  it("rejects non-numeric and non-integer quantity values", () => {
    assert.deepEqual(getErrorDetails(updateCartSchema, {
      ...validUpdate,
      quantity: "many",
    }), [
      {
        path: "quantity",
        type: "number.base",
        message: "Quantity must be a number",
      },
    ]);

    assert.deepEqual(getErrorTypes(updateCartSchema, {
      ...validUpdate,
      quantity: 1.5,
    }), [
      {
        path: "quantity",
        type: "number.integer",
      },
    ]);
  });
});

describe("addReviewSchema", () => {
  const validReview = {
    productId: validObjectId,
    rating: 5,
    comment: "Great product",
  };

  it("accepts valid rating and comment boundary values", () => {
    assert.equal(addReviewSchema.validate(validReview).error, undefined);
    assert.equal(addReviewSchema.validate({
      ...validReview,
      rating: 1,
      comment: "abc",
    }).error, undefined);
    assert.equal(addReviewSchema.validate({
      ...validReview,
      rating: 5,
      comment: "A".repeat(1000),
    }).error, undefined);
  });

  it("rejects missing fields with custom messages", () => {
    assert.deepEqual(getErrorMessages(addReviewSchema, {}), [
      "Product ID is required",
      "Rating is required",
      "Comment is required",
    ]);
  });

  it("rejects invalid ObjectIds and empty comments with custom messages", () => {
    assert.deepEqual(getErrorDetails(addReviewSchema, {
      productId: "not-a-valid-object-id",
      rating: 3,
      comment: "",
    }), [
      {
        path: "productId",
        type: "string.pattern.base",
        message: "Product ID must be a valid MongoDB ObjectId",
      },
      {
        path: "comment",
        type: "string.empty",
        message: "Comment cannot be empty",
      },
    ]);
  });

  it("rejects rating boundary violations and non-integer values", () => {
    assert.deepEqual(getErrorMessages(addReviewSchema, {
      ...validReview,
      rating: 0,
    }), ["Rating must be at least 1"]);

    assert.deepEqual(getErrorMessages(addReviewSchema, {
      ...validReview,
      rating: 6,
    }), ["Rating cannot exceed 5"]);

    assert.deepEqual(getErrorMessages(addReviewSchema, {
      ...validReview,
      rating: 3.5,
    }), ["Rating must be a whole number"]);
  });

  it("rejects comment length boundary violations after trimming", () => {
    assert.deepEqual(getErrorDetails(addReviewSchema, {
      ...validReview,
      comment: " ab ",
    }), [
      {
        path: "comment",
        type: "string.min",
        message: "Comment must be at least 3 characters",
      },
    ]);

    assert.deepEqual(getErrorMessages(addReviewSchema, {
      ...validReview,
      comment: "A".repeat(1001),
    }), ["Comment cannot exceed 1000 characters"]);
  });
});
