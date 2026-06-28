const mongoose = require("mongoose")

const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Brand Name is Required"]
    },
    pic: {
        type: String,
        required: [true, "Brand Pic Name is Required"]
    },
    status: {
        type: Boolean,
        default: true
    }
})
const Brand = mongoose.model("Brand", BrandSchema)

module.exports = Brand