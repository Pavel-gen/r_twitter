import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { set_user_id } from "../../fearutures/postSlice"

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    

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
        setPassword(``)

    } else if (state == 401){
        call_alert('User is not found')       
    }  else {
        call_alert('Invalid password')    
    }   
    check()
   }

    const onSubmitForm = async (e) => {
        e.preventDefault()
        try {
            const url = `http://localhost:4000/api/users/login`

            const data =  {
                username: username,
                password: password
            }
        
            const response = await fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': "application/json"
                },
                 body: JSON.stringify(data)
            } )
            const arr = await response.json()
            console.log(arr)
            const {token} = arr[0]
            const {id} = arr[0]
            
            check_response(response.status)
            localStorage.setItem('token', token)
            localStorage.setItem('user_id', id)

            document.location.href= `http://localhost:3000/profile/${id}`

        } catch (e){
            call_alert(e.message)
        }   
}
    
    return (<div className='container'>
    
        <div className='section'>
            <div className='alert'>Change email and username</div>
            <h4 className="title">Login</h4>
            <form onSubmit={onSubmitForm} >
                <input className='profile_input' type="text" id='username' value={username} required onChange={e => setUsername(e.target.value)} placeholder='Позывной' />    
                <input className='profile_input' type="password" id='password' value={password} required onChange={e => setPassword(e.target.value)} placeholder="password" />
                <button className='submit-button'type='submit'>login</button>
            </form>
         </div>  
     </div>)
}

export default Login