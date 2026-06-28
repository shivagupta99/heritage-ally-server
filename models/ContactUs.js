const mongoose = require("mongoose")

const ContactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name Field Is Mandatory"]
    },
    email: {
        type: String,
        required: [true, "Email Field Is Mandatory"]
    },
    phone: {
        type: String,
        required: [true, "Phone Field Is Mandatory"]
    },
    subject: {
        type: String,
        required: [true, "Subject Field Is Mandatory"]
    },
    message: {
        type: String,
        required: [true, "Message Field Is Mandatory"]
    },
    status: {
        type: Boolean,
        default: true
    }
},{timestamps:true})
const ContactUs = mongoose.model("ContactUs", ContactUsSchema)

module.exports = ContactUs