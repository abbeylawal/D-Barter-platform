const express = require("express");
const connectDB = require("./utils/connectDB");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const nftRoutes = require("./routes/nftRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
require("dotenv").config();

const app = express();

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/nfts", nftRoutes);
app.use("/api/trades", tradeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
