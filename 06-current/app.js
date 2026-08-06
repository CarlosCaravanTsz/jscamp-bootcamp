import express from "express";
import {corsMiddleware} from "./middlewares/cors.js";
import { DEFAULTS } from "./config.js";
import jobs from "./jobs.json" with { type: "json" };
import { jobsRouter } from "./routes/jobs.js";

const PORT = process.env.PORT ?? DEFAULTS.PORT;
const app = express();

app.use(corsMiddleware()); 
app.use(express.json()); 

app.use('/jobs', jobsRouter)

app.get("/health", (req, res) => {
  return res.json({
    status: "ok",
    uptime: process.uptime(),
  });
});

if( process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server levandato en localhost:${PORT}`);
  });
}

export default app;