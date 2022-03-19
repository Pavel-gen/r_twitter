import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ListTweet from "../ListTweet/ListTweet";
import Loading from "../Loading/Loading";

const TweetPage = () => {
  let { id } = useParams();
  const [posts, setPosts] = useState([]);
  console.log(id);
  const url = `http://localhost:4000/api/posts/thread/${id}`;

  useEffect(async () => {
    const tweets = await fetch(url);
    const result = await tweets.json();
    setPosts(result);
  }, []);
  if (posts.thread) {
    return (
      <>
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

export default TweetPage;
