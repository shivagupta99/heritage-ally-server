const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User Full Name is Required"]
    },
    username: {
        type: String,
        unique: true,
        required: [true, "User Name is Required"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "User Email Field is Required"]
    },
    phone: {
        type: String,
        required: [true, "User Phone Number Field is Required"]
    },
    password: {
        type: String,
        required: [true, "User Password Field is Required"]
    },
    role: {
        type: String,
        default: "Buyer"
    },
    address: {
        type:Array,
        default:[],
    },
    passwordReset: {
        type:Object,
        default:{}
    },
    status: {
        type: Boolean,
        default: true
    }
})
const User = mongoose.model("User", UserSchema)

module.exports = User