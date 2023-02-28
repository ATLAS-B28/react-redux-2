import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { selectPostById ,updatePost,deletePost } from "./postsSlice";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { selectAllUsers } from "../users/usersSlice";
import React from 'react'

const EditPostFrom = () => {
    const {postId} = useParams()
    const post = useSelector((state)=> selectPostById(state,Number(postId)))
    const users = useSelector(selectAllUsers)
    const [title,setTitle] = useState(post?.title)
    const [content,setContent] = useState(post?.body)
    const [userId,setUserId] = useState(post?.userId)
    const [requestStatus,setRequestStatus] = useState('idle')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    if(!post){
        return (
            <section>
                <h2>Post Not Found!</h2>
            </section>
        )
    }
    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChnaged = e => setUserId(Number(e.target.value))
    const canSave = [title,content,userId].every(Boolean) && requestStatus==='idle'
    const onSavePostClicked = ()=>{
        if(canSave){
            try {
                setRequestStatus('pending')
                dispatch(updatePost({ id: post.id, title, body: content, userId, reactions: post.reactions })).unwrap()
                //unwarp lets go to the error catch block
                setTitle('')
                setContent('')
                setUserId('')
                navigate(`/post/${postId}`)
            } catch (error) {
                console.error('Failed to Update',error)
            } finally {
                setRequestStatus('idle')
            }
        }
    }
    const userOptions = users.map(user=>(
        <option 
         value={user.id}
         key={user.id}
        >
            {user.name}
        </option>
    ))
    const onDeletePostClicked = ()=>{
        try {
            setRequestStatus('pending')
            dispatch(deletePost({ id: post.id })).unwrap()

            setTitle('')
            setContent('')
            setUserId('')
            navigate('/')
        } catch (error) {
            console.error('Fialed to delete the post',error)
        } finally {
            setRequestStatus('idle')
        }
    }
  return (
   <section>
     <h2>Edit Post</h2>
     <form action="">
        <label htmlFor="postTitle">Post Title:</label>
        <input 
         type="text" 
         id="postTitle"
         name="postTitle"
         value={title}
         onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select 
         id="postAuthor"
         value={userId}
         onChange={onAuthorChnaged}
        >
            <option value=""></option>
            {userOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea 
         id="postContent"
         name="postContent"
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
        <button
         className="deleteButton"
         type="button"
         onClick={onDeletePostClicked}
        >
            Delete Post
        </button>
     </form>
   </section>
  )
}

export default EditPostFrom
