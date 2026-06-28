const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product Name is Required"]
    },
    maincategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Maincategory",
        required: [true, "Product Maincategory is Required"]
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        required: [true, "Product Subcategory is Required"]
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: [true, "Product Brand is Required"]
    },
    color: {
        type: [String],
        required: [true, "Product Color is Required"],
        validate:{
            validator:function (v){
                return v && v.length > 0
            },
            message:'Please Provide Atleast One Product Color'
        }
    },
    size: {
        type: [String],
        required: [true, "Product Suze is Required"],
        validate:{
            validator:function (v){
                return v && v.length > 0
            },
            message:'Please Provide Atleast One Product Size'
        }
    },
    basePrice: {
        type: Number,
        required: [true, "Product Base Price is Required"]
    },
    discount: {
        type: Number,
        required: [true, "Product Discount is Required"]
    },
    finalPrice: {
        type: Number,
        required: [true, "Product Final Price is Required"]
    },
    stock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        required: [true, "Product Stock Quantity is Required"]
    },
    description: {
        type: String,
        default: ""
    },
    pic: {
        type: [String],
        required: [true, "Product Pic is Required"],
        validate:{
            validator:function (v){
                return v && v.length > 0
            },
            message:'Please Provide Atleast One Product Pic'
        }
    },
    status: {
        type: Boolean,
        default: true
    }
})
const Product = mongoose.model("Product", ProductSchema)

module.exports = Product