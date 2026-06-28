const ProductRouter = require("express").Router()
const { productUploader } = require("../middleware/fileUploader")
const { authPublic, authAdmin, authSuperAdmin, authBuyer } = require("../middleware/auth")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/productController")

ProductRouter.post("", authPublic, productUploader.array("pic"), createRecord)
ProductRouter.get("", authPublic, getRecord)
ProductRouter.get("/:_id", authPublic, getSingleRecord)
ProductRouter.put("/:_id", authBuyer, productUploader.array("pic"), updateRecord)
ProductRouter.delete("/:_id", authSuperAdmin, deleteRecord)



module.exports = ProductRouter