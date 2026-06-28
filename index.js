const express = require("express")
const cors = require("cors")
const path = require("path")

const CorsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = ["http://localhost:8000","https://heritageally-gnpy.onrender.com/"];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("You Are Not Authorized To Access This API"))
        }
    },
    credentials: true
}

require("dotenv").config()
require("./db-connect")

const Router = require("./routes/index")
const app = express()
app.use(cors(CorsOptions))

app.use(express.json())
app.use("/public", express.static("./public"))
app.use(express.static(path.join(__dirname,"dist")))

app.use("/api", Router)
app.use((req,res)=>{
    express.static(path.join(__dirname,"dist"))
})


let port = process.env.PORT || 8000
app.listen(port, console.log(`Server is Running at ${port}`))