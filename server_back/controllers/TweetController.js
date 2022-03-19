import Tweet from "../models/Tweet.js";
import User from "../models/User.js";

class TweetController {
  async create(req, res) {
    try {
      const tweet = await Tweet.create({
        author: req.user.id,
        content: req.body.content,
      });
      return res.status(200).json(tweet);
    } catch (e) {
      console.log(e);
    }
  }

  //this function should return current thread by id
  // so now we have base id and according to it we should get the full thread. right now i thinking how to implement it. hmmm good question dont ypu think

  /* async getCurrentThread(req, res) {
    try {
      const { id } = req.params;
      const tweets = await Tweet.findById(id).populate("comments");
      res.status(200).send(id);
    } catch (err) {
      console.log(err);
    }
  }
  */

  async deleteAll(req, res) {
    try {
      const delete_twees = await Tweet.deleteMany();
      //   const delete_users = await User.deleteMany();
      res.status(228).json({ message: "all was deleted" });
    } catch (err) {
      console.log(err);
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
      console.log(target_tweet);
      const comments = await Tweet.find({
        commentTo: target_tweet_id,
        author: target_tweet.author,
      });
      let threadId;

      if (comments.length == 0 && target_tweet.author == req.user.id) {
        if (!target_tweet.threadId) {
          threadId = target_tweet_id;
        } else {
          threadId = target_tweet.threadId;
        }
      } else {
        threadId = null;
      }
      const new_tweet_comment = await Tweet.create({
        author: req.user.id,
        content: req.body.content,
        commentTo: target_tweet_id,
        threadId,
      });

      res.status(200).json({ comments, new_tweet_comment });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }
}

export default new TweetController();
