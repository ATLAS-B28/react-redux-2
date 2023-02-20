import {createSlice} from "@reduxjs/toolkit"
const initialState = [
    {id:'0',name:"Aditya Bhambere"},
    {id:'1',name:"Abhijit Bhambere"},
    {id:'2',name:"Jake Peralta"},
]
const usersSlice = createSlice({
    name:'users',
    initialState,
    reducers:{
           
    }
})
//also export its entire state
export const selectAllUsers = (state)=>state.users
export default usersSlice.reducer