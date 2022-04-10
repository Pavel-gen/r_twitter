import React, { useEffect, useState } from "react";
import "./Model.css";
import toggleModel from "./toggleModel";
import { useDispatch } from "react-redux";
import { add_post, update_post } from "../../fearutures/postSlice";
import { useSelector } from "react-redux";
import "../Tweet/Tweet.css";
import axios from "axios";

const Model = ({ id, operation, start_content }) => {
  let inner_content = useSelector((state) => state.first_blood.chosen_content);
  let tweet_id = useSelector((state) => state.first_blood.chosen_id);
  let start_author = useSelector((state) => state.user_moves.chosen_user);
  let added_media = useSelector((state) => state.first_blood.media);
  let initial_index = useSelector((state) => state.first_blood.startMediaIndex);

  if (inner_content) inner_content = inner_content.payload;
  if (start_author) start_author = start_author.payload;

  const [content, setContent] = useState("");
  const [commContent, setCommContent] = useState("");
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(null);
  const [author, setAuthor] = useState(null);
  const [localAuthor, setLocalAuthor] = useState(null);
  const [postImg, setPostImg] = useState([]);
  const [imgSrc, setImgSrc] = useState([]);

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (id === "imgModel") {
      setCurrentIndex(initial_index.payload);
    }
  }, [added_media, initial_index]);

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

  useEffect(() => {
    const promises = postImg.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", (ev) => {
          resolve(ev.target.result);
        });
        reader.addEventListener("error", reject);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then((images) => {
      setImgSrc(images);
    });
  }, [postImg]);

  const crossHandler = (item) => {
    try {
      let needed_index = imgSrc.indexOf(item);
      setPostImg(postImg.filter((el) => el !== postImg[needed_index]));
    } catch (err) {
      console.log({ message: err.message });
    }
  };

  const createTweet = async (dispatch) => {
    try {
      console.log(content);
      const form = new FormData();
      const url = "http://localhost:4000/api/posts";
      form.append("content", content);
      postImg.forEach((file) => {
        form.append("media", file);
      });
      console.log(form["media"]);

      const token = localStorage.getItem("token");

      {
        /*
    

      const post = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
        body: form,
      });    
    */
      }
      const post = await axios({
        method: "post",
        url,
        data: form,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      });

      console.log(post);
      const result = post.data;
      result.author = localAuthor;
      console.log(localAuthor);
      dispatch(add_post(result));
      setContent("");
      setPostImg([]);

      toggleModel("postmodel");
    } catch (err) {
      console.log({ message: err.message });
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
      let formData = new FormData();
      formData.append("content", commContent);

      postImg.forEach((file) => {
        formData.append("media", file);
      });
      const token = localStorage.getItem("token");

      {
        /*    const request = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      });*/
      }

      const request = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      });

      const result = request.data;
      console.log(result);
      result.new_tweet_comment.author = localAuthor;
      dispatch(add_post(result.new_tweet_comment));
      toggleModel("commentmodel");
      console.log(request);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div
        id={id}
        className="create_tweet_model deactive_something"
        onClick={(e) => {
          e.stopPropagation();
          toggleModel(id);
          setPostImg([]);
        }}
      >
        {id !== "imgModel" ? (
          <div
            className="model_content"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div id={id} className="container_t model_container_t">
              {operation == "COMMENT" ? (
                <div>
                  <img
                    className="img_post"
                    src={
                      author !== null &&
                      `http://localhost:4000/${author.avatar}`
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
                      setPostImg([]);
                    }}
                  >
                    cancel
                  </button>
                  <div>
                    <label onClick={() => console.log(postImg)}>
                      +
                      <input
                        type="file"
                        onChange={(e) => {
                          postImg.length < 4
                            ? setPostImg([e.target.files[0]].concat(postImg))
                            : alert("4 is max amount");
                        }}
                      />
                    </label>
                  </div>

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
                          {localAuthor !== null && localAuthor.username}
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
                        setPostImg([]);
                      }}
                    >
                      cancel
                    </button>
                    <div>
                      <label onClick={() => console.log(postImg)}>
                        +
                        <input
                          type="file"
                          onChange={(e) => {
                            postImg.length < 4
                              ? setPostImg([e.target.files[0]].concat(postImg))
                              : alert("4 is max amount");
                          }}
                        />
                      </label>
                    </div>
                    <button
                      className="model_post"
                      onClick={() => {
                        addComment();
                        setCommContent("");
                        setPostImg([]);
                      }}
                    >
                      reply
                    </button>
                  </>
                </div>
              </>
            )}
            <div className="spec_img_container">
              {imgSrc.map((item) => {
                return (
                  <div className="spec_post_img_cont">
                    <img className="post_img" src={item} />
                    <i
                      class="fa fa-times cross"
                      aria-hidden="true"
                      onClick={() => {
                        crossHandler(item);
                      }}
                    ></i>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className="base_imgModel_cont"
            onClick={(e) => {
              e.stopPropagation();
              console.log(e.currentTarget);
            }}
          >
            <button
              className="img_model_btn"
              onClick={(e) => {
                e.stopPropagation();
                if (currentIndex !== 0) {
                  setCurrentIndex(
                    (currentIndex - 1) % added_media.payload.length
                  );
                } else {
                  setCurrentIndex(added_media.payload.length - 1);
                }
              }}
            >
              <i class="fa fa-arrow-left arrow" aria-hidden="true"></i>
            </button>
            <div className="img_model_cont">
              {added_media.payload && (
                <>
                  <img
                    className="img_model_item"
                    src={`http://localhost:4000/${added_media.payload[currentIndex]}`}
                  />
                </>
              )}
            </div>
            <button
              className="img_model_btn"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(
                  (currentIndex + 1) % added_media.payload.length
                );
              }}
            >
              <i class="fa fa-arrow-right arrow" aria-hidden="true"></i>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Model;
