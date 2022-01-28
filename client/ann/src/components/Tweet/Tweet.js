import React, { useEffect, useState } from "react";
import "./Tweet.css";
import postSlice, {
  update,
  delete_post,
  update_post,
  changed_content,
  changed_id,
} from "../../fearutures/postSlice";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import Model from "../Model/Model";

import toggleModel from "../Model/toggleModel";
import { choose_user } from "../../fearutures/userSlice";

const showMenu = (el) => {
  const parent = el.parentElement;
  const menu = parent.querySelector(".btn_container");
  menu.classList.toggle("btn_container_active");
};

const removePost = async (id, dispatch, el) => {
  try {
    const deleted = await fetch(`http://localhost:4000/api/posts/${id}`, {
      method: "DELETE",
    });
    showMenu(el);
    dispatch(delete_post(id));
  } catch (e) {
    console.log(e.message);
  }
};

//const toggleModel = (el, content) => {
//    try {
//        const model = document.getElementById('editmodel')
//        console.log(model)
//        model.classList.toggle('deactive_something')
//
//        showMenu(el)
//    } catch (err){
//        console.log(err.message)
//    }
//}

const Tweet = ({ author, content, date, id, likes, likedBy, comments }) => {
  const user_id = localStorage.getItem("user_id");

  const startLikeCondition = likedBy.includes(user_id);

  const [alt_content, setContent] = useState(content);
  const deleted_id = useSelector((state) => state.first_blood.id);
  const [altLikes, setAltLikes] = useState(likes);
  const [likeCondition, setLikeCondition] = useState(startLikeCondition);

  const Like = async () => {
    try {
      const url = `http://localhost:4000/api/posts/${id}/likes`;
      const token = localStorage.getItem("token");
      const request = await fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log(request);
      if (likeCondition) {
        setAltLikes(altLikes - 1);
      } else {
        setAltLikes(altLikes + 1);
      }
      setLikeCondition(!likeCondition);
    } catch (err) {
      console.log(err);
    }
  };

  const dispatch = useDispatch();
  return (
    <>
      <div id={id} className="container_t">
        <img
          className="img_post"
          src={`http://localhost:4000/${author.avatar}`}
        />
        <div className="payload">
          <div className="header_t">
            <div className="title_left">
              <h4 className="title_t">{author.username}</h4>
              <p>{moment(date).fromNow()}</p>
            </div>
            <div className="start_cont">
              <button
                onClick={(e) => showMenu(e.currentTarget)}
                className="btn_start "
              >
                <i className="fa fa-cog"></i>
              </button>
              <div className="btn_container">
                {author._id == user_id ? (
                  <>
                    <button
                      onClick={(e) =>
                        removePost(id, dispatch, e.currentTarget.parentElement)
                      }
                      className="btn btn_delete"
                    >
                      delete
                    </button>
                    <button
                      className="btn btn_update"
                      onClick={(e) => {
                        dispatch(changed_content(content));
                        dispatch(choose_user(author));
                        dispatch(changed_id(id));
                        toggleModel("editmodel");
                        showMenu(e.currentTarget.parentElement);
                      }}
                    >
                      update
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn_delete"
                      onClick={(e) =>
                        window.location.assign(
                          `http://localhost:3000/profile/${author._id}`
                        )
                      }
                    >
                      перейте к профилю
                    </button>
                    <button
                      className="btn btn_delete"
                      onClick={(e) => showMenu(e.currentTarget.parentElement)}
                    >
                      отмена
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <p className="content_t">{content}</p>
          <div className="foot_t">
            <span>
              <i
                className={
                  likeCondition
                    ? "fa fa-heart like pressed_like"
                    : "fa fa-heart like"
                }
                aria-hidden="true"
                onClick={(e) => {
                  e.currentTarget.classList.toggle("pressed_like");
                  Like();
                }}
              ></i>
              {altLikes !== 0 && altLikes}
            </span>
            <span>
              <i className="fa fa-retweet retweet" aria-hidden="true"></i>2
            </span>
            <span>
              <i
                className="fa fa-comment  tweet_comment"
                aria-hidden="true"
                onClick={(e) => {
                  dispatch(changed_content(content));
                  dispatch(choose_user(author));
                  dispatch(changed_id(id));
                  toggleModel("commentmodel");
                }}
              ></i>
              {comments.length}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tweet;
