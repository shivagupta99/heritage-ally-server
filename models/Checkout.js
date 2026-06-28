const mongoose = require("mongoose")

const CheckoutSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is Required"]
    },
    deliveryAddress: {
        type: Object,
        required: [true, "Delivery Address is Required"]
    },
    orderStatus: {
        type: String,
        default: "Order Has Been Placed"
    },
    paymentMode: {
        type: String,
        default: "COD"
    },
     paymentStatus: {
        type: String,
        default: "Pending"
    },

    subTotal: {
        type: Number,
        required: [true, "Subtotal Amount is Required"]
    },
    shipping: {
        type: Number,
        required: [true, "Shippping Amount is Required"]
    },
    total: {
        type: Number,
        required: [true, "Total Amount is Required"]
    },
    rppid: {
        type: String,
        default: ""
    },
    products: {
        type: [{
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
        }],
        required: [true, "Product in Carts Are Required"],
        validate: {
            validator: function (v) {
                return v && v.length > 0
            },
            message: 'Please Provide Atleast One Cart Product'
        }
    }
}, { timestamps: true })
const Checkout = mongoose.model("Checkout", CheckoutSchema)

module.exports = Checkout