import mongoose from 'mongoose'
import Tweet from './Tweet.js'

const {Schema, model} = mongoose
 
const User = new Schema({
    username: {type: String, unique: true, required: true, trim: true},
    email: {type: String, unique: true, required: true, trim: true},
    password: {type: String, required: true},
    following: [{type: Schema.Types.ObjectId, ref: 'User'}],
    followers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    tweets: [{type: Schema.Types.ObjectId, ref: 'Tweet'}],
    avatar: {type: String, required: true},
    backimg: {type: String },
    bio: {type: String },
    liked: [{type: Schema.Types.ObjectId, ref: 'Tweet'}]
})

export default model('User', User)