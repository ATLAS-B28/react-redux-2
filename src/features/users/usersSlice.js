import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import axios from 'axios'
const USERS_URL = "https://jsonplaceholder.typicode.com/users"

const initialState = []
export const fetchUsers = createAsyncThunk('users/fetchUsers',async ()=>{
    const response = await axios.get(USERS_URL)
    return response.data
})

const usersSlice = createSlice({
    name:'users',
    initialState,
    reducers:{},
    extraReducers(builder){
        builder.addCase(fetchUsers.fulfilled,(state,action)=>{
            return action.payload//return the payload only instead of doin the push to the state
        })
    }  
    
})
//also export its entire state
export const selectAllUsers = (state)=>state.users
export const selectUsersById  =(state,userId)=>state.users.find(user=>user.id===userId)
export default usersSlice.reducer