import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";

const app = express();

//Morgan
if(process.env.NODE_ENV !== "production")  {
    app.use(morgan("dev"));
}

//Helmet
app-use(helmet());

// Parse JSON request url
app.use(express.json());

// Parse JSON request bodies
app.use(express.urlencoded({ extended: true }))// for parsing application/json());

// Sanitize request data
app.use(mongoSanitize());

// Enable cookie parser
app.use(cookieParser());

// Compress responses
app.use(compression());

// Enable file upload
app.use(fileUpload({
    useTempFiles: true,
}));

// Enable cors
app.use(cors());


export default app;