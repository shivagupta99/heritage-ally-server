const CartRouter = require("express").Router()
const { authBuyer } = require("../middleware/auth")

const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/CartController")

CartRouter.post("", authBuyer, createRecord)
CartRouter.get("/user/:_id", authBuyer, getRecord)
CartRouter.get("/:_id", authBuyer, getSingleRecord)
CartRouter.put("/:_id", authBuyer, updateRecord)
CartRouter.delete("/:_id", authBuyer, deleteRecord)



module.exports = CartRouter