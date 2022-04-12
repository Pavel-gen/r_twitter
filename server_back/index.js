import mongoose from "mongoose";
import express from "express";
import router from "./router.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const uri = process.env.DB_URL;
const app = express();

const PORT = process.env.PORT || 5000;
app.use("/static", express.static("./static"));
app.use(cors());
app.use(express.json());
app.use("/api", router);
const start = async () => {
  try {
    await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    app.listen(PORT, () => {
      console.log(`server is running, pls check on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();

