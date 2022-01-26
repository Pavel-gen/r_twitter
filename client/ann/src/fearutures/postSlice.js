import {createSlice} from '@reduxjs/toolkit'

export const postSlice = createSlice({
    name: 'first_blood',
    initialState: {
        deleted_id: null,
        updated_post: null,
        user_id: null,
        added_post: null,
        chosen_content: null,
        chosen_id: null
    },
    reducers: {
        delete_post: (state, id) => {
            state.deleted_id = id
        },
        update_post: (state, updated_post) => {
            state.updated_post = updated_post
        },
        set_user_id: (state, id) => {
            state.user_id = id
        },
        add_post: (state, post) => {
            state.added_post = post
        },
        changed_content: (state, content) => {
            state.chosen_content = content
        },
        changed_id: (state, id) => {
            state.chosen_id = id
        }
    }
})

export const {update, delete_post, update_post, add_post, changed_content, changed_id} = postSlice.actions 
export default postSlice.reducer 