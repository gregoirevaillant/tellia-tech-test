import "dotenv/config";
import app from "./src/app";
import connectDB from "./src/config/db";

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err: Error) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
