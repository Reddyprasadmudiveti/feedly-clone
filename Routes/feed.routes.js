import express from "express"
import { Home } from "../Models/feed.models.js"


export const router=express.Router()

router.post("/",Home)