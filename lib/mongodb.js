import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Your connection string
const options = {
  // Use new URL parser and unified topology (recommended defaults)
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the client
  // is preserved across module reloads (HMR).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export the promise so API routes can await it
export default clientPromise;
