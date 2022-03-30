import React, { useState, useEffect } from "react";
import ListTweet from "../ListTweet/ListTweet";
import Profile from "../Profile/Profile";
import { useSelector, useDispatch } from "react-redux";
import { update } from "../../fearutures/postSlice";
import ToolBar from "../ToolBar/ToolBar";
import Model from "../Model/Model";
import Loading from "../Loading/Loading";

export const getPosts = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <p>Пользователь не авторизован</p>;
  }
  const posts = await fetch("http://localhost:4000/api/tweets/line", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + String(token),
    },
  });
  let result = await posts.json();

  result.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  return result;
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

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const added_post = useSelector((state) => state.first_blood.added_post);
  const updated_post = useSelector((state) => state.first_blood.updated_post);

  useEffect(async () => {
    const lol = await getPosts();
    setPosts(lol);
    setLoading(false);
  }, []);

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
      </>
    );
  }
};

export default Home;
