import Tweet from "../models/Tweet.js";
import User from "../models/User.js";

class TweetController {
  async create(req, res) {
    try {
      const user = await User.findById(req.user.id);
      const tweet = await Tweet.create({
        author: user.id,
        content: req.body.content,
      });
      user.tweets.push(tweet);
      user.save();
      return res.status(200).json([tweet, user]);
    } catch (e) {
      console.log(e);
    }
  }

  async getAll(req, res) {
    try {
      const posts = await Tweet.find().populate("author");
      res.status(200).json(posts);
    } catch (err) {
      console.log(err);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const post = await Tweet.findById(id);
      res.status(200).send(post);
    } catch (e) {
      console.log(e);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const updatedPost = await Tweet.findByIdAndUpdate(id, {
        $set: {
          title: title,
          content: content,
        },
      }).populate("author");

      res.status(200).json(updatedPost);
    } catch (e) {
      res.json(e);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Tweet.findByIdAndDelete(id);
      res.status(200).json({ message: "deleted" });
    } catch (e) {
      res.json(e);
    }
  }

  async like(req, res) {
    try {
      const { tweet_id } = req.params;
      const user_id = req.user.id;
      const tweet = await Tweet.findById(tweet_id);
      const user = await User.findById(user_id);

      const condition = user.liked.includes(tweet_id);

      if (condition) {
        const tweet_index = user.liked.indexOf(tweet_id);
        const user_index = tweet.likedBy.indexOf(user_id);
        user.liked.splice(tweet_index, 1);
        tweet.likedBy.splice(user_index, 1);
        tweet.likes = tweet.likes - 1;
      } else if (condition == false) {
        tweet.likedBy.push(user_id);
        tweet.likes = tweet.likes + 1;
        user.liked.push(tweet_id);
      }

      tweet.save();
      user.save();

      res.status(200).json({ user, tweet });
    } catch (err) {
      res.status(400).json(err.message);
    }
  }

  async addComment(req, res) {
    try {
      const { target_tweet_id } = req.params;

      const target_tweet = await Tweet.findById(target_tweet_id);
      const user = await User.findById(req.user.id);

      const new_tweet_comment = await Tweet.create({
        author: user.id,
        content: req.body.content,
        commentTo: target_tweet.author,
      });

      user.replies.push(new_tweet_comment.id);
      user.save();

      target_tweet.comments.push(new_tweet_comment.id);
      target_tweet.save();
      res.status(200).json({ target_tweet, user, new_tweet_comment });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }
}

export default new TweetController();
