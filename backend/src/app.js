import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";
import createHttpError from "http-errors";
import routes from "./routes/index.js";

const app = express();

//Morgan
if(process.env.NODE_ENV !== "production")  {
    app.use(morgan("dev"));
}



//Helmet
app.use(helmet());

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

app.post("/test", (req, res) => {
    console.log(req.body);
    res.send(req.body);
})


// Api v1 routes
app.use("/api/v1", routes)

app.use(async(req, res, next) => {
    next(createHttpError.NotFound("This route does not exist"));
})

//error handling
app.use(async(error, req, res, next) => {
    res.status(error.status || 500);
    res.send({
        status: error.status || 500,
        message: error.message,
    })
})


export default app;