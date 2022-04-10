import React, { useState, useEffect } from "react";
import toggleModel from "../Model/toggleModel";
import "./Profile.css";
import FormUser from "../FormUser/FormUser";
import UserList from "../UserList/UserList";
import { useDispatch, useSelector } from "react-redux";
import { choose_user } from "../../fearutures/userSlice";

const Profile = ({ user }) => {
  const user_id = localStorage.getItem("user_id");

  let start_condition;
  if (user.followers.includes(user_id)) {
    start_condition = true;
  } else {
    start_condition = false;
  }

  const [follow, setFollow] = useState(user.followers.length);
  const [condition, setCondition] = useState(start_condition);

  const dispatch = useDispatch();

  const showProfileModel = () => {
    const model = document.querySelector(".profile_model");
    console.log(model);
    model.classList.toggle("hide");
  };

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
      <div className="profile_model hide">
        <div className="container">
          <div className="section">
            <FormUser user={user} operation="edit" />
          </div>
        </div>
      </div>
      <div className="section_p">
        <div className="container_p">
          {user.backimg == undefined ? (
            <div className="back_img  red_back"></div>
          ) : (
            <img
              className="back_img"
              src={`http://localhost:4000/${user.backimg}`}
            />
          )}
          <div className="">
            <div className="f_level">
              <img
                id="profile_photo"
                src={`http://localhost:4000/${user.avatar}`}
              />
              <div className="profile_button_container">
                {user._id !== user_id ? (
                  <>
                    <button className="profile_mess  ">
                      <i className="fa fa-envelope" aria-hidden="true"></i>
                    </button>
                    <button
                      className={
                        condition
                          ? "edit_profile_btn follow_btn"
                          : "edit_profile_btn"
                      }
                      onClick={(e) => {
                        const el = e.currentTarget;
                        el.classList.toggle("follow_btn");
                        e.preventDefault();
                        Follow(user._id);
                      }}
                    >
                      {condition ? "following" : "follow"}
                    </button>
                  </>
                ) : (
                  <button
                    className="edit_profile_btn"
                    onClick={(e) => showProfileModel()}
                  >
                    edit
                  </button>
                )}
              </div>
            </div>

            <div className="s_level">
              <div className="profile_username">{user.username}</div>
              <div className="profile_bio">{user.bio}</div>
              <div className="group_info">
                <div
                  className="group_item"
                  onClick={() => {
                    document.location.href = `http://localhost:3000/profile/${user._id}/following`;
                  }}
                >
                  <span>{user.following.length}</span> following
                </div>
                <div
                  className="group_item"
                  onClick={() => {
                    document.location.href = `http://localhost:3000/profile/${user._id}/followers`;
                  }}
                >
                  <span>{follow} </span> followers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
