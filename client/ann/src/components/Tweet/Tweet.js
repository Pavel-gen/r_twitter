import React, { useEffect, useState } from "react";
import "./Tweet.css";
import postSlice, {
  update,
  delete_post,
  update_post,
  changed_content,
  changed_id,
  choose_post,
} from "../../fearutures/postSlice";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loading from "../Loading/Loading";

import Model from "../Model/Model";

import toggleModel from "../Model/toggleModel";
import { choose_user } from "../../fearutures/userSlice";
import { useNavigate } from "react-router-dom";

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

/*
 сейчас реализована логика отображения твитов исходя их создателя треда
 теперь нудно сделать так чтобы отображался только 1 тред

можно прочто пикать первый попавшийся те тот который был создан первым и отобрадвть
ну типо но по хорошему чтобы в ленте не было супер длинных тредов нудно будет их искусвенно укоротить добавив конпку отобразить

*/

const Tweet = ({
  author,
  content,
  date,
  id,
  likes,
  likedBy,
  type,
  thread,
  origin_length,
  base_id,
  replyTo,
  protocol,
  comments,
  subtype,
}) => {
  const user_id = localStorage.getItem("user_id");
  const startLikeCondition = likedBy.includes(user_id);

  const [alt_content, setContent] = useState(content);
  const deleted_id = useSelector((state) => state.first_blood.id);
  const [altLikes, setAltLikes] = useState(likes);
  const [likeCondition, setLikeCondition] = useState(startLikeCondition);
  let next_post;
  if (thread) {
    next_post = thread[0];
    console.log(next_post);
    console.log(thread);
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
  const navigate = useNavigate();

  if (type == "base") {
    base_id = id;
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
                    navigate(`/tweets/thread/${id}`);
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
                id={id}
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
                    />

                    <div className="header_t">
                      <div className="title_left header_choosed">
                        <h4 className="title_t title_choosed">
                          {author.username}
                        </h4>
                        <p className="choosed_p"> {moment(date).fromNow()}</p>
                        {replyTo && (
                          <>
                            <div className="reply_to">replyTo:</div>
                            <div className="reply_to_author">{replyTo}</div>
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
                                id,
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
                          date,
                          id,
                          likes,
                          likedBy,
                          type,
                          thread: [],
                          origin_length,
                          base_id,
                          commentTo: replyTo,
                          protocol,
                          comments,
                        })
                      );
                      navigate(`/tweets/${id}`);
                    }}
                  >
                    {content}
                  </div>
                  <div className="foot_t foot_t_ch">
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
                      <i
                        className="fa fa-retweet retweet"
                        aria-hidden="true"
                      ></i>
                      2
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
          )}
          {!subtype && (
            <div
              id={id}
              className={
                type == "base"
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
                />
                {next_post && (
                  <div className="comment_space">
                    <div className="comment_stick"></div>
                  </div>
                )}
              </div>

              <div className="payload">
                <div className="header_t">
                  <div className="title_left">
                    <h4 className="title_t">{author.username}</h4>
                    <p>{moment(date).fromNow()}</p>
                    {replyTo && (
                      <>
                        <div className="reply_to">replyTo:</div>
                        <div className="reply_to_author">{replyTo}</div>
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
                      {author._id == user_id ? (
                        <>
                          <button
                            onClick={(e) =>
                              removePost(
                                id,
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
                        date,
                        id,
                        likes,
                        likedBy,
                        type,
                        thread: [],
                        origin_length,
                        base_id,
                        commentTo: replyTo,
                        protocol,
                        comments,
                      })
                    );
                    navigate(`/tweets/${id}`);
                  }}
                >
                  {content}
                </div>
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
                    <i className="fa fa-retweet retweet" aria-hidden="true"></i>
                    2
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
          )}
        </>
      )}
      <>
        {next_post && (
          <>
            <Tweet
              replyTo={next_post.author.username}
              type="comment"
              key={next_post._id}
              author={next_post.author}
              content={next_post.content}
              date={next_post.createdAt}
              id={next_post._id}
              likes={next_post.likes}
              likedBy={next_post.likedBy}
              comments={next_post.comments}
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
