const mongoose = require("mongoose")

const MaincategorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Maincategory Name is Required"]
    },
    pic: {
        type: String,
        required: [true, "Maincategory Pic Name is Required"]
    },
    status: {
        type: Boolean,
        default: true
    }
})
const Maincategory = mongoose.model("Maincategory", MaincategorySchema)

module.exports = Maincategory