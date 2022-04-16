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

const getUserLikes = async (skip_likes) => {
  try {
    const new_id = getUserId();
    let limit = 10;
    const user_id = localStorage.getItem("user_id");
    const url = `http://localhost:4000/api/users/${new_id}/likes?skip_likes=${skip_likes}&limit=${limit}`;
    const user = await axios.get(url);
    console.log(user);
    return user.data;
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

const getUserMedia = async (skip_media) => {
  try {
    let limit = 5;
    const user_id = getUserId();
    const url = `http://localhost:4000/api/users/${user_id}/media?limit=${limit}&skip_media=${skip_media}`;

    const req = await axios.get(url);
    console.log(req);

    return req.data;
  } catch (err) {
    console.log({ message: err.message });
  }
};

const getPosts = async (id, skipRe, skipTw) => {
  try {
    let limit = 10;
    const token = localStorage.getItem("token");
    if (!token) {
      return <p>Пользователь не авторизован</p>;
    }
    const old_url = "http://localhost:4000/api/posts";
    const new_url = `http://localhost:4000/api/tweets/spec/${id}?skip_Re=${skipRe}&skip_Tw=${skipTw}&limit=${limit}`;

    const req = await axios.get(new_url, {
      headers: { Authorization: "Bearer " + token },
    });
    console.log(req.data);

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
  const [skipLikes, setSkipLikes] = useState(0);
  const [skipReplies, setSkipReplies] = useState(0);
  const [skipMedia, setSkipMedia] = useState(0);
  const [exLoading, setExLoading] = useState(false);

  const [skipTw, setSkipTw] = useState(0);
  const [skipRe, setSkipRe] = useState(0);

  const dispatch = useDispatch();
  const added_post = useSelector((state) => state.first_blood.added_post);
  const updated_post = useSelector((state) => state.first_blood.updated_post);
  const updated_user = useSelector((state) => state.user_moves.updated_user);

  const recycle = (result) => {
    let item = document.querySelector(".marker");

    if (result.length !== 0) {
      item.classList.remove("hide_last_el");
    } else {
      item.classList.remove("marker");
      item.classList.remove("hide_last_el");
    }

    setExLoading(false);
  };

  useEffect(async () => {
    let item = document.getElementById("last_div");
    if (item) {
      item.classList.add("marker");
    }

    if (type === "likes") {
      const req = await getUserLikes(skipLikes);
      console.log(req);
      setLikes(req.result);
      setSkipLikes(req.skip_likes);
    }

    if (type == "replies") {
      const get_replies = await getUserReplies();

      setReplies(get_replies);
    }
    if (type == "media" && media.length == 0) {
      const req = await getUserMedia(skipMedia);
      console.log(req);
      setMedia(req.result);
      setSkipMedia(req.skip_media);
    }
  }, [document.location.href]);

  useEffect(async () => {
    if (exLoading) {
      if (type == "tweets") {
        let req = await getPosts(id, skipRe, skipTw);
        console.log(req);
        setSkipRe(req.skip_Re);
        setSkipTw(req.skip_Tw);
        setPosts(posts.concat(req.result));
        recycle(req.result);
      }
      if (type == "media") {
        const req = await getUserMedia(skipMedia);

        setMedia(media.concat(req.result));
        setSkipMedia(req.skip_media);
        recycle(req.result);
      }
      if (type == "likes") {
        const req = await getUserLikes(skipLikes);
        setLikes(likes.concat(req.result));
        setSkipLikes(req.skip_likes);
        recycle(req.result);
      }
    }
  }, [exLoading]);

  const { id } = useParams();
  const user_id = localStorage.getItem("user_id");

  useEffect(async () => {
    const url = `http://localhost:4000/api/users/${id}`;
    const user = await axios.get(url);
    const current_user = user.data;

    let data = await getPosts(id, skipRe, skipTw);
    setSkipRe(data.skip_Re);
    setSkipTw(data.skip_Tw);
    if (data.result.length == 0) {
      setUser(current_user);
      setPosts([]);
    }

    if (data.result && data.result.length > 0) {
      setUser(current_user);
      setPosts(data.result);
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

  window.addEventListener("scroll", () => {
    let item = document.querySelector(".marker");
    let path = 0;
    if (item) {
      path = item.getBoundingClientRect().bottom;
    }
    // console.log(window.innerHeight);
    if (Math.round(path / 10) == Math.round(window.innerHeight / 10)) {
      setExLoading(!exLoading);
      console.log("lllllllllllllllllllllllllllllllllllll");
      item.classList.add("hide_last_el");

      //   console.log(document.body.getBoundingClientRect().top);
    }
  });

  if (type == "likes" && user && likes) {
    return (
      <div>
        <ToolBar />
        <Profile user={user} />
        <div className="list_tweets">
          <TweetToolBar user={user} type={type} />
        </div>
        <ListTweet posts={likes} user={"-"} protocol="likes" />
        {exLoading && <Loading />}
        <div className="marker last_div" id="last_div"></div>
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
        {exLoading && <Loading />}
        <div className="marker last_div" id="last_div"></div>
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
        {exLoading && <Loading />}
        <div className="marker last_div" id="last_div"></div>
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
        <ListTweet protocol={"media"} posts={media} user={user} />
        {exLoading && <Loading />}
        <div className="marker last_div" id="last_div"></div>
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
