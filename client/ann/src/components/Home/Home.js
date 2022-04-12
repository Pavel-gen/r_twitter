import React, { useState, useEffect } from "react";
import ListTweet from "../ListTweet/ListTweet";
import Profile from "../Profile/Profile";
import { useSelector, useDispatch } from "react-redux";
import { update } from "../../fearutures/postSlice";
import ToolBar from "../ToolBar/ToolBar";
import Model from "../Model/Model";
import Loading from "../Loading/Loading";
import "./Home.css";
import { current } from "@reduxjs/toolkit";
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

const Home = ({ type }) => {
  const [posts, setPosts] = useState([]);
  const [pg, setPg] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastId, setLastId] = useState(null);

  const dispatch = useDispatch();
  const added_post = useSelector((state) => state.first_blood.added_post);
  const updated_post = useSelector((state) => state.first_blood.updated_post);

  useEffect(async () => {
    if (!type) {
      const lol = await getPosts(pg);
      setPosts(lol);
      setLoading(false);
    } else {
      let result = await getGlobalLine();
      console.log(result);
      setPosts(result);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  useEffect(async () => {
    try {
      if (!type) {
        const next_posts = await getPosts(pg);
        if (next_posts.length > 0) {
          setPosts(posts.concat(next_posts));
        }
      }
    } catch (err) {
      console.log({ message: err.message });
    }
  }, [pg]);

  window.addEventListener("scroll", () => {
    let item = document.getElementById("last_div");
    let path = 0;
    if (item) {
      path = item.getBoundingClientRect().bottom;
    }

    //    console.log(window.scrollY);
    if (path < window.screen.height && false) {
      console.log("here dsdddddddddddddddddddddddddddddddddddddddddddddddddd");

      setTimeout(() => {
        setPg(pg + 1);
      }, 500);
    }
    //   console.log(document.body.getBoundingClientRect().top);
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
        <ListTweet posts={posts} user={"-"} protocol="base" />
        {/* <div className="last_div" id="last_div"></div> */}
      </>
    );
  }
};

export default Home;
