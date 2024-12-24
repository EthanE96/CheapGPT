import express, { Request } from "express";
import cors from "cors";
import session from "express-session";
import morgan from "morgan";
import passport from "passport";

import { connectDB } from "./config/dbConfig";
import routes from "./routes";
import { passportConfig } from "./config/passportConfig";

const app = express();

// Connect to MongoDB
connectDB();

// Allows ui to make requests api from dif domains
app.use(
  cors({
    origin: "http://localhost:4200", //TODO: Angular URL
    credentials: true,
  })
);

// Session Management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false }, //TODO: Change to true in production with HTTPS
  })
);

// Initialize Passport and use it with the session
passportConfig();
app.use(passport.initialize());
app.use(passport.session());

// Morgan logger
morgan.token("body", (req: Request) => {
  return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status - :response-time ms body:body"));

// Routes
app.use("/api", routes);

export default app;
