const CheckoutRouter = require("express").Router()
const { authBuyer, authAdmin, authSuperAdmin } = require("../middleware/auth")
const {
    createRecord,
    getRecord,
    getUserRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    order,
    verifyOrder
} = require("../controllers/CheckoutController")

CheckoutRouter.post("",authBuyer, createRecord)
CheckoutRouter.get("",authAdmin, getRecord)
CheckoutRouter.get("/user/:_id", authBuyer,getUserRecord)
CheckoutRouter.get("/:_id",authBuyer, getSingleRecord)
CheckoutRouter.put("/:_id", authAdmin,updateRecord)
CheckoutRouter.delete("/:_id",authSuperAdmin, deleteRecord)
CheckoutRouter.post("/order",authBuyer, order)
CheckoutRouter.post("/verify-order",authBuyer, verifyOrder)



module.exports = CheckoutRouter