import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ListTweet from "../ListTweet/ListTweet";
import Loading from "../Loading/Loading";
import "../ListTweet/ListTweet.css";
import BackButton from "../BackButton/BackButton";

const ThreadPage = () => {
  let { id } = useParams();
  const [posts, setPosts] = useState([]);
  console.log(id);
  const url = `http://localhost:4000/api/posts/thread/${id}`;
  const navigate = useNavigate();

  useEffect(async () => {
    const tweets = await fetch(url);
    const result = await tweets.json();
    setPosts(result);
  }, []);
  if (posts.thread) {
    return (
      <>
        <div className="list_tweets">
          <BackButton content={"Thread"} />
        </div>
        <ListTweet posts={posts.thread} protocol="thread" />
      </>
    );
  } else {
    return (
      <>
        <Loading />
      </>
    );
  }
};

export default ThreadPage;
