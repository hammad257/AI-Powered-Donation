import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: typeof window !== 'undefined' && localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null,
    token: typeof window !== 'undefined' && localStorage.getItem('token')
      ? localStorage.getItem('token')
      : null,
    profilePicture:''  
  };

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;

            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        },
        logout: (state, action) => {
            state.user = null;
            state.token = null;

            localStorage.removeItem('user');
      localStorage.removeItem('token');
        },
        setProfilePicture: (state, action) => {
            console.log(state,'state');
            console.log(action,'action');
            state.profilePicture = action.payload
             
        }
    },
});

export const { setCredentials, logout, setProfilePicture } = authSlice.actions;
export default authSlice.reducer;