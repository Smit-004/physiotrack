import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// Ye 3 imports abhi comment hain, kyunki ye files abhi bani nahi hain
import authRoutes from "./routes/auth.routes.js";
import logRoutes from "./routes/log.routes.js";
import statsRoutes from "./routes/stats.routes.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/stats", statsRoutes);

// Global error handler: koi bhi unexpected error yahin aayega
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

export default app;