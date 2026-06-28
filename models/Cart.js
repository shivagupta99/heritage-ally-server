const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema({

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
    color: {
        type: String,
        required: [true, "Product Color is Required"]
    },
    size: {
        type: String,
        required: [true, "Product Size is Required"]
    },
    qty: {
        type: Number,
        required: [true, "Product Quantity is Required"]
    },
    total: {
        type: Number,
        required: [true, "Product Total is Required"]
    },

})
const Cart = mongoose.model("Cart", CartSchema)

module.exports = Cart