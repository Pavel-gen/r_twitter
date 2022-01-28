import React from "react";

const toggleModel = (id) => {
  const model = document.getElementById(id);

  model.classList.toggle("deactive_something");
};

export default toggleModel;
