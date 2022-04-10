import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
import multer from "multer";
import Tweet from "../models/Tweet.js";

///import no_avatar from '../static/default-avatar.png'
dotenv.config();

const secret = process.env.secret;

const generateToken = (id, username) => {
  const payload = {
    id,
    username,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class UserController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при регистрации", errors });
      }
      const { username, email, password, bio } = req.body;

      const oldusers = await User.find({
        $or: [{ username: username }, { email: email }],
      });
      if (oldusers.length > 1) {
        return res.status(400).json("change email and username");
      } else {
        oldusers.map((olduser) => {
          if (olduser) {
            if (olduser.username == username && olduser.email == email) {
              return res.status(400).json("change email and username");
            }
            if (olduser.username !== username && olduser.email == email) {
              return res.status(401).json("change email");
            }
            if (olduser.username == username && olduser.email !== email) {
              return res.status(402).json("change username");
            }
          }
        });
      }

      let avatar = req.files["avatar"];
      if (avatar === undefined) {
        avatar = "static\\default-avatar.png";
      } else {
        avatar = req.files["avatar"][0].path;
      }

      let backimg = req.files["backimg"];
      if (backimg === undefined) {
        backimg = undefined;
      } else {
        backimg = req.files["backimg"][0].path;
      }

      const hashedPassword = bcrypt.hashSync(password, 8);

      const body = {
        username: username,
        email: email,
        password: hashedPassword,
        bio: bio,
        avatar: avatar,
        backimg: backimg,
      };

      const user = await User.create(body);

      return res.status(200).json([user, req.files]);
    } catch (e) {
      res.json({ message: e.message });
    }
  }

  async login(req, res) {
    try {
      const { username, email, password } = req.body;
      const candidate = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });
      if (!candidate) {
        return res.status(401).json({ message: "User is not found" });
      }
      const passwordValidation = await bcrypt.compare(
        password,
        candidate.password
      );
      console.log(passwordValidation);
      if (!passwordValidation) {
        return res.status(402).json({ message: "Invalid password" });
      }
      const id = candidate._id;
      const token = generateToken(candidate._id, candidate.username);
      return res.status(200).json([{ token, id }]);
    } catch (e) {
      console.log(e.message);
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      res.status(200).json(user);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async getUserLikes(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id).populate([
        {
          path: "liked",
          model: "Tweet",
          populate: {
            model: "User",
            path: "author",
          },
        },
      ]);
      res.status(200).json(user.liked);
    } catch (err) {
      console.log(err);
    }
  }

  async getFollowers(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id)
        .populate("followers")
        .populate("following");
      res.status(200).json(user);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, bio } = req.body;

      const oldusers = await User.find({ username: username });
      //console.log(oldusers)
      //if (oldusers.length > 0){
      //    return res.status(400).json('this username is already taken')
      //}

      let avatar = req.files["avatar"];
      if (avatar === undefined) {
        avatar = undefined;
      } else {
        avatar = req.files["avatar"][0].path;
      }

      let backimg = req.files["backimg"];
      if (backimg === undefined) {
        backimg = undefined;
      } else {
        backimg = req.files["backimg"][0].path;
      }

      const editedUser = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            username: username,
            bio: bio,
            avatar: avatar,
            backimg: backimg,
          },
        },
        { new: true }
      );

      res.status(200).json(editedUser);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async follow(req, res) {
    try {
      const { id } = req.params;
      const actual_user = await User.findById(req.user.id);
      const target_user = await User.findById(id);
      const condition = actual_user.following.includes(id);

      if (condition) {
        let index_act = actual_user.following.indexOf(id);
        let index_tar = target_user.followers.indexOf(req.user.id);
        actual_user.following.splice(index_act, 1);
        target_user.followers.splice(index_tar, 1);
      } else {
        actual_user.following.push(id);
        target_user.followers.push(actual_user.id);
      }

      actual_user.save();
      target_user.save();
      res.status(200).json([actual_user, target_user]);
    } catch (e) {
      res.status(200).json(e.message);
    }
  }

  async getReplies(req, res) {
    try {
      let user_id = req.params.id;

      const replies = await Tweet.find({
        author: user_id,
        commentTo: { $ne: null },
        threadId: null,
      }).populate([
        {
          path: "commentTo",
          model: "Tweet",
          populate: {
            path: "author",
            model: "User",
          },
        },
      ]);

      res.status(200).json(replies);
    } catch (err) {
      console.log({ message: err.message });
      res.status(400).json({ message: err.message });
    }
  }

  async getUserMedia(req, res) {
    try {
      let user_id = req.params.id;
      const media = await Tweet.find({
        author: user_id,
        media: {
          $ne: [],
        },
      });

      res.status(200).json(media);
    } catch (err) {
      console.log({ message: err.message });
      res.status(400).json({ message: err.message });
    }
  }
}

export default new UserController();
