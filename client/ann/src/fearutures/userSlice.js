import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user_moves',
    initialState:{
        updated_user: null,
        chosen_user: null,
        chosen_type: null,
    },
    reducers: {
        update_user: (state, updated_user) => {
            state.updated_user = updated_user
        },
        choose_user: (state, chosen_user) => {
            state.chosen_user = chosen_user
        },
        choose_type: (state, chosen_type) => {
            state.chosen_type = chosen_type 
        },

    }
})

export const {update_user, choose_user, choose_type} = userSlice.actions
export default userSlice.reducer