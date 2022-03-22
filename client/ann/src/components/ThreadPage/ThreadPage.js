import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ListTweet from "../ListTweet/ListTweet";
import Loading from "../Loading/Loading";
import "../ListTweet/ListTweet.css";
import BackButton from "../BackButton/BackButton";

const ThreadPage = () => {
  let { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [coms, setComs] = useState([]);
  //  console.log(id);

  const url = `http://localhost:4000/api/posts/thread/${id}`;
  const navigate = useNavigate();

  useEffect(async () => {
    const tweets = await fetch(url);
    const result = await tweets.json();
    setPosts(result);
  }, []);

  useEffect(async () => {
    if (posts.thread) {
      console.log(posts.thread);
      const base_tweet = posts.thread.filter((item) => item.commentTo == null);
      console.log(base_tweet);
      const url_coms = `http://localhost:4000/api/posts/coms/${base_tweet[0]._id}`;
      const request = await fetch(url_coms);
      const final_req = await request.json();

      setComs(final_req.filter((item) => item.threadId == null));
    }
  }, [posts]);

  if (posts.thread && coms) {
    console.log(coms);
    return (
      <>
        <div className="list_tweets">
          <BackButton content={"Thread"} />
        </div>
        <ListTweet posts={posts.thread} protocol="thread" />
        <div className="list_tweets ">
          <div className="com_p">
            <p>Comments:</p>
          </div>
        </div>
        <ListTweet posts={coms} protocol="likes" />
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
