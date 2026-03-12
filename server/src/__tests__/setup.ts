import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
  const testDbUri =
    process.env.MONGODB_URI_TEST ||
    "mongodb://localhost:27017/ratna-bakery-test";
  await mongoose.connect(testDbUri);
}, 30000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}, 30000);
