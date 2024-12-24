import express, { Application, Request } from "express";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import { connectDB } from "./config/db";
import routes from "./routes";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import "./config/passport";

const app: Application = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      // TODO: will need to update
      secure: process.env.NODE_ENV === "development",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//morgan middleware
morgan.token("body", (req: Request) => {
  return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status - :response-time ms body:body"));

app.use("/api", routes);

export default app;
