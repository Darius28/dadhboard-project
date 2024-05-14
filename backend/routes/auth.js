import express from "express";
import { login, signup, logout, getSessionStatus } from "../controllers/auth";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/get-session-status", getSessionStatus);

module.exports = router;
