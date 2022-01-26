import React, { useRef, useState } from 'react' 
import axios from 'axios'
import './Registration.css'

import FormUser from '../FormUser/FormUser'


const Registration = () => {


    return (<div className='container'>
    
        <div className='section'>
            <div className='alert'>Change email and username</div>
            <h4 className="title">Страница регистрации</h4>
            <FormUser operation='registration'             
            user={ {
                username: '',
                email: '',
                password: '',
                avatar: null,
                backimg: null,
                bio: ''
            }} />
         </div>  
    
         </div>)
}

export default Registration