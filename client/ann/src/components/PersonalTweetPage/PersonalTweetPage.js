import { current } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { choose_post } from "../../fearutures/postSlice";
import BackButton from "../BackButton/BackButton";
import ListTweet from "../ListTweet/ListTweet";
import Loading from "../Loading/Loading";
import Tweet from "../Tweet/Tweet";
import "../Tweet/Tweet.css";
import moment from "moment";

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

  const getCurPost = async (id) => {
    const url = `http://localhost:4000/api/posts/${id}`;
    const prev_post = await fetch(url);
    const result = await prev_post.json();
    setCurrentPost(result);
    localStorage.setItem("current_post", JSON.stringify(result));
  };

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
    console.log(choosen_post);
    if (choosen_post) {
      if (choosen_post.payload.id == id) {
        setCurrentPost(choosen_post.payload);
        localStorage.setItem(
          "current_post",
          JSON.stringify(choosen_post.payload)
        );
      } else {
        console.log(id);
        getCurPost(id);
      }
    } else {
      let post = JSON.parse(localStorage.getItem("current_post"));
      if (post) {
        setCurrentPost(post);
      } else {
        getCurPost(id);
      }
    }
  }, [choosen_post, document.location.href]);

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
          <BackButton
            content={"Tweet"}
            post_id={currentPost.replyTo}
            type="tweet"
          />
          <div className="container_t">
            <Tweet {...currentPost} subtype="choosen_post" />
          </div>
          <Loading />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="list_tweets">
        <BackButton
          content={"Tweet"}
          post_id={currentPost.commentTo}
          type="tweet"
        />
        <Tweet
          {...currentPost}
          subtype="choosen_post"
          replyTo={currentPost.commentTo}
        />

        {/*<div className="container_t">
          <Tweet {...currentPost} type="choosen_post" /> 
        </div>*/}
        <ListTweet
          posts={comments}
          protocol="choosen_post"
          replyTo={currentPost.commentTo}
        />
      </div>
    </>
  );
};

export default PersonalTweetPage;
