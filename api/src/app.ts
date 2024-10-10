import express, { Application, Request } from "express";
import cors from "cors";
import { json, urlencoded } from "body-parser";
//import { connectDB } from "./config/db";
import routes from "./routes";
import morgan from "morgan";

const app: Application = express();

//connectDB();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

//morgan middleware
morgan.token("body", (req: Request) => {
  return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status - :response-time ms body:body"));

app.use("/api", routes);

export default app;
