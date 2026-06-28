const mongoose = require("mongoose")

const SettingSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: ""
    },
    map1: {
        type: String,
        default: ""
    },
    map2: {
        type: "String",
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    whatsapp: {
        type: String,
        default: ""
    },
    facebook: {
        type: String,
        default: ""
    },
    twitter: {
        type: String,
        default: ""
    },
    linkedin: {
        type: String,
        default: ""
    },
    youtube: {
        type: String,
        default: ""
    },
    instagram: {
        type: String,
        default: ""
    },
    privacyPolicy: {
        type: String,
        default: ""
    },
    termsConditions: {
        type: String,
        default: ""
    },
    refundPolicy: {
        type: String,
        default: ""
    },
})
const Setting = mongoose.model("Setting", SettingSchema)

module.exports = Setting