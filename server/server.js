import "dotenv/config";
import dns from "node:dns";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

// Kuch networks SRV lookup block karte hain, isliye Google/Cloudflare DNS use karte hain
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });