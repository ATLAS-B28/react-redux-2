import {useState} from "react"
import React from 'react'
import {useDispatch,useSelector} from "react-redux"
import { addNewPost } from "./postsSlice"
import { selectAllUsers } from "../users/usersSlice"
import { useNavigate } from "react-router-dom"
const AddPostForm = () => {
    const [title,setTitle] = useState('')
    const [content,setContent]  =useState('')
    const [userId,setUserId]  =useState('')//temprory state in the component
    //and we will pass it along witht the post to the global state
    const [addRequestStatus,setAddRequestStatus] = useState('idle')
    const users = useSelector(selectAllUsers)

    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(e.target.value)//the user.id value will be grabbed here
    //on save post 
    //benefit of using reducer and prepare is that the component
    //need not know the structure of the state it just passes it
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const canSave = [title,content,userId].every(Boolean) && addRequestStatus==='idle'
    const onSavePostClicked = ()=>{
       if(canSave){
        try {
            setAddRequestStatus('pending')
            dispatch(addNewPost({title,body:content,userId})).unwrap()
            setTitle('')
            setContent('')
            setUserId('')
            navigate('/')
        } catch (error) {
            console.log("faileed to save the post",error)
        } finally {
            setAddRequestStatus("idle")
        }
       }
    }
   
    const userOptions = users.map(user=>(
        <option value={user.id} key={user.id}>
            {user.name}
        </option>
    ))
return (
    <section>
        <h2>Add new Post</h2>
        <form action="">
            <label htmlFor="postTitle">Post title:</label>
            <input 
             type="text" 
             id='postTitle'
             name='postTitle'
             value={title}
             onChange={onTitleChanged}
            />
            <label htmlFor="postAuthor">Post author:</label>
            <select name="" id="postAuthor" value={userId} onChange={onAuthorChanged}>
                <option value=""></option>
                {userOptions}
            </select>
            <label htmlFor="postContent">Post content:</label>
            <textarea
             id='postContent'
             name='postContent'
             value={content}
             onChange={onContentChanged}
            />
            <button 
             type="button"
             onClick={onSavePostClicked} 
             disabled={!canSave}
            >
                Save Post
            </button>
        </form>
    </section>
  )
}

export default AddPostForm
