const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/users", userRoutes);
module.exports = app;