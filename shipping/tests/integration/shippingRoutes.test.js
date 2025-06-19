import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
dotenv.config();

// We need to import and launch our Express app without starting the listener.
// Refactor your `server.js` so that it exports a function to create the app.
import createApp from "../../server.js";  // ensure createApp is exported

let app, mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Initialize the app
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("POST /shipping/create", () => {
  it("should return 201 and created shipment data", async () => {
    const payload = {
      orderId: "order-456",
      userId: "user-2",
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

    const res = await request(app)
      .post("/shipping/create")
      .send(payload)
      .expect(201)  // assuming your route responds with 201 on success
      .expect("Content-Type", /json/);

    // Verify response structure
    expect(res.body.success).toBe(true);
    expect(res.body.shipment).toHaveProperty("shipmentId");
    expect(res.body.shipment.orderId).toBe(payload.orderId);
  });

  it("should return 400 for invalid payload", async () => {
    const invalidPayload = {};  // missing required fields

    const res = await request(app)
      .post("/shipping/create")
      .send(invalidPayload)
      .expect(400);

    expect(res.body.success).toBe(false);
    // Optionally check error message
  });
});