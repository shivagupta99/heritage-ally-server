const mongoose = require("mongoose")

const NewsLetterSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Please Enter Your Registered Email Address"]
    },
    status: {
        type: Boolean,
        default: true
    }
})
const NewsLetter = mongoose.model("NewsLetter", NewsLetterSchema)

module.exports = NewsLetter