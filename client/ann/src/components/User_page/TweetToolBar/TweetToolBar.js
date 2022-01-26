import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import '../../UserList/FollowerToolBar/FollowerToolBar.css'


const TweetToolBar = ({user, type}) => {

useEffect(() => {
    const start_el = document.getElementById(type)
    console.log(start_el)
    if (start_el){
        start_el.classList.remove('hide')
    }
}, [document.location.href, type])
    
   

    const colorBlind = (e) => {
        const btns = document.querySelectorAll('.button_line')
        btns.forEach((btn) => {
            btn.classList.add('hide')
        })
        const chosen_div = e.currentTarget.querySelector('.button_line')
        chosen_div.classList.remove('hide')
    }
    
    const navigate = useNavigate()
        return (<>

        <div className='f_container extra_list_users' id='f_btn_cont'>
             <button   className='f_btn' onClick={(e)=> {
                e.preventDefault()
                colorBlind(e)
                navigate(`/profile/${user._id}/`)
            }} >tweets<div id='tweets' className='button_line hide'></div></button> 
            <button className='f_btn'

            id='replies'

            onClick={(e)=> {
                e.preventDefault()
                colorBlind(e)
            }}
            >replies<div className='button_line hide'></div></button>

        <button className='f_btn'  

        

        onClick={(e)=> {
        e.preventDefault()
        colorBlind(e)
        }}
        >media<div id='media' className='button_line hide'></div></button>

            <button className='f_btn' 
            
            onClick={(e)=> {
                e.preventDefault()
                colorBlind(e)
                navigate(`/profile/${user._id}/likes`)
                
            }}
            >likes<div id='likes' className='button_line hide'></div></button>
        </div>
    </>)

}

export default TweetToolBar