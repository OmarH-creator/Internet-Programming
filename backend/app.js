const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");



const app = express();

app.use(cors());
// Increase limit to handle base64 images (10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    const queryString = Object.keys(req.query || {}).length ? ` query=${JSON.stringify(req.query)}` : "";

    console.log(
      `[HTTP] ${req.method} ${req.originalUrl}${queryString} -> ${res.statusCode} (${durationMs}ms)`
    );
  });

  next();
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);


module.exports = app;