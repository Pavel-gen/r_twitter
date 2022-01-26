import React, { useEffect , useState} from 'react'
import ToolBar from '../ToolBar/ToolBar'
import { useSelector } from 'react-redux'
import '../ListTweet/ListTweet.css'
import FollowerToolBar from './FollowerToolBar/FollowerToolBar'
import { getUser } from '../User_page/User'
import UserItem from './User_item/UserItem'
import './UserList.css'
import EmptyList from '../EmptyList/EmptyList'
import Loading from '../Loading/Loading'

const UserList = ({type}) => {
    
const [user, setUser] = useState(null)
const [list, setList] = useState([])
const [condition, setCondition] = useState(null)

const user_id = localStorage.getItem('user_id')

const targetUser = async () => {
    const new_url = window.location.href
    console.log(new_url)
    const index = new_url.indexOf('profile/') + 8
    const new_id =  new_url.slice(index, index + 24)
    
    const start_condition = (user_id == new_id)
    setCondition(start_condition)
    console.log(condition)

    const new_user = await fetch(`http://localhost:4000/api/users/${new_id}/followers`)

    const result = await new_user.json()
    return result
}



useEffect( async () => {
    if (!user){
        const data = await targetUser()
        setUser(data)
    }
    
    if (user){
        if (type == 'followers'){
            setList(user.followers)
        } else if (type == 'following'){
            setList(user.following)
        } else if (type == 'knownfollowers'){
          let new_list = user.followers.filter((item) => {
             return item.followers.includes(user_id) == true
            })
          setList(new_list)
        }
        console.log(type)
    }
 
}, [document.location.href, user])
    





     if (!user){
        return (<>
                <div className='list_tweets '>
                <FollowerToolBar condition={!condition} user={{username: null, _id: null}} type={type} />
                <div className='f_message'>
                    <Loading/>
                </div>
                </div>
        </>)
    } 

        return (
            <>
                <div className='list_tweets '>
                <FollowerToolBar condition={!condition} user={user} type={type}/>
               
                {list.length > 0 ?
                 <div className='extra_list_users'>
                {list.map((item) => {
                  return  <UserItem user={item} />
                })}
                </div>
                : 
                <EmptyList />
                }
                
               
                </div>
            </>
        )
    
    }

    

export default UserList