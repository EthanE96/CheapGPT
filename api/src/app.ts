import express, { Request } from "express";
import cors from "cors";
import session from "express-session";
import morgan from "morgan";
import passport from "passport";
import { connectDB } from "./config/dbConfig";
import routes from "./routes";
import { passportConfig } from "./config/passportConfig";
import { seedModels } from "./seeder/seedModels";

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Allows UI to make requests api from dif domains
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:4200",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
  })
);

// Session Management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.ENV === "PROD", // true in production
      sameSite: process.env.ENV === "PROD" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport and use it with the session
passportConfig();
app.use(passport.initialize());
app.use(passport.session());

// Morgan Logger
morgan.token("body", (req: Request) => {
  return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status - :response-time ms body:body"));

// Seed data
seedModels();

// Routes
app.use("/api", routes);

export default app;
