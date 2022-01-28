import React from "react";
import "./FollowerToolBar.css";

import { useNavigate } from "react-router-dom";

const FollowerToolBar = ({ condition, user, type }) => {
  const navigate = useNavigate();

  const right_btn = document.getElementById(type);
  console.log(right_btn);
  if (right_btn) {
    const a = right_btn.querySelector(".button_line");
    console.log(a);
    if (a) {
      a.classList.remove("hide");
    }
  }

  const colorBlind = (e) => {
    const btns = document.querySelectorAll(".button_line");
    btns.forEach((btn) => {
      btn.classList.add("hide");
    });
    const chosen_div = e.currentTarget.querySelector(".button_line");
    chosen_div.classList.remove("hide");
  };

  return (
    <>
      <div className="f_container f_comeback  ">
        <button
          className="back_btn"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/profile/${user._id}`, { replace: true });
          }}
        >
          <i class="fa fa-arrow-circle-left" aria-hidden="true"></i>
        </button>
        <div className="username">{user.username}</div>
      </div>

      <div className="f_container extra_list_users" id="f_btn_cont">
        {condition && (
          <button
            id="knownfollowers"
            className="f_btn"
            onClick={(e) => {
              e.preventDefault();
              colorBlind(e);
              navigate(`/profile/${user._id}/knownfollowers`, {
                replace: true,
              });
            }}
          >
            follower you know<div className="button_line hide"></div>
          </button>
        )}
        <button
          className="f_btn"
          id="followers"
          onClick={(e) => {
            e.preventDefault();
            colorBlind(e);
            navigate(`/profile/${user._id}/followers`, { replace: true });
          }}
        >
          followers<div className="button_line hide"></div>
        </button>
        <button
          className="f_btn"
          id="following"
          onClick={(e) => {
            e.preventDefault();
            colorBlind(e);
            navigate(`/profile/${user._id}/following`, { replace: true });
          }}
        >
          following<div className="button_line hide"></div>
        </button>
      </div>
    </>
  );
};

export default FollowerToolBar;
