import React, { useState, useEffect } from "react";
import ListTweet from "../ListTweet/ListTweet";
import Profile from "../Profile/Profile";
import { useSelector, useDispatch } from "react-redux";
import { update } from "../../fearutures/postSlice";
import ToolBar from "../ToolBar/ToolBar";
import Model from "../Model/Model";
import TweetToolBar from "./TweetToolBar/TweetToolBar";
import Loading from "../Loading/Loading";
import { useParams } from "react-router-dom";
import { MiddlewareArray } from "@reduxjs/toolkit";
import axios from "axios";

const getPosts = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <p>Пользователь не авторизован</p>;
  }
  const old_url = "http://localhost:4000/api/posts";
  const new_url = `http://localhost:4000/api/tweets/spec/${id}`;
  const posts = await fetch(new_url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + String(token),
    },
  });
  let result = await posts.json();
  console.log(result);

  result.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  return result;
};
/*
export const getUser = async () => {
  try {
    const new_url = window.location.href;
    console.log(new_url);
    const index = new_url.indexOf("profile/") + 8;
    const new_id = new_url.slice(index, index + 24);

    const user_id = localStorage.getItem("user_id");
    const url = `http://localhost:4000/api/users/${new_id}`;
    const user = await fetch(url);
    let result = await user.json();
    return result;
  } catch (e) {
    console.log(e);
  }
};
*/

const getUserId = () => {
  const new_url = window.location.href;
  console.log(new_url);
  const index = new_url.indexOf("profile/") + 8;
  return new_url.slice(index, index + 24);
};

const getUserLikes = async () => {
  try {
    const new_id = getUserId();

    const user_id = localStorage.getItem("user_id");
    const url = `http://localhost:4000/api/users/${new_id}/likes`;
    const user = await fetch(url);
    let result = await user.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};

const getUserReplies = async () => {
  try {
    let user_id = getUserId();
    const url = `http://localhost:4000/api/users/${user_id}/replies`;

    let req = await axios.get(url);

    console.log("-------------------------");
    console.log(req.data);
    console.log("-----------------------");

    let f_replies = [];
    req.data.map((item) => {
      item.commentTo.threadId = null;
      f_replies.push(item.commentTo);
      item.threadId = item.commentTo._id;
      item.commentTo = item.commentTo._id;

      f_replies.push(item);
    });

    return f_replies.reverse();
  } catch (err) {
    console.log(err);
  }
};

const getUserMedia = async () => {
  try {
    const user_id = getUserId();
    const url = `http://localhost:4000/api/users/${user_id}/media`;

    const req = await axios.get(url);

    return req.data;
  } catch (err) {
    console.log({ message: err.message });
  }
};

const User = ({ type }) => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [likes, setLikes] = useState([]);
  const [replies, setReplies] = useState([]);
  const [media, setMedia] = useState([]);
  const dispatch = useDispatch();
  const added_post = useSelector((state) => state.first_blood.added_post);
  const updated_post = useSelector((state) => state.first_blood.updated_post);
  const updated_user = useSelector((state) => state.user_moves.updated_user);

  useEffect(async () => {
    if (type === "likes") {
      const likes = await getUserLikes();
      console.log(likes);
      //   likes.map((like) => (like.commentTo = null));
      if (likes) {
        setLikes(likes.reverse());
      }

      console.log(likes);
    }

    if (type == "replies") {
      const get_replies = await getUserReplies();

      setReplies(get_replies);
    }
    if (type == "media") {
      const get_media = await getUserMedia();

      setMedia(get_media);
    }
  }, [document.location.href]);

  const { id } = useParams();
  const user_id = localStorage.getItem("user_id");

  useEffect(async () => {
    const url = `http://localhost:4000/api/users/${id}`;
    const user = await fetch(url);
    const current_user = await user.json();

    let data = await getPosts(id);

    if (data.length == 0) {
      setUser(current_user);
      setPosts([]);
    }

    if (data && data.length > 0) {
      // data = data.filter((post) => post.author._id == id);
      //data.map((post) => {
      //  console.log(post.author.username, " : ", post.content);
      //});
      setUser(current_user);
      const tweets = data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setPosts(tweets);
    }
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (updated_user) {
      setUser(updated_user.payload);
    }
  }, [updated_user]);

  useEffect(() => {
    if (added_post && id == user_id && !added_post.payload.commentTo) {
      const pre_post = { ...added_post.payload };
      let new_post = JSON.parse(JSON.stringify(pre_post));
      const lol = [new_post].concat(posts);
      setPosts(lol);
      console.log(lol);
    }

    if (added_post && added_post.payload.commentTo && id == user_id) {
      const pre_post = { ...added_post.payload };
      let new_post = JSON.parse(JSON.stringify(pre_post));

      let ch_posts = [new_post].concat(posts);

      console.log(ch_posts);
      setPosts(
        ch_posts.map((post) => {
          console.log(post);

          let condition;
          if (post.isRetweet) {
            condition = new_post.commentTo == post.target_tweet;
          } else {
            condition = new_post.commentTo == post._id;
          }

          if (condition) {
            post.comments = post.comments.concat([new_post._id]);
          }
          return post;
        })
      );
    }

    if (added_post && added_post.payload.commentTo && id !== user_id) {
      const pre_post = { ...added_post.payload };
      let new_post = JSON.parse(JSON.stringify(pre_post));

      let ch_posts = posts;

      console.log(ch_posts);
      setPosts(
        ch_posts.map((post) => {
          console.log(post);

          let condition;
          if (post.isRetweet) {
            condition = new_post.commentTo == post.target_tweet;
          } else {
            condition = new_post.commentTo == post._id;
          }

          if (condition) {
            post.comments = post.comments.concat([new_post._id]);
          }
          return post;
        })
      );
    }
  }, [added_post]);

  useEffect(() => {
    if (updated_post) {
      console.log(updated_post.payload);
      const lol = posts.map((post) => {
        if (post._id == updated_post.payload._id) {
          console.log("founded");
          return updated_post.payload;
        }
        return post;
      });
      setPosts(lol);
    }
  }, [updated_post]);

  const id_check = useSelector((state) => state.first_blood.deleted_id);

  useEffect(() => {
    if (id_check !== null) {
      let id = id_check.payload;
      console.log(id);
      if (posts) {
        setPosts(posts.filter((post) => post._id != id));
      }
    }
  }, [id_check]);

  if (type == "likes" && user && likes) {
    return (
      <div>
        <ToolBar />
        <Profile user={user} />
        <div className="list_tweets">
          <TweetToolBar user={user} type={type} />
        </div>
        <ListTweet posts={likes} user={"-"} protocol="likes" />
      </div>
    );
  } else if (type == "tweets" && user && posts) {
    return (
      <div>
        <ToolBar />
        <Profile user={user} />
        <div className="list_tweets">
          <TweetToolBar user={user} type={type} />
        </div>
        <ListTweet protocol={"profile_tweets"} posts={posts} user={user} />
      </div>
    );
  } else if (type == "replies" && user && replies) {
    return (
      <div>
        <ToolBar />
        <Profile user={user} />
        <div className="list_tweets">
          <TweetToolBar user={user} type={type} />
        </div>
        <ListTweet protocol={"replies"} posts={replies} user={user} />
      </div>
    );
  } else if (type == "media" && user && media) {
    return (
      <div>
        <ToolBar />
        <Profile user={user} />
        <div className="list_tweets">
          <TweetToolBar user={user} type={type} />
        </div>
        <ListTweet protocol={"replies"} posts={media} user={user} />
      </div>
    );
  } else if (user) {
    return (
      <>
        <div>
          <ToolBar />
          <Profile user={user} />
          <div className="list_tweets">
            <TweetToolBar user={user} type={type} />
            <Loading />
          </div>
        </div>
        )
      </>
    );
  } else {
    return (
      <>
        <ToolBar />
        <Loading />
      </>
    );
  }
};

export default User;
