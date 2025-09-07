require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auth = require("./middleware/authMiddleware");
const connectDB = require("./config/db");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mini-blog-frontend-phi.vercel.app",
    ],
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
  res.sendFile(path.join(__dirname, "index.html"));
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
