import React from "react";
import moment from "moment";

const ChoosenTweet = ({ author, replyTo }) => {
  return (
    <>
      {/*<div
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
                <p className="choosed_p"> {moment(date).fromNow()}</p>
                {replyTo && (
                  <>
                    <div className="reply_to">replyTo:</div>
                    <div
                      className="reply_to_author"
                      onClick={() => {
                        navigate(`/tweets/${replyTo}`);
                      }}
                    >
                      {replyTo}
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
                      removePost(id, dispatch, e.currentTarget.parentElement)
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
                    onClick={(e) => showMenu(e.currentTarget.parentElement)}
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
      </div> */}
    </>
  );
};

export default ChoosenTweet;
