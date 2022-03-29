import React, { useEffect, useState } from "react";
import "./Tweet.css";
import postSlice, {
  update,
  delete_post,
  update_post,
  changed_content,
  changed_id,
  choose_post,
  add_post,
} from "../../fearutures/postSlice";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loading from "../Loading/Loading";

import Model from "../Model/Model";

import toggleModel from "../Model/toggleModel";
import { choose_user } from "../../fearutures/userSlice";
import { useNavigate } from "react-router-dom";
import ClassicalTweet from "./ClassicalTweet";

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

const ReTweet = async (id, dispatch, subtype) => {
  try {
    const url = `http://localhost:4000/api/posts/retweet/${id}`;
    const token = localStorage.getItem("token");
    const addedRetweet = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    console.log(addedRetweet);
    const result = await addedRetweet.json();
    let created_retweet = result.retweet;

    if (!subtype) {
      created_retweet.retweet_auth = result.retweet.author;
      created_retweet.target_tweet = result.base_tweet._id;
      delete result.base_tweet.createdAt;
      delete result.base_tweet._id;
      delete created_retweet.author;
      result.base_tweet.isRetweet = true;
      console.log(result);
      Object.assign(created_retweet, result.base_tweet);
      created_retweet.createdAt = result.retweet.createdAt;
      dispatch(add_post(created_retweet));
    }

    console.log({ ...created_retweet });
  } catch (err) {
    console.log(err.message);
  }
};

const deleteRetweet = async (id, dispatch, el) => {
  try {
    const url = `http://localhost:4000/api/posts/retweet/${id}`;
    const token = localStorage.getItem("token");
    const deleted = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    showMenu(el);
    dispatch(delete_post(id));
    console.log(deleted);
  } catch (err) {
    console.log(err.message);
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

/*
 сейчас реализована логика отображения твитов исходя их создателя треда
 теперь нудно сделать так чтобы отображался только 1 тред

можно прочто пикать первый попавшийся те тот который был создан первым и отобрадвть
ну типо но по хорошему чтобы в ленте не было супер длинных тредов нудно будет их искусвенно укоротить добавив конпку отобразить

*/

const Tweet = ({
  author,
  content,
  createdAt,
  _id,
  likes,
  likedBy,
  type,
  thread,
  origin_length,
  base_id,
  commentTo,
  protocol,
  comments,
  subtype,
  retweetedBy,
  isRetweet,
  target_tweet,
  updatedAt,
  retweet_auth,
}) => {
  const user_id = localStorage.getItem("user_id");
  const startLikeCondition = likedBy.includes(user_id);

  const [alt_content, setContent] = useState(content);
  const [altLikes, setAltLikes] = useState(likes);
  const [retweetLen, setRetweetLen] = useState(retweetedBy.length);
  const [likeCondition, setLikeCondition] = useState(startLikeCondition);
  const [altRetweetedBy, setAltRetweetedBy] = useState(retweetedBy);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleted_id = useSelector((state) => state.first_blood.id);

  let next_post;
  if (thread) {
    next_post = thread[0];
  }

  if (isRetweet) {
    [_id, target_tweet] = [target_tweet, _id];
    [createdAt, updatedAt] = [updatedAt, createdAt];
  }

  //  console.log(thread);

  //  console.log(content);
  /* 
  if (type == "base") {
    console.log(origin11_length);
  }
*/
  //  console.log("--------------------------");

  //if (next_posts.length > 0) {
  //  console.log(content + " : " + next_posts);
  //  console.log(thread);
  //}

  const Like = async () => {
    try {
      const url = `http://localhost:4000/api/posts/${_id}/likes`;
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

  if (type == "base") {
    base_id = _id;
  }
  if (protocol == "thread" && type == "base") {
    subtype = "choosen_post";
  }

  return (
    <>
      {origin_length > 2 &&
      thread.length > 1 &&
      protocol !== "thread" &&
      type == "comment" ? (
        <></>
      ) : (
        <>
          {origin_length > 2 && thread.length == 1 && protocol !== "thread" && (
            <>
              <div className="show_button_container">
                <button
                  className="show_btn"
                  onClick={() => {
                    navigate(`/tweets/thread/${_id}`);
                  }}
                >
                  show thread
                </button>
              </div>
            </>
          )}

          {subtype == "choosen_post" && (
            <>
              <div
                id={_id}
                className={
                  type == "base"
                    ? next_post == undefined
                      ? "container_t choosen_content_t"
                      : "container_t tweet_base choosen_content_t"
                    : "container_t tweet_thread choosen_content_t"
                }
              >
                <div className="choosen_content">
                  <div className="choosen_head">
                    <img
                      className="img_post img_post_ch"
                      src={`http://localhost:4000/${author.avatar}`}
                      onClick={() => {
                        navigate(`/profile/${author._id}`, {
                          replace: true,
                        });
                      }}
                    />

                    <div className="header_t">
                      <div className="title_left header_choosed">
                        <h4
                          className="title_t title_choosed"
                          onClick={() => {
                            navigate(`/profile/${author._id}`);
                          }}
                        >
                          {author.username}
                        </h4>
                        <p className="choosed_p">
                          {" "}
                          {moment(createdAt).fromNow()}
                        </p>
                        {commentTo && (
                          <>
                            <div className="reply_to">replyTo:</div>
                            <div
                              className="reply_to_author"
                              onClick={() => {
                                navigate(`/tweets/${commentTo}`);
                              }}
                            >
                              {commentTo}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="start_cont ">
                    <button
                      className="btn_start btn_start_ch"
                      onClick={(e) => showMenu(e.currentTarget)}
                    >
                      <i className="fa fa-cog"></i>
                    </button>
                    <div className="btn_container">
                      {author._id == user_id ? (
                        <>
                          <button
                            className="btn btn_delete"
                            onClick={(e) =>
                              removePost(
                                _id,
                                dispatch,
                                e.currentTarget.parentElement
                              )
                            }
                          >
                            delete
                          </button>
                          <button
                            className="btn btn_update"
                            onClick={(e) => {
                              dispatch(changed_content(content));
                              dispatch(choose_user(author));
                              dispatch(changed_id(_id));
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
                            onClick={(e) => navigate(`/profile/${author._id}`)}
                          >
                            перейте к профилю
                          </button>
                          <button
                            className="btn btn_delete"
                            onClick={(e) =>
                              showMenu(e.currentTarget.parentElement)
                            }
                          >
                            отмена
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="payload payload_ch">
                  <div
                    className="content_t content_t_ch"
                    onClick={() => {
                      dispatch(
                        choose_post({
                          author,
                          content,
                          createdAt,
                          _id,
                          likes,
                          likedBy,
                          type,
                          thread: [],
                          origin_length,
                          base_id,
                          commentTo,
                          protocol,
                          comments,
                        })
                      );
                      navigate(`/tweets/${_id}`);
                    }}
                  >
                    {content}
                  </div>
                  <div className="foot_t foot_t_ch">
                    <span>
                      <i
                        className="fa fa-comment  tweet_comment"
                        aria-hidden="true"
                        onClick={(e) => {
                          dispatch(changed_content(content));
                          dispatch(choose_user(author));
                          dispatch(changed_id(_id));
                          toggleModel("commentmodel");
                        }}
                      ></i>
                      {comments.length}
                    </span>

                    <span>
                      <i
                        className={
                          !altRetweetedBy.includes(user_id)
                            ? "fa fa-retweet retweet"
                            : "fa fa-retweet retweet retweet_clicked"
                        }
                        aria-hidden="true"
                        onClick={(e) => {
                          ReTweet(_id, dispatch, subtype);

                          if (!altRetweetedBy.includes(user_id)) {
                            console.log(altRetweetedBy);
                            setAltRetweetedBy(altRetweetedBy.concat([user_id]));
                            e.currentTarget.classList.toggle("retweet_clicked");
                            setRetweetLen(retweetLen + 1);
                          }
                        }}
                      ></i>
                      {retweetLen}
                    </span>
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
                  </div>
                </div>
              </div>
            </>
          )}

          {!subtype && (
            <>
              <div
                id={_id}
                className={
                  type == "base" || isRetweet
                    ? next_post == undefined
                      ? "container_t"
                      : "container_t tweet_base"
                    : "container_t tweet_thread"
                }
              >
                <div>
                  <img
                    className="img_post"
                    src={`http://localhost:4000/${author.avatar}`}
                    onClick={() => {
                      navigate(`/profile/${author._id}`, {
                        replace: true,
                      });
                    }}
                  />
                  {next_post && (
                    <div className="comment_space">
                      <div className="comment_stick"></div>
                    </div>
                  )}
                </div>

                <div className="payload">
                  {isRetweet && (
                    <div className="retweet_bar">
                      <div className="retweet_to">retweeted</div>

                      {/* <div
                        className="reply_to_author"
                        onClick={() => {
                          navigate(`/profile/${retweet_auth}`);
                        }}
                      >
                        {retweet_auth}
                      </div>
                      */}
                    </div>
                  )}
                  <div className="header_t">
                    <div className="title_left">
                      <h4
                        className="title_t"
                        onClick={() => {
                          navigate(`/profile/${author._id}`, { replace: true });
                        }}
                      >
                        {author.username}
                      </h4>
                      <p>{moment(createdAt).fromNow()}</p>
                      {commentTo && (
                        <>
                          <div className="reply_to">replyTo:</div>
                          <div
                            className="reply_to_author"
                            onClick={() => {
                              navigate(`/tweets/${commentTo}`);
                            }}
                          >
                            {commentTo}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="start_cont">
                      <button
                        onClick={(e) => showMenu(e.currentTarget)}
                        className="btn_start "
                      >
                        <i className="fa fa-cog"></i>
                      </button>
                      <div className="btn_container">
                        {isRetweet ? (
                          retweet_auth == user_id ? (
                            <button
                              onClick={(e) =>
                                deleteRetweet(
                                  target_tweet,
                                  dispatch,
                                  e.currentTarget.parentElement
                                )
                              }
                              className="btn btn_delete"
                            >
                              delete my retweet
                            </button>
                          ) : (
                            <button
                              className="btn btn_delete"
                              onClick={(e) =>
                                showMenu(e.currentTarget.parentElement)
                              }
                            >
                              отмена
                            </button>
                          )
                        ) : author._id == user_id ? (
                          <>
                            <button
                              onClick={(e) =>
                                removePost(
                                  _id,
                                  dispatch,
                                  e.currentTarget.parentElement
                                )
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
                                dispatch(changed_id(_id));
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
                                navigate(`/profile/${author._id}`, {
                                  replace: true,
                                })
                              }
                            >
                              перейте к профилю
                            </button>
                            <button
                              className="btn btn_delete"
                              onClick={(e) =>
                                showMenu(e.currentTarget.parentElement)
                              }
                            >
                              отмена
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className="content_t"
                    onClick={() => {
                      dispatch(
                        choose_post({
                          author,
                          content,
                          createdAt,
                          _id,
                          likes,
                          likedBy,
                          type,
                          thread: [],
                          origin_length,
                          base_id,
                          commentTo,
                          protocol,
                          comments,
                        })
                      );
                      navigate(`/tweets/${_id}`);
                    }}
                  >
                    {content}
                  </div>
                  <div className="foot_t">
                    <span>
                      <i
                        className="fa fa-comment  tweet_comment"
                        aria-hidden="true"
                        onClick={(e) => {
                          dispatch(changed_content(content));
                          dispatch(choose_user(author));
                          dispatch(changed_id(_id));
                          toggleModel("commentmodel");
                        }}
                      ></i>
                      {comments.length}
                    </span>
                    <span>
                      <i
                        className={
                          retweetedBy.includes(user_id)
                            ? "fa fa-retweet retweet retweet_clicked"
                            : "fa fa-retweet retweet retweet"
                        }
                        aria-hidden="true"
                        onClick={(e) => {
                          ReTweet(_id, dispatch);

                          if (!altRetweetedBy.includes(user_id)) {
                            console.log(altRetweetedBy);
                            setAltRetweetedBy(altRetweetedBy.concat([user_id]));
                            e.currentTarget.classList.toggle("retweet_clicked");
                            setRetweetLen(retweetLen + 1);
                          }
                        }}
                      ></i>
                      {retweetLen}
                    </span>
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
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
      <>
        {next_post && !isRetweet && (
          <>
            <Tweet
              type="comment"
              key={next_post._id}
              {...next_post}
              thread={thread.filter((el) => el !== next_post)}
              origin_length={origin_length}
              base_id={base_id}
              protocol={protocol}
              subtype={null}
            />
          </>
        )}
      </>
    </>
  );
};

export default Tweet;
