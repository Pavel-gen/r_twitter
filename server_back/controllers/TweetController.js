import Tweet from "../models/Tweet.js";
import User from "../models/User.js";
import ReTweet from "../models/ReTweet.js";

const convertReToTw = (arr) => {
  const result = arr.map((item) => {
    let thing = new Object();

    thing.content = item.tweet.content;
    thing.author = item.tweet.author;
    thing.createdAt = item.createdAt;
    thing._id = item._id;
    thing.target_tweet = item.tweet._id;
    thing.likes = item.tweet.likes;
    thing.likedBy = item.tweet.likedBy;
    thing.comments = item.tweet.comments;
    thing.commentTo = item.tweet.commentTo;
    thing.threadId = item.tweet.threadId;
    thing.retweetedBy = item.tweet.retweetedBy;
    thing.isRetweet = true;
    thing.retweet_auth = item.author;
    thing.media = item.tweet.media;
    return thing;
  });
  return result;
};

const byField = (field) => {
  return (a, b) => (a[field] > b[field] ? 1 : -1);
};

class TweetController {
  async create(req, res) {
    try {
      console.log(req);
      let media;

      console.log(req.files);

      if (req.files && req.files["media"]) {
        media = req.files["media"].map((item) => {
          return item.path;
        });
      }

      const tweet = await Tweet.create({
        author: req.user.id,
        content: req.body.content,
        media,
      });
      return res.status(200).json(tweet);
    } catch (e) {
      console.log(e);
    }
  }

  //this function should return current thread by id
  // so now we have base id and according to it we should get the full thread. right now i thinking how to implement it. hmmm good question dont ypu think

  async getCurrentThread(req, res) {
    try {
      const { id } = req.params;
      const tweet = await Tweet.findById(id);
      const thread = await Tweet.find({
        $or: [{ threadId: tweet.threadId }, { _id: tweet.threadId }],
      })
        .sort("createdAt")
        .populate("author");
      res.status(200).json({ tweet, thread });
    } catch (err) {
      console.log(err);
    }
  }

  async getUserPosts(req, res) {
    try {
      const { user_id } = req.params;
      console.log(user_id);

      let posts = await Tweet.find({ author: user_id }).populate("author");
      let retweets = await ReTweet.find({
        author: user_id,
      }).populate({
        path: "tweet",
        model: "Tweet",
        populate: {
          path: "author",
          model: "User",
        },
      });
      const mod_retweet = convertReToTw(retweets);

      {
        /*
      const mod_retweet = retweets.map((item) => {
        let thing = new Object();

        thing.content = item.tweet.content;
        thing.author = item.tweet.author;
        thing.createdAt = item.createdAt;
        thing._id = item._id;
        thing.target_tweet = item.tweet._id;
        thing.likes = item.tweet.likes;
        thing.likedBy = item.tweet.likedBy;
        thing.comments = item.tweet.comments;
        thing.commentTo = item.tweet.commentTo;
        thing.threadId = item.tweet.threadId;
        thing.retweetedBy = item.tweet.retweetedBy;
        thing.isRetweet = true;
        thing.retweet_auth = item.author;
        return thing;
      });
*/
      }

      const result = posts.concat(mod_retweet).sort(byField("createdAt"));

      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: err.message });
    }
  }

  async deleteAll(req, res) {
    try {
      const delete_tweets = await Tweet.deleteMany();
      // const delete_users = await User.deleteMany();
      const delete_retweets = await ReTweet.deleteMany();
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
      const post = await Tweet.findById(id).populate("author");
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
      const tweet = await Tweet.findById(id);
      if (tweet.commentTo) {
        let target_tweet = await Tweet.findById(tweet.commentTo);
        target_tweet.comments = target_tweet.comments.filter((item) => {
          item !== tweet._id;
          console.log(item, tweet._id);
        });

        target_tweet.save();
      }

      const retweets = await ReTweet.deleteMany({ tweet: id });
      const deleted = await Tweet.findByIdAndDelete(id);

      res.status(200).json({ message: "deleted" }, target_tweet);
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

      let media;

      console.log(req.files);

      if (req.files && req.files["media"]) {
        media = req.files["media"].map((item) => {
          return item.path;
        });
      }

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
        media,
      });
      target_tweet.comments.push(new_tweet_comment._id);

      target_tweet.save();

      res.status(200).json({ new_tweet_comment });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }
  async getComments(req, res) {
    try {
      const tweet_id = req.params.id;

      const comments = await Tweet.find({
        commentTo: tweet_id,
      }).populate("author");

      res.status(200).json(comments);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }

  async getUserLine(req, res) {
    try {
      const user_id = req.user.id;

      console.log(req.query.page);

      let skip = (req.query.page - 1) * 10;

      const page = req.query.page;
      const current_user = await User.findById(user_id);
      const following = [user_id].concat(current_user.following);
      const following_tweets = await Tweet.find({
        author: { $in: following },
      })
        .sort({ createdAt: 1 })
        .populate("author");

      {
        /*
      let following_retweets = await ReTweet.find({
        author: { $in: following },
      }).populate({
        path: "tweet",
        model: "Tweet",
        populate: {
          path: "author",
          model: "User",
        },
      });
      const result = following_tweets
        .concat(convertReToTw(following_retweets))
        ;
*/
      }
      res.status(200).json(following_tweets);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }

  /*
  async addRetweet(req, res) {
    try {
      const tweet_id = req.params.id;
      const user = await User.findById(req.user.id);
      const tweet = await Tweet.findById(tweet_id);

      if (!tweet.retweetedBy.includes(req.user.id)) {
        tweet.retweetedBy.push(user._id);
        user.retweets.push(tweet_id);
      } else {
        const tweet_index = user.retweets.indexOf(tweet_id);
        const user_index = tweet.retweetedBy.indexOf(user.id);
        user.retweets.splice(tweet_index, 1);
        tweet.retweetedBy.splice(user_index, 1);
      }
      tweet.save();
      user.save();

      res.status(200).json({ user, tweet });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }
*/
}

export default new TweetController();
