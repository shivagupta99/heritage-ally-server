const jwt = require("jsonwebtoken")

function authPublic(req, res, next) {
    try {
        jwt.verify(req.headers.authorization, process.env.JWT_OPEN_KEY)
        next()
    } catch (error) {
        try {
            jwt.verify(req.headers.authorization, process.env.JWT_USER_KEY)
            next()
        } catch (error) {
            res.status(401).send({
                status: "Fail",
                reason: error.Message === "invalid signature" || error.message === "jwt must be provided" ? "You Are Not Authorized To Access This API" : "Your login session has been expired , Please login again"
            })
        }
    }
}

function authSuperAdmin(req, res, next) {
    try {
        let decode = jwt.verify(req.headers.authorization, process.env.JWT_USER_KEY)
        if (["Super Admin"].includes(decode.data.role)) {
            next()
        }
        else {
            res.send({
                status: "Fail",
                reason: "You Are Not Authorized To Access This API"
            })
        }
    } catch (error) {
        res.status(401).send({
            status: "Fail",
            reason: error.Message === "invalid signature" || error.message === "jwt must be provided" ? "You Are Not Authorized To Access This API" : "Your login session has been expired , Please login again"
        })
    }
}

function authAdmin(req, res, next) {
    try {
        let decode = jwt.verify(req.headers.authorization, process.env.JWT_USER_KEY)
        if (["Super Admin","Admin"].includes(decode.data.role)) {
            next()
        }
        else {
            res.send({
                status: "Fail",
                reason: "You Are Not Authorized To Access This API"
            })
        }
    } catch (error) {
        res.status(401).send({
            status: "Fail",
            reason: error.Message === "invalid signature" || error.message === "jwt must be provided" ? "You Are Not Authorized To Access This API" : "Your login session has been expired , Please login again"
        })
    }
}

function authBuyer(req, res, next) {
    try {
        let decode = jwt.verify(req.headers.authorization, process.env.JWT_USER_KEY)
        if (["Super Admin","Admin","Buyer"].includes(decode.data.role)) {
            next()
        }
        else {
            res.send({
                status: "Fail",
                reason: "You Are Not Authorized To Access This API"
            })
        }
    } catch (error) {
        res.status(401).send({
            status: "Fail",
            reason: error.Message === "invalid signature" || error.message === "jwt must be provided" ? "You Are Not Authorized To Access This API" : "Your login session has been expired , Please login again"
        })
    }
}



module.exports = {
    authPublic: authPublic,
    authSuperAdmin:authSuperAdmin,
    authAdmin:authAdmin,
    authBuyer,authBuyer
}