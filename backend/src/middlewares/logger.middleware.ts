import morgan from "morgan";
import logger from "../../config/logger.config.js";

const morganFormat = ":method :url :status :response-time ms";

// Define stream for Morgan to use Winston's logger
const stream = {
  write: (message: string) => {
    const logObject = {
      method: message.split(" ")[0],
      url: message.split(" ")[1],
      status: message.split(" ")[2],
      responseTime: message.split(" ")[3],
    };
    logger.info(JSON.stringify(logObject));
  },
};

// Build Morgan middleware
const morganMiddleware = morgan(morganFormat, { stream });

export default morganMiddleware;