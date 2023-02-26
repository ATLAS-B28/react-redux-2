import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";
const POST_URL = "https://jsonplaceholder.typicode.com/posts";
const initialState = {
  posts: [],
  status: "idle",
  error: null,
};
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(POST_URL);
  return response.data;
});
export const addNewPost = createAsyncThunk(
  "posts/addNewPosts",
  async (initialPost) => {
    const response = await axios.post(POST_URL, initialPost);
    return response.data;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        };
      },
    },
    reactionAdded(state,action){
      const {postId,reaction} = action.payload
      const existingPosts = state.posts.find(post=>post.id===postId)
      if(existingPosts){
        existingPosts.reactions[reaction]++
      }
    }
  },
  extraReducers(builder){
    builder
       .addCase(fetchPosts.pending,(state,action)=>{
        state.status='loading'
       })
       .addCase(fetchPosts.fulfilled,(state,action)=>{
        state.status='succeeded'
        let min =1
        const loadedPosts = action.payload.map(post=>{
          post.date = sub(new Date(),{minutes:min++}).toISOString()
          post.reactions={
            thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
          }
          return post
        })
        state.posts = state.posts.concat(loadedPosts)
       })
       .addCase(fetchPosts.rejected,(state,action)=>{
        state.status = 'failed'
        state.error = action.error.message
       })
       .addCase(addNewPost.fulfilled,(state,action)=>{
        const sortedPosts  =state.posts.sort((a,b)=>{
          if(a.id > b.id) return 1
          if(a.id < b.id) return -1
          return 0
        })
        action.payload.id = sortedPosts[sortedPosts.length-1].id+1
        action.payload.date = new Date().toISOString()
        action.payload.userId = Number(action.payload.userId)
        action.payload.reactions={
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0
        }
        console.log(action.payload)
        state.posts.push(action.payload)
       })
      
  }
});
export const selectAllPosts = (state) => state.posts.posts
export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error
export const selectPostById = (state,postId)=>{
  state.posts.posts.find(post=>post.id === postId)
}
export const {postAdded,reactionAdded} = postsSlice.actions
export default postsSlice.reducer
