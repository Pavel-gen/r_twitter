import Router from "express";
import TweetController from "./controllers/TweetController.js";
import UserController from "./controllers/UserController.js";
import { check } from "express-validator";
import authMiddleware from "./middleware/authMiddleware.js";
import uploadingImg from "./middleware/imgUploading.js";

const router = Router();

router.post(
  "/posts",
  check("content", "Content не может быть пустым").notEmpty(),
  authMiddleware,
  TweetController.create
);
router.get("/posts", authMiddleware, TweetController.getAll);
router.get("/posts/:id", TweetController.getOne);
//router.get("/posts/thread/:id", TweetController.getCurrentThread);
router.get("/posts/coms/:id", TweetController.getComments);
router.put("/posts/:id", TweetController.update);
router.delete("/posts/:id", TweetController.delete);
router.put("/posts/:tweet_id/likes", authMiddleware, TweetController.like);
router.post(
  "/posts/:target_tweet_id",
  authMiddleware,
  TweetController.addComment
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

router.delete("/delete_all", TweetController.deleteAll);

export default router;
