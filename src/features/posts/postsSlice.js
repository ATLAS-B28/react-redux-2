import { createSlice,nanoid,createAsyncThunk } from "@reduxjs/toolkit";
import {sub } from 'date-fns'
import axios from "axios"
const URL = "https://jsonplaceholder.typicode.com/posts"

const initialState = {
  posts:[],
  status:'idle',
  error:null
}//from .posts to posts property
//before we add a form to create new post
//we add a new reducer function that handles the data we submit
//now we will add a prepare callback whcih gnerates and formats the payload and puts it too

//lets fetch pots from the usrl
export const fetchposts = createAsyncThunk('posts/fetchPosts',async ()=>{
    const response = await axios.get(URL)
    return response.data
})
//add new post and fetch them
export const addNewPost = createAsyncThunk('posts/addNewPost',async (initialPost)=>{
  const response = await axios.post(URL,initialPost)//initial post's body that is past in the request
  return response.data
})
//sometimes slice's reducer need to respond to actions  
//which were not defined as the slice's reducers
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload);
      }, //here state is non mutable
      //under the hood redux uses immerJS that creates a new state
      //this is applicable inside the createSlice only
     prepare(title,content,userId){
        return {
            payload:{
                id:nanoid(),
                title,
                content,
                date:new Date().toISOString(),
                userId,
                reactions:{
                  thumbsUp:0,
                  wow:0,
                  heart:0,
                  rocket:0,
                  coffee:0
                }
            }
        }
     }
    },//now another a reducer func
    reactionAdded(state,action){
      const {postId,reaction} = action.payload
      const existingPost = state.posts.find(post=>post.id===postId)
      if(existingPost) existingPost.reactions[reaction]++
    }
  },
  //adding extra reducer with a param called builder which is an object
  //which lets use define additional case reducers that run 
  //in response to actions defined outside the slice's reducer
  extraReducers(builder){//here the cases are of the listening
    // for the promise 
    //action types that are dispatched
    // by the fetchposts and addNewPosts thunk
    builder
      .addCase(fetchposts.pending,(state,action)=>{
        state.status='loading'
      })
      .addCase(fetchposts.fulfilled,(state,action)=>{
        state.status = 'succeeded'
        //adding date and reactions too
        let min = 1
        const loadPosts = action.payload.map(post=>{
          post.date=sub(new Date(),{minutes:min++}).toISOString()
          post.reactions={
            thumbsUp:0,
            wow:0,
            heart:0,
            rocket:0,
            coffee:0
          }
          return post
        })
        //add any fetched posts to array
        state.posts = state.posts.concat(loadPosts)
      })
      .addCase(fetchposts.rejected,(state,action)=>{
        state.status='failed'
        state.failed=action.error.message
      })
      .addCase(addNewPost.fulfilled,(state,action)=>{
        const sortedPosts = state.posts.sort((a, b) => {
          if (a.id > b.id) return 1
          if (a.id < b.id) return -1
          return 0
      })
      action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
        action.payload.userId = Number(action.payload.userId)
        action.payload.date = new Date().toISOString()
        action.payload.reactions={
          thumbsUp:0,
          wow:0,
          heart:0,
          rocket:0,
          coffee:0
        }
        console.log(action.payload)
        state.posts.push(action.payload)
      })
  }
});
//we create a selecctor in the slice so when state changes we
//do it in the slice itself instead of inidiviual components
export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state)=>state.posts.status
export const getPostsError = (state)=>state.posts.error
export default postsSlice.reducer;
export const { postAdded,reactionAdded } = postsSlice.actions;
//the create slice automatically creates an action creator function with same name as post-added
