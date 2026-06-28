const mongoose = require("mongoose")

const SubcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Subcategory Name is Required"]
    },
    pic: {
        type: String,
        required: [true, "Subcategory Pic Name is Required"]
    },
    status: {
        type: Boolean,
        default: true
    }
})
const Subcategory = mongoose.model("Subcategory", SubcategorySchema)

module.exports = Subcategory