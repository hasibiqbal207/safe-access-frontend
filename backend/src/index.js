import app from "./app";
import dotenv from "dotenv";
import logger from "./configs/logger.config";

// dotenv config
dotenv.config();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));