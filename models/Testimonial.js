const mongoose = require("mongoose")

const TestimonialSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is Required"]
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product Id is Required"]
    },
    message: {
        type: String,
        required: [true, "Message Field is Required"]
    },
    star: {
        type: Number,
        default: 5
    },
})
const Testimonial = mongoose.model("Testimonial", TestimonialSchema)

module.exports = Testimonial