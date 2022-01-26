import React, { useEffect, useState } from 'react' 
import {useDispatch} from 'react-redux'
import {update_user} from '../../fearutures/userSlice'


const FormUser = ({user, operation}) => {

    
    const [username, setUsername] = useState(user.username)
    const [bio, setBio] = useState(user.bio)
    const [avatar, setAvatar] = useState([user.avatar, 0])
    const [backimg, setBackimg] = useState([user.backimg, 0])
    const [email, setEmail] = useState(user.email)
    const [password, setPassword] = useState(user.password)

    const dispatch = useDispatch()


    const imageF = (e, id) => {
        const file = e
        const img = document.getElementById(id)
        const reader = new FileReader()
        if (file) {
            reader.readAsDataURL(file)
        }
        reader.onload = () => {
            const url = reader.result
            img.src = url
            img.classList.remove('default_back')
        }
       
    }


    const inputs = document.querySelectorAll('input')
    const alert = document.querySelector('.alert')
    
    const call_alert = (text) => {
        alert.classList.add('alert_active')
        alert.textContent = text
        setTimeout( () => 
            alert.classList.remove('alert_active'), 1000 )
    }


   const check = () => {
    inputs.forEach((input) => {
        if (input.value){
            input.classList.add('input_chosen')
        } else{
            input.classList.remove('input_chosen')
        }
    })
   }
   check() 

   const check_response = (state) => {

    if (state == 200){
        setUsername(``)
        setEmail(``)
        setPassword(``)

    } else if (state == 400){
        call_alert('Позывной и email уже заняты')       
    }   else if (state == 401){
        call_alert('Email уже занят')    
    } else {
        call_alert('Позывной уже занят')    
    }   
    check()
   }

    const onSubmitFormReg = async (e, dispatch) => {
        e.preventDefault()
        try {
            const url = `http://localhost:4000/api/users/registration`

            const formData = new FormData()

            formData.append('username', username)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('avatar', avatar[0])
            formData.append('bio', bio)
            formData.append('backimg', backimg[0])

            console.log(formData)

            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                },
                 body: formData

                 
            } )

            console.log(response)

            const result = await response.json()
            console.log(result)
            console.log(avatar[0])
            check_response(response.status)
            document.location.href= 'http://localhost:3000/login'
        } catch (e){
            call_alert(e.message)
            console.log(e.message)
        }
    }   


    const onSubmitFormEdit = async (e) => {
        e.preventDefault()
        try{
            const user_id = localStorage.getItem('user_id')

            const formData = new FormData()


            formData.append('username', username)
            formData.append('avatar', avatar[0])
            formData.append('bio', bio)
            formData.append('backimg', backimg[0])

            const url = `http://localhost:4000/api/users/edit/${user_id}`
            const response = await fetch(url, {
                method: 'PUT',
                cache: 'no-cache',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                },
                 body: formData
            })
            const result = await response.json()
            
              dispatch(update_user(result))
            
            
            const model = document.querySelector('.profile_model')
            model.classList.toggle('hide')
           

        } catch(e){
            console.log(e)
        }
    }
       
    useEffect(() => {
        if(backimg[0] != null && backimg[1] === 1){
          imageF(backimg[0], 'backimg_preview')
        }
    }, [backimg])    

    useEffect(() => {
        if(avatar[0] != null  && avatar[1] === 1){
          imageF(avatar[0], 'avatar_preview')
        }
    }, [avatar])   


    return (
        <div>
            <form onSubmit={operation == 'registration' ? onSubmitFormReg : onSubmitFormEdit } >

                <div className='img_container' >
                    <label for='backimg_file'>
                    {backimg[0] == null ? <div className='  form_backimg' ></div> :
                   <img className='back_img' id='backimg_preview' src={`http://localhost:4000/${backimg[0]}`} />     }
                    <p className='img_description img_back' ><span><i class="fa fa-camera" aria-hidden="true"></i>choose back</span></p>
               
                <input type="file" id="backimg_file" 
                
                onChange={(e) => {
                    setBackimg([e.target.files[0], 1])
                 //   imageF(e, 'backimg_preview')
                
                    console.log(backimg)
                        
                }} 
                />
                    </label>
                    <label className='avatar_div' for='avatar_file'>
                    <img id='avatar_preview' className='' src={avatar[0] ? `http://localhost:4000/${avatar[0]}` : 'http://localhost:4000/static/default-avatar.png'} /> 
                    <p className='img_description img_avatar_description' ><span><i class="fa fa-camera" aria-hidden="true"></i>choose avatar</span></p>
                    <input type="file" id="avatar_file" 
                
                    onChange={(e) => {
                        setAvatar([e.target.files[0], 1])
                        console.log(typeof avatar)
                        
                }}
                />     
                    </label>
                      
                </div>
                <input className='profile_input' type="text" id='username' value={username} required onChange={e => setUsername(e.target.value)} placeholder='Позывной' />    
                {operation == 'registration' ? 
                <>
                    <input  className='profile_input' type="email" id='email'value={email} required onChange={e => setEmail(e.target.value)} placeholder="email" />
                    <input className='profile_input' type="password" id='password' value={password} required onChange={e => setPassword(e.target.value)} placeholder="password" />
                </>
                :
                 <></>
                 }
                
                <textarea  className='bio_textarea' type="text" id='bio' value={bio}  onChange={e => setBio(e.target.value)} placeholder="bio" />
                {operation == 'registration' ? 
                <button className='submit-button'type='submit'>sign up</button>
                : 
                <div className='profile_btn_container'>
                       <button  className='submit-button model_cancel' onClick={(e) => {
                           e.preventDefault()
                           const model = document.querySelector('.profile_model')
                           console.log(model)
                           model.classList.toggle('hide')
                           setUsername(user.username)
                           setAvatar([user.avatar, 0])
                           setBackimg([user.backimg, 0])
                           setBio(user.bio)
                       }} >cancel</button>
                       <button className='submit-button profile_edit_btn'type='submit'>edit</button>
                </div>                  
                }
             
            </form>
    </div>)
}

export default FormUser