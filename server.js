import "dotenv/config";
import app from "./src/app.js";
import connectToDatabase, {
  disconnectFromDatabase,
} from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectToDatabase();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const shutdown = async () => {
    console.log("Shutting down server...");

    server.close(async () => {
      try {
        await disconnectFromDatabase();
        process.exit(0);
      } catch (error) {
        console.error("Shutdown failed:", error.message);
        process.exit(1);
      }
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer().catch((error) => {
  console.error("Application startup failed:", error.message);
  process.exit(1);
});