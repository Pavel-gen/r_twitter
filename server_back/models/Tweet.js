import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const Tweet = new Schema(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    content: { type: String, required: true, trim: true },
    title: { type: String },
    likes: { type: Schema.Types.Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Tweet", default: [] }],
    commentTo: { type: Schema.Types.ObjectId, ref: "Tweet", default: null },
    threadId: { type: Schema.Types.ObjectId, ref: "Tweet", default: null },
    retweetedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isRetweet: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Tweet", Tweet);
