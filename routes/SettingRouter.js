const SettingRouter = require("express").Router()
const { authPublic, authAdmin } = require("../middleware/auth")
const {
    createRecord,
    getRecord,
} = require("../controllers/SettingController")

SettingRouter.post("", authAdmin,createRecord)
SettingRouter.get("", authPublic, getRecord)



module.exports = SettingRouter