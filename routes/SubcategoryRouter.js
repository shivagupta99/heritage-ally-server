const SubcategoryRouter = require("express").Router()
const { subcategoryUploader } = require("../middleware/fileUploader")
const { authPublic, authAdmin, authSuperAdmin } = require("../middleware/auth")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/SubcategoryController")

SubcategoryRouter.post("", authAdmin, subcategoryUploader.single('pic'), createRecord)
SubcategoryRouter.get("", authPublic, getRecord)
SubcategoryRouter.get("/:_id", authPublic, getSingleRecord)
SubcategoryRouter.put("/:_id", authAdmin, subcategoryUploader.single('pic'), updateRecord)
SubcategoryRouter.delete("/:_id", authSuperAdmin, deleteRecord)


module.exports = SubcategoryRouter