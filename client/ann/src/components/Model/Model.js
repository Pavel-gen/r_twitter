import React, { useEffect, useState } from "react";
import "./Model.css";
import toggleModel from "./toggleModel";
import { useDispatch } from "react-redux";
import { add_post, update_post } from "../../fearutures/postSlice";
import { useSelector } from "react-redux";
import "../Tweet/Tweet.css";

const Model = ({ id, operation, start_content }) => {
  let inner_content = useSelector((state) => state.first_blood.chosen_content);
  let tweet_id = useSelector((state) => state.first_blood.chosen_id);
  let start_author = useSelector((state) => state.user_moves.chosen_user);

  if (inner_content) inner_content = inner_content.payload;
  if (start_author) start_author = start_author.payload;
  const [content, setContent] = useState("");
  const [commContent, setCommContent] = useState("");
  const dispatch = useDispatch();
  const [author, setAuthor] = useState(null);

  const [localAuthor, setLocalAuthor] = useState(null);
  const user_id = localStorage.getItem("user_id");

  useEffect(async () => {
    if (localAuthor == null) {
      const url = `http://localhost:4000/api/users/${user_id}`;
      const user = await fetch(url);
      let result = await user.json();
      setLocalAuthor(result);
    }
  }, []);

  useEffect(() => {
    setContent(inner_content);
  }, [inner_content]);

  useEffect(() => {
    setAuthor(start_author);
  }, [start_author]);

  const createTweet = async (dispatch) => {
    try {
      console.log(content);
      const url = "http://localhost:4000/api/posts";
      const data = {
        content: content,
      };
      const token = localStorage.getItem("token");
      const post = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      });
      const result = await post.json();

      dispatch(add_post(result));
      setContent("");
      toggleModel("postmodel");
    } catch (e) {
      console.log(e.message);
    }
  };

  const editTweet = async () => {
    try {
      const url = `http://localhost:4000/api/posts/${tweet_id.payload}`;

      const data = {
        content: content,
      };
      const token = localStorage.getItem("token");
      const request = await fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      });

      const result = await request.json();
      toggleModel("editmodel");
      result.content = content;
      dispatch(update_post(result));
      console.log(data);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const addComment = async () => {
    try {
      const url = `http://localhost:4000/api/posts/${tweet_id.payload}`;

      const data = {
        content: commContent,
      };
      const token = localStorage.getItem("token");
      const request = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      });
      toggleModel("commentmodel");
      console.log(request);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div id={id} className="create_tweet_model deactive_something">
        <div className="model_content">
          <div id={id} className="container_t model_container_t">
            {operation == "COMMENT" ? (
              <div>
                <img
                  className="img_post"
                  src={
                    author !== null && `http://localhost:4000/${author.avatar}`
                  }
                />
                <div className="comment_space">
                  <div className="comment_stick"></div>
                </div>
              </div>
            ) : (
              <img
                className="img_post"
                src={
                  localAuthor !== null &&
                  `http://localhost:4000/${localAuthor.avatar}`
                }
              />
            )}
            <div className="payload">
              <div className="header_t">
                <div className="title_left">
                  <h4 className="title_t">
                    {operation == "COMMENT"
                      ? author !== null && author.username
                      : localAuthor !== null && localAuthor.username}
                  </h4>
                </div>
                <div className="start_cont"></div>
              </div>
              <p className="content_t">
                {operation !== "COMMENT" ? (
                  <textarea
                    contenteditable
                    type="text"
                    className="content_t content_textarea"
                    placeholder="write something..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                ) : (
                  <div className="content_t "> {content}</div>
                )}
              </p>
            </div>
          </div>

          {operation == "POST" && (
            <div className="model_btn_container">
              <>
                <button
                  className="model_cancel"
                  onClick={() => {
                    toggleModel(id);
                    setContent("");
                  }}
                >
                  cancel
                </button>
                <button
                  className="model_post"
                  onClick={() => createTweet(dispatch)}
                >
                  post
                </button>
              </>
            </div>
          )}
          {operation == "EDIT" && (
            <div className="model_btn_container">
              <>
                <button
                  className="model_cancel"
                  onClick={() => {
                    toggleModel(id);
                    setContent(inner_content);
                  }}
                >
                  cancel
                </button>
                <button
                  className="model_post"
                  onClick={() => editTweet(tweet_id)}
                >
                  edit
                </button>
              </>
            </div>
          )}
          {operation == "COMMENT" && (
            <>
              <div className="model_comment_container">
                <img
                  className="img_post"
                  src={
                    localAuthor !== null &&
                    `http://localhost:4000/${localAuthor.avatar}`
                  }
                />
                <div className="payload">
                  <div className="header_t">
                    <div className="title_left">
                      <h4 className="title_t">
                        {author !== null && localAuthor.username}
                      </h4>
                    </div>
                    <div className="start_cont"></div>
                  </div>
                  <p className="content_t">
                    <textarea
                      type="text"
                      className="content_t content_textarea"
                      placeholder="write something..."
                      value={commContent}
                      onChange={(e) => setCommContent(e.target.value)}
                    />
                  </p>
                </div>
              </div>
              <div id={id} className="model_btn_container">
                <>
                  <button
                    className="model_cancel"
                    onClick={() => {
                      toggleModel(id);
                      setCommContent("");
                    }}
                  >
                    cancel
                  </button>
                  <button className="model_post" onClick={() => addComment()}>
                    reply
                  </button>
                </>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Model;
