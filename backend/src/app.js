import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", (await import("./routes/authRoutes.js")).default);

app.use("/api/posts", (await import("./routes/postRoutes.js")).default);

export default app;