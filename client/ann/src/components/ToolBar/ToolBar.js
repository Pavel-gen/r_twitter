import React, { useEffect, useState } from "react";
import "./ToolBar.css";
import { useDispatch } from "react-redux";
import { add_post, changed_content } from "../../fearutures/postSlice";

import toggleModel from "../Model/toggleModel";
import Model from "../Model/Model";
import { choose_user } from "../../fearutures/userSlice";

const ToolBar = () => {
  const [content, setContent] = useState("");

  const dispatch = useDispatch();

  const id = localStorage.getItem("user_id");

  return (
    <div>
      <div className="l_toolbar">
        <ul className="tool_list">
          <li
            className="tool_li"
            onClick={() => {
              window.location.assign(
                `http://localhost:3000/profile/${id}/home`
              );
            }}
          >
            <span>
              <i class="fa fa-home li_span" aria-hidden="true"></i>
            </span>
            <p className="l_content">Home</p>
          </li>
          <li
            className="tool_li"
            onClick={() => {
              window.location.assign(`http://localhost:3000/profile/${id}`);
            }}
          >
            <span>
              <i class="fa fa-user li_span" aria-hidden="true"></i>
            </span>
            <p className="l_content">Profile</p>
          </li>
          <li className="tool_li">
            <span>
              <i class="fa fa-envelope li_span" aria-hidden="true"></i>
            </span>
            <p className="l_content">messages</p>
          </li>
          <li
            onClick={() => {
              localStorage.clear();
              document.location.href = `http://localhost:3000/registration`;
            }}
            className="tool_li"
          >
            <span>
              <i class="fa fa-sign-out-alt li_span" aria-hidden="true"></i>
            </span>
            <p className="l_content">log_out</p>
          </li>
          <div className="create-btn-container">
            <button
              onClick={() => {
                dispatch(changed_content(""));
                toggleModel("postmodel");
              }}
              className="create-btn"
            >
              <span className="span_btn">
                <i class="fa fa-paint-brush" aria-hidden="true"></i>
              </span>
              <p className="l_content">POST</p>
            </button>
          </div>
        </ul>
      </div>
      <Model id="postmodel" operation="POST" content />
    </div>
  );
};

export default ToolBar;
