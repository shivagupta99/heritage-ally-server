const mongoose = require("mongoose")

const FeatureSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Feature Name is Required"]
    },
    icon: {
        type: String,
        required: [true, "Feature Icon Name is Required"]
    },
    shortDescription: {
        type: String,
        required: [true, "Feature Short Description is Required"]
    },
    status: {
        type: Boolean,
        default: true
    }
})
const Feature = mongoose.model("Feature", FeatureSchema)

module.exports = Feature