import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { choose_post } from "../../fearutures/postSlice";
import "../Tweet/Tweet.css";

const getPrevT = async (dispatch, id) => {
  console.log(id);
  const url = `http://localhost:4000/api/posts/${id}`;
  const prev_post = await fetch(url);
  const result = await prev_post.json();
  console.log(result);
  console.log("hihi");
  dispatch(choose_post(result));
};

const BackButton = ({ content, post_id, type }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(post_id);

  return (
    <>
      <div className="f_container f_comeback  ">
        <button
          className="back_btn"
          onClick={(e) => {
            e.preventDefault();
            if (type == "tweet") {
              getPrevT(dispatch, post_id);
            }
            navigate(-1);
          }}
        >
          <i class="fa fa-arrow-circle-left" aria-hidden="true"></i>
        </button>
        <div className="username">{content}</div>
      </div>
    </>
  );
};
export default BackButton;
