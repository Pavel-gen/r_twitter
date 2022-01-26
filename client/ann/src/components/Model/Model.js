import React, { useEffect, useState } from 'react' 
import './Model.css'
import toggleModel from './toggleModel'
import { useDispatch } from 'react-redux'
import { add_post, update_post } from '../../fearutures/postSlice'
import { useSelector } from 'react-redux'


const Model = ({id, operation, start_content}) => {

    let inner_content = useSelector((state) => state.first_blood.chosen_content)
    let tweet_id = useSelector((state) => state.first_blood.chosen_id)

    if (inner_content) inner_content = inner_content.payload

    const [content, setContent] = useState('')
    const dispatch = useDispatch()
   

    useEffect(() => {
        setContent(inner_content)
    }, [inner_content])

    const createTweet = async (dispatch) => {
        try {
            console.log(content)
            const url = 'http://localhost:4000/api/posts'
            const data = {
                content: content
            }
            const token = localStorage.getItem('token')
            const post = await fetch(url, {
                method: 'POST', 
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                body: JSON.stringify(data)
            })
            const result = await post.json()
            let new_post = result[0]
            new_post.author = result[1]
            dispatch(add_post(new_post))
            console.log(new_post)
            setContent('')
            toggleModel('postmodel')
        } catch (e) {
            console.log(e.message)
        }
    }
    
    
    const editTweet = async () => {
        try{
            const url = `http://localhost:4000/api/posts/${tweet_id.payload}`

            const data = {
                content: content
            }
            const token = localStorage.getItem('token')
            const request = await fetch(url, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                body: JSON.stringify(data)
            })

            const result = await request.json()
            toggleModel('editmodel')
            result.content = content
            dispatch(update_post(result))
            console.log(data)
            console.log(result)
            
        } catch(e){
            console.log(e)
        }
    }



    return (<>
        <div id={id} className='create_tweet_model deactive_something'>
                <div className='model_content'>
                <textarea type='text' className='textarea_create' placeholder='write something...' value={content} onChange={(e) => setContent(e.target.value)} />
                    <div className='model_btn_container'>
                    
                    {operation == 'POST' ?
                    <>
                        
                        <button className='model_cancel' onClick={
                            () => {
                                toggleModel(id)
                                setContent('')
                            }
                        } >cancel</button>
                          <button className='model_post' onClick={() => createTweet(dispatch)} >post</button> 
                    </>    
                      :
                      <>
                      <button className='model_cancel' onClick={
                        () => {
                            toggleModel(id)
                            setContent(inner_content)
                        }
                    } >cancel</button>
                        <button className='model_post' onClick={() => editTweet(tweet_id)} >edit</button>
                    </>
                        }
                        
                    </div>
                </div>
            </div>
    </>)
}



export default Model