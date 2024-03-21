import app  from "./app.js";
import logger from "./configs/logger.config.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

// dotenv config
dotenv.config();

// ENV variables
const PORT = process.env.PORT || 8000;
const { DATABASE_URL } = process.env;

// Exit on Mongodb connection error
mongoose.connection.on("error", (error) => {
    logger.error(`Mongodb connection error ${error}`);
    process.exit(1);
})

// MongoDB debug mode
if(process.env.NODE_ENV === "development") {
    mongoose.set("debug", true);
}

// Mongodb connection
mongoose
    .connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        logger.info("MongoDB connected");
    })


let server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
});

// handle server errors
const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info("Server closed");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

/**
 * Handles unexpected errors by logging the error and calling the exitHandler function.
 *
 * @param {Error} error - the error that occurred
 * @return {void} 
 */
const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

// Sigterm
process.on("SIGTERM", () => {
    if (server) {
        logger.info("Server closed");
        process.exit(1);
    }
})