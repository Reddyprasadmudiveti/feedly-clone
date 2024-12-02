import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { router } from "./Routes/feed.routes.js"

dotenv.config()
const PORT = process.env.PORT
const app = express()
app.use(cors({
    origin: "*"
}))
app.use(express.json())
app.use("/api/v1/", router)
app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`))