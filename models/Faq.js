const mongoose = require("mongoose")

const FaqSchema = new mongoose.Schema({
    question: {
        type: String,
        unique: true,
        required: [true, "Question is Required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is Required"]
    },
    status: {
        type: Boolean,
        default: true
    }
})
const Faq = mongoose.model("Faq", FaqSchema)

module.exports = Faq