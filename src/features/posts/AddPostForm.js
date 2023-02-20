import {useState} from "react"
import React from 'react'
import {useDispatch,useSelector} from "react-redux"
import { postAdded } from "./postsSlice"
import { selectAllUsers } from "../users/usersSlice"
const AddPostForm = () => {
    const [title,setTitle] = useState('')
    const [content,setContent]  =useState('')
    const [userId,setUserId]  =useState('')//temprory state in the component
    //and we will pass it along witht the post to the global state
    const users = useSelector(selectAllUsers)
    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(e.target.value)//the user.id value will be grabbed here
    //on save post 
    //benefit of using reducer and prepare is that the component
    //need not know the structure of the state it just passes it
    const dispatch = useDispatch()
    const onSavePostClicked = ()=>{
        if(title && content){
            //dispatch -dispatches the action of postAdded
            dispatch(
                postAdded(title,content,userId)
            )
            setTitle('')
            setContent('')
        }
    }
    const canSave = Boolean(title) && Boolean(content) && Boolean(userId)
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
