const UserRouter = require("express").Router()
const { authPublic, authBuyer, authAdmin, authSuperAdmin } = require("../middleware/auth")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    login,
    forgetPassword1,
    forgetPassword2,
    forgetPassword3
} = require("../controllers/UserController")

UserRouter.post("", authPublic, createRecord)
UserRouter.get("", authAdmin, getRecord)
UserRouter.get("/:_id", authBuyer, getSingleRecord)
UserRouter.put("/:_id", authBuyer, updateRecord)
UserRouter.delete("/:_id", authSuperAdmin, deleteRecord)
UserRouter.post("/login", authPublic, login)
UserRouter.post("/forget-password-1", authPublic, forgetPassword1)
UserRouter.post("/forget-password-2", authPublic, forgetPassword2)
UserRouter.post("/forget-password-3", authPublic, forgetPassword3)




module.exports = UserRouter