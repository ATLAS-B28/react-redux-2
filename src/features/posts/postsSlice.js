import { createSlice } from "@reduxjs/toolkit";
import {nanoid} from "@reduxjs/toolkit"
import {sub} from 'date-fns'
const initialState = [
  {
    id: "1",
    title: "Learning redux toolkit",
    content: "I've heard good things and some bad",
    date:sub(new Date(),{minutes:10}).toISOString(),
    reactions:{
      thumbsUp:0,
      wow:0,
      heart:0,
      rocket:0,
      coffee:0
    }
  },
  { 
    id: "2", 
    title: "About the toolkit",
    content: "This is the redux toolkit",
    date:sub(new Date(),{minutes:10}).toISOString(),
    reactions:{
      thumbsUp:0,
      wow:0,
      heart:0,
      rocket:0,
      coffee:0
    } 
  },
];
//before we add a form to create new post
//we add a new reducer function that handles the data we submit
//now we will add a prepare callback whcih gnerates and formats the payload and puts it too

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.push(action.payload);
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
      const existingPost = state.find(post=>post.id===postId)
      if(existingPost) existingPost.reactions[reaction]++
    }
  },
});
//we create a selecctor in the slice so when state changes we
//do it in the slice itself instead of inidiviual components
export const selectAllPosts = (state) => state.posts;
export default postsSlice.reducer;
export const { postAdded,reactionAdded } = postsSlice.actions;
//the create slice automatically creates an action creator function with same name as post-added
