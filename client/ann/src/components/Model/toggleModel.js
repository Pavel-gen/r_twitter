import React from "react";

const toggleModel = (id) => {
    const model = document.getElementById(id)
    const textarea = document.querySelector('.textarea_create')
    textarea.innerHTML = ''
    model.classList.toggle('deactive_something')
    
}

export default toggleModel