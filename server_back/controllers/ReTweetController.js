import ReTweet from "../models/ReTweet.js";
import Tweet from "../models/Tweet.js";

class ReTweetContropller {
  async create(req, res) {
    try {
      const { tweet_id } = req.params;
      const retweet = await ReTweet.create({
        author: req.user.id,
        tweet: tweet_id,
      });
      const base_tweet = await Tweet.findById(tweet_id);
      if (!base_tweet.retweetedBy.includes(req.user.id)) {
        base_tweet.retweetedBy.push(req.user.id);
        base_tweet.save();
      }

      res.status(200).json({ retweet, base_tweet });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }

  async getRetweets(req, res) {
    try {
      const { tweet_id } = req.params;
      const retweets = await ReTweet.find({ tweet: tweet_id });
      res.status(200).json({ retweets });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }

  async delete(req, res) {
    try {
      const { retweet_id } = req.params;
      const deleted = await ReTweet.findByIdAndDelete(retweet_id);

      if (deleted) {
        const retweets = await ReTweet.find({
          tweet: deleted.tweet,
          author: deleted.author,
        });

        if (retweets.length == 0) {
          const base_tweet = await Tweet.findById(deleted.tweet);
          const user_index = base_tweet.retweetedBy.indexOf(req.user.id);
          base_tweet.retweetedBy.splice(user_index, 1);
          base_tweet.save();
        }
      }

      res.status(200).json({
        message: "retweet was deleted",
        deleted,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }
}

export default new ReTweetContropller();
