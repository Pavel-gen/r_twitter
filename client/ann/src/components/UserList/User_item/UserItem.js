import React, { useDebugValue, useState } from "react";
import "../../Tweet/Tweet.css";
import "./UserItem.css";

const UserItem = ({ user }) => {
  const user_id = localStorage.getItem("user_id");
  const [curId, setCurId] = useState(null);
  const [condition, setCondition] = useState();

  console.log(curId);
  let start_condition;
  if (curId !== user._id || curId == null) {
    if (user.followers.includes(user_id)) {
      start_condition = true;
    } else {
      start_condition = false;
    }
    setCurId(user._id);
    setCondition(start_condition);
  }

  const [follow, setFollow] = useState(user.followers.length);
  console.log(condition);

  const Follow = async (target_id) => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:4000/api/users/${target_id}`;
      if (condition) {
        setFollow(follow - 1);
        setCondition(!condition);
      } else {
        setFollow(follow + 1);
        setCondition(!condition);
      }
      console.log(follow);
      const request = await fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const result = await request.json();
      console.log(target_id);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="f_container extra_user">
        <img
          className="img_post"
          src={`http://localhost:4000/${user.avatar}`}
          onClick={(e) => {
            e.preventDefault();
            document.location.href = `http://localhost:3000/profile/${user._id}`;
          }}
        />
        <div
          className="payload_f inner_user"
          onClick={(e) => {
            e.preventDefault();
            document.location.href = `http://localhost:3000/profile/${user._id}`;
          }}
        >
          <div className="username">{user.username}</div>
          <div className="comment">{user.bio}</div>
        </div>
        {user._id === user_id ? (
          ""
        ) : (
          <button
            id={user._id}
            className={
              condition ? "edit_profile_btn follow_btn" : "edit_profile_btn"
            }
            onClick={(e) => {
              const el = e.currentTarget;
              el.classList.toggle("follow_btn");
              e.preventDefault();
              Follow(user._id);
            }}
          >
            {condition ? "folowing" : "follow"}
          </button>
        )}
      </div>
    </>
  );
};

export default UserItem;
