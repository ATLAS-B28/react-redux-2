import  {useSelector,useDispatch} from "react-redux"
import React,{useEffect} from 'react'
import PostsExcerpt from "./PostsExcerpt"
//import PostsExcerpt from "./PostsExcerpt"
import { selectAllPosts,
         getPostsError,
         getPostsStatus,
         fetchposts } from "./postsSlice"

const PostsList = () => {
  //define dispatch
  const dispatch = useDispatch()
  const posts = useSelector(selectAllPosts)
  const postsStatus = useSelector(getPostsStatus)
  const postsError = useSelector(getPostsError)
  useEffect(()=>{
    if(postsStatus==='idle') dispatch(fetchposts())

  },[postsStatus,dispatch])
  //order the posts according to their post date
  //const orderedPosts = posts.slice().sort((a,b)=>b.date.localeCompare(a.date))

  //const renderedPosts = orderedPosts.map(post=>(
    
  //))

  //new method to display the posts
  let content
  if(postsStatus==='loading')
  {
     content = <p>"loading..."</p>
  }
  else if(postsStatus==='succeeded')
  {
    const orderedPosts = posts.slice().sort((a,b)=>b.date.localeCompare(a.date))
    content  = orderedPosts.map(post=><PostsExcerpt key={post.id} post={post}/>)
  }
  else if(postsStatus==='failed')
  {
    content = <p>{postsError}</p>
  }
  return (
    <section>
        <h2>Posts</h2>
        {content}
    </section>
  )
}

export default PostsList
