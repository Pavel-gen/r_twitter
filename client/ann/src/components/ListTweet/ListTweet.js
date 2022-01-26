import React, {useEffect} from 'react'
import Tweet from '../Tweet/Tweet'
import './ListTweet.css'
import { changed_id, update } from '../../fearutures/postSlice'
import { useSelector, useDispatch } from 'react-redux'
import Model from '../Model/Model'
import EmptyList from '../EmptyList/EmptyList'



const ListTweet = ({posts, user}) => {

    return (<>
        <div className='list_tweets' >
        {posts.length > 0 ? 
            posts.map(post => {
                return <Tweet key={post._id} author={user == '-' ? post.author : user} content={post.content} date={post.createdAt} id={post._id} likes={post.likes} likedBy={post.likedBy}/>
                     })
        : 
        <EmptyList/>
        }
            
        <Model id='editmodel' operation='EDIT' />
        </div>
    </>)
   

}

export default ListTweet