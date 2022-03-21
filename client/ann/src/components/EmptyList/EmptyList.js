import React, { useState } from "react";

import "./EmptyList.css";

const EmptyList = ({ protocol }) => {
  const [message, setMessage] = useState("Empty list");
  if (protocol == "choosen_post" && message == "Empty list") {
    setMessage("No comments");
  }

  return (
    <>
      <div className="empty_message">{message}</div>
    </>
  );
};

export default EmptyList;
