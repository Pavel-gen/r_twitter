import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const ReTweet = new Schema(
  {
    tweet: { type: Schema.Types.ObjectId, ref: "Tweet" },
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ReTweet", ReTweet);
