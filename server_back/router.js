import Router from "express";
import TweetController from "./controllers/TweetController.js";
import UserController from "./controllers/UserController.js";
import { check } from "express-validator";
import authMiddleware from "./middleware/authMiddleware.js";
import uploadingImg from "./middleware/imgUploading.js";
import ReTweetController from "./controllers/ReTweetController.js";
import Tweet from "./models/Tweet.js";
import { postImges } from "./middleware/imgUploading.js";

const router = Router();

router.post(
  "/posts",
  check("content", "Content не может быть пустым").notEmpty(),
  authMiddleware,
  postImges,
  TweetController.create
);
router.get("/posts", authMiddleware, TweetController.getAll);
router.get("/posts/:id", TweetController.getOne);

router.get(
  "/tweets/spec/:user_id",
  authMiddleware,
  TweetController.getUserPosts
);

router.get("/tweets/line", authMiddleware, TweetController.getUserLine);

//router.get("/posts/thread/:id", TweetController.getCurrentThread);
router.get("/posts/coms/:id", TweetController.getComments);
router.put("/posts/:id", TweetController.update);
router.delete("/posts/:id", TweetController.delete);
router.put("/posts/:tweet_id/likes", authMiddleware, TweetController.like);
router.post(
  "/posts/:target_tweet_id",
  authMiddleware,
  postImges,

  TweetController.addComment
);
router.post(
  "/posts/retweet/:tweet_id",
  authMiddleware,
  ReTweetController.create
);

router.get(
  "/posts/retweet/:tweet_id",
  authMiddleware,
  ReTweetController.getRetweets
);
router.delete(
  "/posts/retweet/:retweet_id",
  authMiddleware,
  ReTweetController.delete
);

router.get("/posts/thread/:id", TweetController.getCurrentThread);

router.post(
  "/users/registration",
  uploadingImg,
  check("username", "Имя полтьзователя не может быть пустым").notEmpty(),
  check("password", "Пороль должен быть длиннее 4").isLength({ min: 4 }),
  UserController.registration
);
router.put("/users/edit/:id", uploadingImg, UserController.updateUser);
router.post("/users/login", UserController.login);
router.get("/users", UserController.getUsers);
router.get("/users/:id", UserController.getUser);
router.get("/users/:id/followers", UserController.getFollowers);
router.put("/users/:id", authMiddleware, UserController.follow);
router.get("/users/:id/likes", UserController.getUserLikes);
router.get("/users/:id/replies", UserController.getReplies);
router.get("/users/:id/media", UserController.getUserMedia);

router.delete("/delete_all", TweetController.deleteAll);

export default router;
