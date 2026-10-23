
import mongoose from "mongoose";

let connectionPromise;

const connectToDatabase = async () => {
  // Reuse an existing connection.
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Avoid duplicate simultaneous connection attempts.
  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from environment variables");
  }

  connectionPromise = mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      autoIndex: process.env.NODE_ENV !== "production",
    })
    .then(() => {
      console.info(
        `MongoDB connected successfully: ${mongoose.connection.host}/${mongoose.connection.name}`
      );

      return mongoose.connection;
    })
    .catch((error) => {
      connectionPromise = undefined;
      throw error;
    });

  return connectionPromise;
};

// Monitor database connection events.
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.info("MongoDB reconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error.message);
});

// Close the database connection during shutdown.
export const disconnectFromDatabase = async () => {
  connectionPromise = undefined;

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.info("MongoDB connection closed");
  }
};

export default connectToDatabase;
