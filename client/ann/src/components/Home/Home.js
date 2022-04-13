import React, { useState, useEffect } from "react";
import ListTweet from "../ListTweet/ListTweet";
import Profile from "../Profile/Profile";
import { useSelector, useDispatch } from "react-redux";
import { update } from "../../fearutures/postSlice";
import ToolBar from "../ToolBar/ToolBar";
import Model from "../Model/Model";
import Loading from "../Loading/Loading";
import "./Home.css";
import { current, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";

export const getPosts = async (pg) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <p>Пользователь не авторизован</p>;
  }
  const posts = await fetch(
    `http://localhost:4000/api/tweets/line?page=${pg}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
  let result = await posts.json();

  result.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  return result;
};

const getGlobalLine = async () => {
  try {
    let url = `http://localhost:4000/api/gLine`;

    const tweets = await axios.get(url);
    return tweets.data;
  } catch (err) {
    console.log(err.message);
  }
};

const getUser = async () => {
  try {
    const user_id = localStorage.getItem("user_id");
    const url = `http://localhost:4000/api/users/${user_id}`;
    const user = await fetch(url);
    let result = await user.json();
    return result;
  } catch (e) {
    console.log(e);
  }
};

const getPagLine = async (skipTw, skipRe) => {
  try {
    console.log(skipTw);
    const limit = 5;
    const token = localStorage.getItem("token");
    const url = `http://localhost:4000/api/test/posts?limit=${limit}&skip_tw=${skipTw}&skip_re=${skipRe}`;

    const postLine = await axios.get(url, {
      headers: { Authorization: "Bearer " + token },
    });

    return postLine.data;
  } catch (err) {
    console.log({ message: err.message });
  }
};

const Home = ({ type }) => {
  console.log(type);
  const [posts, setPosts] = useState([]);
  const [addedPosts, setAddedPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastId, setLastId] = useState(null);
  const [skipTw, setSkipTw] = useState(0);
  const [skipRe, setSkipRe] = useState(0);
  const [exLoading, setExLoading] = useState(false);

  const dispatch = useDispatch();
  const added_post = useSelector((state) => state.first_blood.added_post);
  const updated_post = useSelector((state) => state.first_blood.updated_post);

  useEffect(async () => {
    if (type == "home") {
      const lol = await getPagLine(skipTw, skipRe);
      console.log(lol);
      setSkipTw(lol.skip_tw);
      setSkipRe(lol.skip_re);
      setPosts(lol.result);
      setLoading(false);
    } else {
      let result = await getGlobalLine();
      console.log(result);
      setPosts(result);
      setLoading(false);
    }
  }, []);

  useEffect(async () => {
    if (exLoading && type == "home") {
      moreTweetsHandler();
    }

    console.log("triggered");
  }, [exLoading]);

  const moreTweetsHandler = async () => {
    try {
      console.log("working");
      let morePosts = await getPagLine(skipTw, skipRe);
      setSkipTw(morePosts.skip_tw);
      setSkipRe(morePosts.skip_re);
      console.log(morePosts);

      console.log(morePosts.result.length);
      let item = document.querySelector(".marker");

      if (morePosts.result.length !== 0) {
        item.classList.remove("hide_last_el");
      } else {
        item.classList.remove("marker");
        item.classList.remove("hide_last_el");
      }

      setPosts(posts.concat(morePosts.result));
      setExLoading(false);
    } catch (err) {
      console.log({ message: err.message });
    }
  };

  window.addEventListener("scroll", () => {
    let item = document.querySelector(".marker");
    let path = 0;
    if (item) {
      path = item.getBoundingClientRect().bottom;
    }
    // console.log(window.innerHeight);

    if (Math.round(path) == window.innerHeight) {
      setExLoading(!exLoading);
      console.log("lldslsldsl");
      item.classList.add("hide_last_el");

      //   console.log(document.body.getBoundingClientRect().top);
    }
  });

  useEffect(() => {
    if (added_post) {
      const new_post = added_post.payload;
      const lol = [new_post].concat(posts);
      setPosts(lol);
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

  if (loading) {
    return (
      <div>
        <ToolBar />
        <Loading />
      </div>
    );
  } else {
    return (
      <>
        <ToolBar />
        <ListTweet posts={posts} user={"-"} protocol="profile_tweets" />
        {exLoading && <Loading />}

        {/* <button
          onClick={() => {
            moreTweetsHandler();
          }}
        >
          click to see more man
        </button>*/}
        <div className="marker last_div" id="last_div"></div>
      </>
    );
  }
};

export default Home;
