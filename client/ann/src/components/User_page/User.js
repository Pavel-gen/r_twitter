import React, { useState, useEffect } from "react";
import ListTweet from "../ListTweet/ListTweet";
import Profile from "../Profile/Profile";
import { useSelector, useDispatch } from "react-redux";
import { update } from "../../fearutures/postSlice";
import ToolBar from "../ToolBar/ToolBar";
import Model from "../Model/Model";
import TweetToolBar from "./TweetToolBar/TweetToolBar";
import Loading from "../Loading/Loading";

const getPosts = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <p>Пользователь не авторизован</p>;
  }
  const posts = await fetch("http://localhost:4000/api/posts", {
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

const getUserLikes = async () => {
  try {
    const new_url = window.location.href;
    console.log(new_url);
    const index = new_url.indexOf("profile/") + 8;
    const new_id = new_url.slice(index, index + 24);

    const user_id = localStorage.getItem("user_id");
    const url = `http://localhost:4000/api/users/${new_id}/likes`;
    const user = await fetch(url);
    let result = await user.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};

const User = ({ type }) => {
  const [posts, setPosts] = useState(null);
  const [user, setUser] = useState(null);
  const [likes, setLikes] = useState(null);
  const dispatch = useDispatch();
  const added_post = useSelector((state) => state.first_blood.added_post);
  const updated_post = useSelector((state) => state.first_blood.updated_post);
  const updated_user = useSelector((state) => state.user_moves.updated_user);

  useEffect(async () => {
    if (type === "likes") {
      const likes = await getUserLikes();
      likes.map((like) => (like.commentTo = null));
      if (likes) {
        setLikes(likes.reverse());
      }

      console.log(likes);
    }
  }, [document.location.href]);

  useEffect(async () => {
    const new_url = window.location.href;
    console.log(new_url);
    const index = new_url.indexOf("profile/") + 8;
    const new_id = new_url.slice(index, index + 24);

    const url = `http://localhost:4000/api/users/${new_id}`;
    const user = await fetch(url);
    const current_user = await user.json();

    const user_id = localStorage.getItem("user_id");
    console.log(user_id);
    let data = await getPosts();
    console.log(data);

    if (data.length == 0) {
      setUser(current_user);
      setPosts([]);
    }

    if (data && data.length > 0) {
      data = data.filter((post) => post.author._id == new_id);
      data.map((post) => {
        console.log(post.author.username, " : ", post.content);
      });
      setUser(current_user);
      const tweets = data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setPosts(tweets);
    }
  }, []);

  useEffect(() => {
    if (updated_user) {
      setUser(updated_user.payload);
    }
  }, [updated_user]);

  useEffect(() => {
    if (added_post) {
      const new_post = added_post.payload;
      const lol = [new_post].concat(posts);
      setPosts(lol);
      console.log(lol);
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
      setPosts(posts.filter((post) => post._id != id));
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
        <ListTweet posts={likes} user={"-"} />
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
        <ListTweet
          posts={type == "likes" ? likes : posts}
          user={type == "likes" ? "-" : user}
        />
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
