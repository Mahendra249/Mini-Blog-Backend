require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auth = require("./middleware/authMiddleware");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);

app.get("/api/protected", auth, (req, res) => {
  res.json({ msg: "You are authorized", user: req.user });
});

app.get("/", (req, res) => {
  res.send("Hello from Mini Auth Blog App!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
