//APIproject/shipping/tests/unit/shippingService.test.js
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Shipping from "../../models/shipping.js";
import { createShipment } from "../../services/shippingService.js";
import { MongoMemoryServer } from "mongodb-memory-server";

describe("createShipment()", () => {
  let mongod;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  afterEach(async () => {
    await Shipping.deleteMany({});
  });

  it("creates and saves a valid shipment", async () => {
    const payload = {
      orderId: "order-123",
      userId: "user-1",
      address: {
        street: "runner",
        city: "vancouver",
        state: "bc",
        postalCode: "V5K",
        country: "canada",
        phoneNumber: "123456789",
      },
      carrier: "USPS"
    };

    const shipment = await createShipment(payload);
    expect(shipment).toHaveProperty("shipmentId");
    expect(shipment.orderId).toBe("order-123");
    expect(shipment.address.city).toBe("vancouver");

    const count = await Shipping.countDocuments();
    expect(count).toBe(1);
  });

  it("throws an error if required fields are missing", async () => {
    const invalidPayload = {
      orderId: "order-123",
      userId: "user-1"
      // Missing address and carrier
    };

    await expect(createShipment(invalidPayload)).rejects.toThrow();
  });
});