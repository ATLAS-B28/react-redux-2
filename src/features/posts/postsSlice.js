import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";
const POST_URL = "https://jsonplaceholder.typicode.com/posts";
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});
const initialState = postsAdapter.getInitialState({
  status: "idle",
  error: null,
  count: 0,
});
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
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
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (initialPost) => {
    const { id } = initialPost;
    try {
      const response = await axios.put(`${POST_URL}/${id}`, initialPost);
      return response.data;
    } catch (error) {
      return initialPost;
    }
  }
);
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (initialPost) => {
    const { id } = initialPost;
    try {
      const reponse = await axios.delete(`${POST_URL}/${id}`);
      if (reponse?.status === 200) return initialPost;
      return `${reponse?.status} : ${reponse?.statusText}`;
    } catch (error) {
      return error.message;
    }
  }
);
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPosts = state.entities[postId]
      if (existingPosts) {
        existingPosts.reactions[reaction]++;
      }
    },
    increaseCount(state, action) {
      state.count = state.count + 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });
        //state.posts = state.posts.concat(loadedPosts)
        postsAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        //const sortedPosts  =state.posts.sort((a,b)=>{
        //if(a.id > b.id) return 1
        //if(a.id < b.id) return -1
        //return 0
        //})
        action.payload.id = state.ids[state.ids.length - 1] + 1;
       
        //action.payload.id = sortedPosts[sortedPosts.length-1].id+1
        action.payload.date = new Date().toISOString();
        action.payload.userId = Number(action.payload.userId);
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        console.log(action.payload);
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("update could not complete");
          console.log(action.payload);
          return;
        }
        //const {id} = action.payload

        //const posts = state.posts.filter(post=>post.id !== id)
        //state.posts = [...posts,action.payload]
        action.payload.date = new Date().toISOString();
        postsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("delete could not complete");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        //const posts = state.posts.filter(post => post.id !== id)
        //state.posts = posts
        postsAdapter.removeOne(state, id);
      });
  },
});
export const {
  selectAll:selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts);
//export const selectAllPosts = (state) => state.posts.posts
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
//export const selectPostById = (state, postId) =>
  //state.posts.posts.find((post) => post.id === postId);
export const getCount = (state) => state.posts.count;
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);
export const { /*postAdded*/ increaseCount, reactionAdded } =
  postsSlice.actions;
export default postsSlice.reducer;
/*postAdded: {
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
    }, */