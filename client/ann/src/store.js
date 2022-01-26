import {configureStore} from '@reduxjs/toolkit'

import postSlice from './fearutures/postSlice'
import userSlice from './fearutures/userSlice'

export default configureStore({
    reducer: {
        first_blood: postSlice,
        user_moves: userSlice
    },
})