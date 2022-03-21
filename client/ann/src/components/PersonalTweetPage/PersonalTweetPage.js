import { current } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { choose_post } from "../../fearutures/postSlice";
import BackButton from "../BackButton/BackButton";
import ListTweet from "../ListTweet/ListTweet";
import Loading from "../Loading/Loading";
import Tweet from "../Tweet/Tweet";
import "../Tweet/Tweet.css";

const goBack = async (dispatch, id) => {
  console.log("i an jje");
  const url = `http://localhost:4000/tweets/${id}`;
  const prev_post = await fetch(url);
  const result = await prev_post.json();
  console.log(result);
  dispatch(choose_post(result));
  return result;
};

const PersonalTweetPage = () => {
  const [comments, setComments] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const choosen_post = useSelector((state) => state.first_blood.this_post);
  const dispatch = useDispatch();

  useEffect(async () => {
    setLoading(true);
    setCurrentPost(null);
  }, [document.location.href]);

  useEffect(async () => {
    const url = `http://localhost:4000/api/posts/coms/${id}`;
    const coms = await fetch(url);
    const result = await coms.json();
    setComments(result);
    setLoading(false);
  }, [document.location.href]);

  useEffect(async () => {
    if (choosen_post) {
      setCurrentPost(choosen_post.payload);
      localStorage.setItem(
        "current_post",
        JSON.stringify(choosen_post.payload)
      );
    } else {
      let post = localStorage.getItem("current_post");
      setCurrentPost(JSON.parse(post));
    }
  }, [choosen_post]);

  // console.log({ ...currentPost });

  //  console.log(comments);
  if (!currentPost) {
    return (
      <>
        <Loading />
      </>
    );
  }

  if (currentPost && loading) {
    return (
      <>
        <div className="list_tweets">
          <BackButton content={"Tweet"} post_id={currentPost.replyTo} />
          <div className="container_t">
            <Tweet {...currentPost} type="choosen_post" />
          </div>
          <Loading />
        </div>
      </>
    );
  }
  return (
    <>
      <div className="list_tweets">
        <BackButton content={"Tweet"} post_id={currentPost.commentTo} />
        <div className="container_t">
          <Tweet {...currentPost} type="choosen_post" />
        </div>
        <ListTweet posts={comments} protocol="choosen_post" />
      </div>
    </>
  );
};

export default PersonalTweetPage;
